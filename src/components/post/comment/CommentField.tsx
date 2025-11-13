import PostHeader from "../PostHeader";
import { CommentContainer, CommentContent } from "./CommentField.styled";
import styled from "styled-components";

interface CommentFieldProps {
  commentId: string;
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  content: string;
  dateTime: string;
  dateText: string;
  isLiked?: boolean;
  likeCount?: number;
  onLikeClick?: () => void;
}

const CommentFooter = styled.div`
  padding: 0.8rem 0 0 4.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const LikeButton = styled.button<{ $liked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  font-size: 1.2rem;
  color: ${(props) =>
    props.$liked ? "var(--color-primary)" : "var(--color-gray-dark)"};
  transition: all 0.2s;

  &:hover {
    background: var(--color-gray-light);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

function CommentField({
  commentId,
  userName,
  userId,
  avatarSrc,
  avatarAlt,
  content,
  dateTime,
  dateText,
  isLiked = false,
  likeCount = 0,
  onLikeClick,
}: CommentFieldProps) {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeClick) {
      onLikeClick();
    }
  };

  return (
    <CommentContainer>
      <PostHeader
        variant="comment"
        userName={userName}
        userId={userId}
        avatarSrc={avatarSrc}
        avatarAlt={avatarAlt}
        postId={commentId}
        dateTime={dateTime}
        dateText={dateText}
      />
      <CommentContent>{content}</CommentContent>
      <CommentFooter>
        <LikeButton
          $liked={isLiked}
          onClick={handleLikeClick}
          aria-label="댓글 좋아요"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{likeCount}</span>
        </LikeButton>
      </CommentFooter>
    </CommentContainer>
  );
}

export default CommentField;
