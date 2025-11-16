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
  likePost,
  unlikePost,
  deleteComment,
  updateComment,
  reportComment,
  reportPost,
  deletePost,
} from "../../services/postService";
import { useAuth } from "../../contexts/AuthContext";
import { useHeader } from "../../contexts/HeaderContext";
import MoreMenu from "../../components/common/modal/MoreMenu";

interface Author {
  _id: string;
  username: string;
  accountname: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: [];
  follower: [];
  followerCount: number;
  followingCount: number;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  hearted: boolean;
  heartCount: number;
  comments: Comment[];
  commentCount: number;
  author: Author;
}

interface CommentAuthor {
  _id: string;
  username: string;
  accountname: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: [];
  follower: [];
  followerCount: number;
  followingCount: number;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  hearted: boolean;
  heartCount: number;
}

function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { setHeaderConfig } = useHeader();
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastCommentRef = useRef<HTMLDivElement>(null);

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    if (!postId) return;

    try {
      await deletePost(postId);
      console.log("게시글 삭제 성공");
      navigate(-1);
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 디버깅: 현재 사용자 정보 확인
  useEffect(() => {}, [currentUser]);

  // 게시글 및 댓글 데이터 불러오기
  useEffect(() => {
    const loadPostData = async () => {
      if (!postId) return;

      try {
        setIsLoading(true);
        const [postData, commentsData] = await Promise.all([
          fetchPostDetail(postId),
          fetchPostComments(postId),
        ]);

        // console.log("🔄 PostDetail 데이터 로드:", {
        //   id: postData?.id,
        //   content: postData?.content?.substring(0, 50),
        //   image: postData?.image,
        // });
        setPost(postData);
        // 댓글을 역순으로 정렬 (오래된 댓글이 위로)
        setComments([...commentsData].reverse());
      } catch (error) {
        console.error("게시글 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostData();
  }, [postId, location.search]);

  // 헤더 설정 (post 로드 후)
  useEffect(() => {
    if (!post) return;

    setHeaderConfig({
      show: true,
      type: "postDetail",
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
  }, [post, postId, setHeaderConfig, navigate]);

  const handleCommentSubmit = async (
    text: string,
    refObj: React.RefObject<HTMLTextAreaElement | null>
  ) => {
    if (!text.trim() || !postId) return;

    try {
      const newComment = await createComment(postId, text);

      // 성공 시 textarea 초기화
      if (refObj.current) {
        refObj.current.value = "";
        refObj.current.style.height = "auto";
      }

      if (newComment) {
        setComments((prev) => {
          const updated = [...prev, newComment]; // 최신 댓글이 아래로

          return updated;
        });
        setCommentText("");

        // 댓글 수 업데이트
        if (post) {
          setPost({ ...post, commentCount: post.commentCount + 1 });
        }

        // 새로 작성한 댓글로 스크롤 (아래로)
        setTimeout(() => {
          lastCommentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        // fallback: 목록 새로고침
        const updatedComments = await fetchPostComments(postId);

        // 댓글을 역순으로 정렬 (오래된 댓글이 위로)
        setComments([...updatedComments].reverse());
        setCommentText("");
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  const handleLikeClick = async () => {
    if (!postId || !post) return;

    const prevPost = post;

    // 낙관적 업데이트
    setPost({
      ...post,
      hearted: !post.hearted,
      heartCount: post.hearted ? post.heartCount - 1 : post.heartCount + 1,
    });

    try {
      // API 호출 및 응답으로 상태 업데이트
      const updatedPost = post.hearted
        ? await unlikePost(postId)
        : await likePost(postId);

      if (updatedPost) {
        setPost(updatedPost);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      // 실패 시 롤백
      setPost(prevPost);
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: string) => {
    if (!postId) return;

    const prevComments = [...comments];

    // 낙관적 업데이트 - 즉시 UI에서 제거
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    // 댓글 수 감소
    if (post) {
      setPost({ ...post, commentCount: post.commentCount - 1 });
    }

    try {
      await deleteComment(postId, commentId);
      //console.log("댓글 삭제 성공");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      // 실패 시 롤백
      setComments(prevComments);
      if (post) {
        setPost({ ...post, commentCount: post.commentCount + 1 });
      }
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 댓글 수정 핸들러
  const handleCommentUpdate = async (
    commentId: string,
    newContent: string
  ): Promise<void> => {
    if (!postId || !newContent.trim()) {
      console.log("댓글 수정 중단: postId 또는 newContent가 없음", {
        postId,
        newContent,
      });
      return;
    }

    //console.log("댓글 수정 시작:", { postId, commentId, newContent });

    const prevComments = [...comments];

    try {
      const updatedComment = await updateComment(
        postId,
        commentId,
        newContent.trim()
      );

      if (updatedComment) {
        // 댓글 목록에서 해당 댓글 업데이트
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? updatedComment : c))
        );
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      // 실패 시 롤백
      setComments(prevComments);
      alert("댓글 수정에 실패했습니다.");
      throw error; // 에러를 다시 던져서 CommentField에서 catch할 수 있게 함
    }
  };

  // 댓글 신고 핸들러
  const handleCommentReport = async (commentId: string) => {
    if (!postId) return;

    try {
      await reportComment(postId, commentId);
      alert("댓글이 신고되었습니다.");
    } catch (error) {
      console.error("댓글 신고 실패:", error);
      alert("댓글 신고에 실패했습니다.");
    }
  };

  // 게시글 신고 핸들러
  const handlePostReport = async () => {
    if (!postId) return;

    try {
      await reportPost(postId);
      alert("게시글이 신고되었습니다.");
    } catch (error) {
      console.error("게시글 신고 실패:", error);
      alert("게시글 신고에 실패했습니다.");
    }
  };

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

  // 내 게시글인지 확인
  const isMyPost = currentUser?.accountname === post.author.accountname;

  return (
    <PostDetailContainer>
      {/* 게시글 카드 */}
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

      {/* 댓글 섹션 */}
      <CommentsSection>
        {comments.map((comment, index) => {
          const isMyComment =
            currentUser?.accountname === comment.author.accountname;
          // console.log(
          //   `댓글 ${index}:`,
          //   `currentUser=${currentUser?.accountname}`,
          //   `commentAuthor=${comment.author.accountname}`,
          //   `isMyComment=${isMyComment}`,
          //   `userName=${comment.author.username}`
          // );
          return (
            <div
              key={comment.id}
              ref={index === comments.length - 1 ? lastCommentRef : null}
              style={{ scrollMarginBottom: "150px" }}
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

      {/* 댓글 입력 필드 */}
      <TextField
        left={
          <img
            src="/img/empty-profile.png"
            alt="내 프로필"
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
