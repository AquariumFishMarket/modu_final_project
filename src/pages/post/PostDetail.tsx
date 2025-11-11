import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import PostCard from "../../components/post/postCard/PostCard";
import CommentField from "../../components/post/comment/CommentField";
import TextField from "../../components/common/TextField";
import { dummyPosts } from "../../data/dummyPosts";
import { PostDetailContainer, CommentsSection } from "./PostDetail.styled";

// 더미 댓글 데이터
const dummyComments = [
  {
    commentId: "comment-1",
    userName: "니모아빠",
    userId: "@sajawamoooo",
    avatarSrc: "/img/empty-profile.png",
    avatarAlt: "사자와 무슨농장 프로필",
    content: "게시글 넘나 이쁘네요!!",
    dateTime: "2024-10-21T13:00:00",
    dateText: "3분 전",
  },
  {
    commentId: "comment-2",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/empty-profile.png",
    avatarAlt: "김수산 프로필",
    content: "인사해요.",
    dateTime: "2024-10-21T12:30:00",
    dateText: "10분 전",
  },
];

function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");

  // postId로 게시글 찾기
  const post = dummyPosts.find((p) => p.postId === postId);

  if (!post) {
    return (
      <PostDetailContainer>
        <p>게시글을 찾을 수 없습니다.</p>
      </PostDetailContainer>
    );
  }

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      // API 연동 시 댓글 등록 로직 추가
      console.log("댓글 등록:", commentText);
      setCommentText("");
    }
  };

  const handleLikeClick = () => {
    // API 연동 시 좋아요 토글 로직 추가
    console.log("좋아요 클릭");
  };

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
        {dummyComments.map((comment) => (
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
            src="/img/empty-profile.png"  // TODO: API 연동 시 현재 로그인한 사용자 프로필 이미지로 변경
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
