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
  likePost,
  unlikePost,
} from "../../services/postService";

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
  comments: [];
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

  const handleCommentSubmit = async (
    text: string,
    refObj: React.RefObject<HTMLTextAreaElement | null>
  ) => {
    console.log("댓글 등록 시작", { text, postId }); // 추가
    if (!text.trim() || !postId) return;

    try {
      const newComment = await createComment(postId, text);

      // 성공 시 textarea 초기화
      if (refObj.current) {
        refObj.current.value = "";
        refObj.current.style.height = "auto";
      }

      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");

        // 댓글 수 업데이트
        if (post) {
          setPost({ ...post, commentCount: post.commentCount + 1 });
        }
      } else {
        // fallback: 목록 새로고침
        const updatedComments = await fetchPostComments(postId);
        setComments(updatedComments);
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
        onLikeClick={handleLikeClick}
      />

      {/* 댓글 섹션 */}
      <CommentsSection>
        {comments.map((comment) => (
          <CommentField
            key={comment.id}
            commentId={comment.id}
            userName={comment.author.username}
            userId={comment.author.accountname}
            avatarSrc={comment.author.image}
            avatarAlt={`${comment.author.username} 프로필`}
            content={comment.content}
            dateTime={comment.createdAt}
            dateText={comment.createdAt}
          />
        ))}
      </CommentsSection>

      {/* 댓글 입력 필드 */}
      <TextField
        left={
          <img
            src="/img/empty-profile.png" // TODO: API 연동 시 현재 로그인한 사용자 프로필 이미지로 변경
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
