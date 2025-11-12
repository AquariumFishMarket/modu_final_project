import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PostCard from "../../components/post/postCard/PostCard";
import CommentField from "../../components/post/comment/CommentField";
import TextField from "../../components/common/TextField";
import { PostDetailContainer, CommentsSection } from "./PostDetail.styled";
import {
  fetchPostDetail,
  fetchPostComments,
  createComment,
  togglePostLike,
} from "../../services/postService";

interface Post {
  postId: string;
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  dateTime: string;
  dateText: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

interface Comment {
  commentId: string;
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  content: string;
  dateTime: string;
  dateText: string;
}

function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error("게시글 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostData();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postId) return;

    try {
      await createComment(postId, commentText);
      // 댓글 목록 새로고침
      const updatedComments = await fetchPostComments(postId);
      setComments(updatedComments);
      setCommentText("");

      // 댓글 수 업데이트
      if (post) {
        setPost({ ...post, commentCount: post.commentCount + 1 });
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  const handleLikeClick = async () => {
    if (!postId || !post) return;

    const prevPost = post;
    const currentIsLiked = post.isLiked;

    // 낙관적 업데이트
    setPost({
      ...post,
      isLiked: !post.isLiked,
      likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
    });

    try {
      await togglePostLike(postId, currentIsLiked);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      // 실패 시 롤백
      setPost(prevPost);
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

  return (
    <PostDetailContainer>
      {/* 게시글 카드 */}
      <PostCard
        postId={post.postId}
        userName={post.userName}
        userId={post.userId}
        avatarSrc={post.avatarSrc}
        avatarAlt={post.avatarAlt}
        content={post.content}
        imageSrc={post.imageSrc}
        imageAlt={post.imageAlt}
        dateTime={post.dateTime}
        dateText={post.dateText}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        isLiked={post.isLiked}
        onLikeClick={handleLikeClick}
      />

      {/* 댓글 섹션 */}
      <CommentsSection>
        {comments.map((comment) => (
          <CommentField
            key={comment.commentId}
            commentId={comment.commentId}
            userName={comment.userName}
            userId={comment.userId}
            avatarSrc={comment.avatarSrc}
            avatarAlt={comment.avatarAlt}
            content={comment.content}
            dateTime={comment.dateTime}
            dateText={comment.dateText}
          />
        ))}
      </CommentsSection>

      {/* 댓글 입력 필드 */}
      <TextField
        left={
          <img
            src="/img/empty-profile.png"
            alt="내 프로필"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover'
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
