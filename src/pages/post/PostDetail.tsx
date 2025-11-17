import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import PostCard from "../../components/post/postCard/PostCard";
import CommentField from "../../components/post/comment/CommentField";
import TextField from "../../components/common/TextField";
import { PostDetailContainer, CommentsSection } from "./PostDetail.styled";

import {
  fetchPostDetail,
  fetchPostComments,
  createComment,
  deleteComment,
  updateComment,
  reportComment,
  reportPost,
  deletePost,
} from "../../services/postService";
import { useFeedStore } from "../../contexts/useFeedStore";
import { useAuthStore } from "../../contexts/useAuthStore";
import { useHeader } from "../../contexts/HeaderContext";
import MoreMenu from "../../components/common/modal/MoreMenu";

import {
  likePost as apiLikePost,
  unlikePost as apiUnlikePost,
} from "../../services/postService";

function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((s) => s.user);
  const { setHeaderConfig } = useHeader();

  const updateFeedPost = useFeedStore((state) => state.updatePost);

  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastCommentRef = useRef<HTMLDivElement>(null);

  // 피드의 해당 게시글 상태
  const feedItem = useFeedStore((state) =>
    state.feedList.find((f) => f.id === postId)
  );

  useEffect(() => {
    if (!feedItem || !post) return;

    const sameHearted = post.hearted === feedItem.isLiked;
    const sameHeartCount = post.heartCount === feedItem.likeCount;
    const sameCommentCount = post.commentCount === feedItem.commentCount;

    if (sameHearted && sameHeartCount && sameCommentCount) return;

    setPost((prev: any) =>
      prev
        ? {
            ...prev,
            hearted: feedItem.isLiked,
            heartCount: feedItem.likeCount,
            commentCount: feedItem.commentCount,
          }
        : prev
    );
  }, [
    feedItem?.isLiked,
    feedItem?.likeCount,
    feedItem?.commentCount,
    post?.id,
  ]);

  //  게시글 삭제
  const handleDeletePost = async () => {
    if (!postId) return;

    try {
      await deletePost(postId);
      navigate(-1);
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  //  게시글 + 댓글 로드
  useEffect(() => {
    const loadPostData = async () => {
      if (!postId) return;

      setIsLoading(true);

      try {
        const [postData, commentsData] = await Promise.all([
          fetchPostDetail(postId),
          fetchPostComments(postId),
        ]);

        setPost(postData || null);
        setComments([...commentsData].reverse());
      } catch (error) {
        console.error("상세 페이지 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostData();
  }, [postId, location.search]);

  //  게시글 신고
  const handlePostReport = async () => {
    if (!postId) return;

    try {
      await reportPost(postId);
      alert("게시글이 신고되었습니다.");
    } catch (err) {
      console.error("게시글 신고 실패:", err);
    }
  };

  //  헤더 설정
  useEffect(() => {
    if (!post) return;

    setHeaderConfig({
      show: true,
      type: "postDetail",
      pageTitle: "게시글 상세",
      onBackClick: () => navigate(-1),
      rightElement: (
        <MoreMenu
          type="post"
          authorAccountname={post.author.accountname}
          onEdit={() => navigate(`/post/${postId}/edit`)}
          onDelete={handleDeletePost}
          onReport={handlePostReport}
        />
      ),
    });
  }, [post, setHeaderConfig, navigate, postId]);

  // 댓글 작성
  const handleCommentSubmit = async (
    text: string,
    refObj: React.RefObject<HTMLTextAreaElement | null>
  ) => {
    if (!text.trim() || !postId) return;

    try {
      const newComment = await createComment(postId, text);

      if (!newComment) return;

      if (refObj.current) {
        refObj.current.value = "";
        refObj.current.style.height = "auto";
      }

      setComments((prev) => [...prev, newComment]);
      setCommentText("");

      const newPost = {
        ...post,
        commentCount: post.commentCount + 1,
      };

      setPost(newPost);
      updateFeedPost(newPost);

      setTimeout(() => {
        lastCommentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  // 좋아요
  const handleLikeClick = async () => {
    if (!postId || !post) return;

    const prev = post;
    const isLikedNow = post.hearted;

    // 낙관적 업데이트
    const optimistic = {
      ...post,
      hearted: !isLikedNow,
      heartCount: isLikedNow ? post.heartCount - 1 : post.heartCount + 1,
    };
    setPost(optimistic);

    try {
      const updated = isLikedNow
        ? await apiUnlikePost(postId)
        : await apiLikePost(postId);

      if (updated) {
        setPost(updated);

        updateFeedPost(updated);
      } else {
        setPost(prev);
      }
    } catch (err) {
      console.error("상세 좋아요 실패:", err);
      setPost(prev);
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId: string) => {
    if (!postId) return;

    const prevComments = [...comments];

    try {
      await deleteComment(postId, commentId);

      setComments((prev) => prev.filter((c) => c.id !== commentId));

      const newPost = {
        ...post,
        commentCount: post.commentCount - 1,
      };

      setPost(newPost);
      updateFeedPost(newPost);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      setComments(prevComments);
    }
  };

  // 댓글 수정
  const handleCommentUpdate = async (commentId: string, newContent: string) => {
    if (!postId || !newContent.trim()) return;

    const prevComments = [...comments];

    try {
      const updated = await updateComment(postId, commentId, newContent.trim());

      if (updated) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? updated : c))
        );

        updateFeedPost(post);
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      setComments(prevComments);
      throw error;
    }
  };

  // 댓글 신고
  const handleCommentReport = async (commentId: string) => {
    if (!postId) return;

    try {
      await reportComment(postId, commentId);
      alert("댓글이 신고되었습니다.");
    } catch (err) {
      console.error("댓글 신고 실패:", err);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <PostDetailContainer>
        <p>로딩 중...</p>
      </PostDetailContainer>
    );
  }

  if (!post) {
    return (
      <PostDetailContainer>
        <p>게시글을 찾을 수 없습니다.</p>
      </PostDetailContainer>
    );
  }

  const isMyPost = currentUser?.accountname === post.author.accountname;

  return (
    <PostDetailContainer>
      <PostCard
        postId={post.id}
        userName={post.author.username}
        userId={post.author.accountname}
        avatarSrc={post.author.image}
        avatarAlt={`${post.author.username} 프로필`}
        content={post.content}
        imageSrc={post.image}
        imageAlt={post.image ? "게시글 이미지" : undefined}
        dateTime={post.createdAt}
        likeCount={post.heartCount}
        commentCount={post.commentCount}
        isLiked={post.hearted}
        isMyPost={isMyPost}
        onLikeClick={handleLikeClick}
        onReportClick={handlePostReport}
      />

      <CommentsSection>
        {comments.map((comment, index) => {
          const isMyComment =
            currentUser?.accountname === comment.author.accountname;

          return (
            <div
              key={comment.id}
              ref={index === comments.length - 1 ? lastCommentRef : null}
            >
              <CommentField
                commentId={comment.id}
                userName={comment.author.username}
                userId={comment.author.accountname}
                avatarSrc={comment.author.image}
                avatarAlt={`${comment.author.username} 프로필`}
                content={comment.content}
                dateTime={comment.createdAt}
                dateText={comment.createdAt}
                isLiked={comment.hearted}
                likeCount={comment.heartCount}
                isMyComment={isMyComment}
                onDelete={() => handleCommentDelete(comment.id)}
                onUpdate={(newContent) =>
                  handleCommentUpdate(comment.id, newContent)
                }
                onReport={() => handleCommentReport(comment.id)}
              />
            </div>
          );
        })}
      </CommentsSection>

      <TextField
        left={
          <img
            src={currentUser?.image || "/img/empty-profile.png"}
            alt={`${currentUser?.username} 프로필`}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        }
        placeholder="댓글 입력하기..."
        onClick={handleCommentSubmit}
      />
    </PostDetailContainer>
  );
}

export default PostDetail;
