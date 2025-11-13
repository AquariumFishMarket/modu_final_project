import PostHeader from "../PostHeader";
import { CommentContainer, CommentContent } from "./CommentField.styled";
import styled from "styled-components";
import { useState } from "react";

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
  isMyComment?: boolean;
  onDelete?: () => void;
  onUpdate?: (newContent: string) => Promise<void>;
  onReport?: () => void;
}

const CommentFooter = styled.div`
  padding: 0.8rem 0 0 4.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const EditArea = styled.div`
  padding: 0.8rem 0 0 4.8rem;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 6rem;
  padding: 0.8rem;
  border: 1px solid var(--color-gray-medium);
  border-radius: 0.4rem;
  font-size: 1.4rem;
  line-height: 1.8rem;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const EditButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.8rem;
`;

const EditButton = styled.button<{ $primary?: boolean }>`
  padding: 0.6rem 1.2rem;
  border-radius: 0.4rem;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) =>
    props.$primary ? "var(--color-primary-600)" : "transparent"};
  color: ${(props) => (props.$primary ? "#fff" : "var(--color-gray-dark)")};
  border: 1px solid
    ${(props) =>
      props.$primary ? "var(--color-primary-600)" : "var(--color-gray-medium)"};

  &:hover {
    background-color: ${(props) =>
      props.$primary ? "var(--color-primary-700)" : "var(--color-gray-light)"};
  }
`;

const LikeButton = styled.button<{ $liked: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem;
  margin: -0.4rem;
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  transition: color 0.2s;
`;

const HeartLabel = styled.div<{ $liked: boolean }>`
  position: relative;
  font-size: 1rem;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$liked ? "#e2264d" : "transparent")};
  stroke: ${(props) => (props.$liked ? "#e2264d" : "var(--color-gray-dark)")};
  stroke-width: 0.2rem;
  filter: ${(props) => (props.$liked ? "none" : "grayscale(1)")};
  transition: filter 0.5s;

  svg {
    width: 2rem;
    height: 2rem;
    transition: transform 0.3s;
    animation: ${(props) =>
      props.$liked ? "heart 1s cubic-bezier(0.17, 0.89, 0.32, 1.49)" : "none"};
  }

  &::before,
  &::after {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    content: "";
  }

  &::before {
    display: none;
  }

  &::after {
    margin: -0.1875rem;
    width: 0.375rem;
    height: 0.375rem;
    opacity: ${(props) => (props.$liked ? 1 : 0)};
    animation: ${(props) => (props.$liked ? "sparkles 1s ease-out" : "none")};
    box-shadow: 0 -2.8125rem 0 -0.1875rem hsl(0, 100%, 75%),
      1.6875rem -2.8125rem 0 -0.1875rem hsl(0, 100%, 75%),
      2.4375rem -1.125rem 0 -0.1875rem hsl(51.43, 100%, 75%),
      2.4375rem 1.125rem 0 -0.1875rem hsl(102.86, 100%, 75%),
      1.6875rem 2.8125rem 0 -0.1875rem hsl(102.86, 100%, 75%),
      0 3.375rem 0 -0.1875rem hsl(154.29, 100%, 75%),
      -1.6875rem 2.8125rem 0 -0.1875rem hsl(154.29, 100%, 75%),
      -2.4375rem 1.125rem 0 -0.1875rem hsl(205.71, 100%, 75%),
      -2.4375rem -1.125rem 0 -0.1875rem hsl(257.14, 100%, 75%),
      -1.6875rem -2.8125rem 0 -0.1875rem hsl(257.14, 100%, 75%),
      0 -3.375rem 0 -0.1875rem hsl(308.57, 100%, 75%),
      1.6875rem -2.8125rem 0 -0.1875rem hsl(308.57, 100%, 75%);
  }

  @keyframes heart {
    0%,
    17.5% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes sparkles {
    0%,
    20% {
      opacity: 0;
    }
    25% {
      opacity: 1;
      box-shadow: 0 -2.25rem 0 0 hsl(0, 100%, 75%),
        1.125rem -2.25rem 0 0 hsl(0, 100%, 75%),
        1.6875rem -0.75rem 0 0 hsl(51.43, 100%, 75%),
        1.6875rem 0.75rem 0 0 hsl(102.86, 100%, 75%),
        1.125rem 2.25rem 0 0 hsl(102.86, 100%, 75%),
        0 2.8125rem 0 0 hsl(154.29, 100%, 75%),
        -1.125rem 2.25rem 0 0 hsl(154.29, 100%, 75%),
        -1.6875rem 0.75rem 0 0 hsl(205.71, 100%, 75%),
        -1.6875rem -0.75rem 0 0 hsl(257.14, 100%, 75%),
        -1.125rem -2.25rem 0 0 hsl(257.14, 100%, 75%),
        0 -2.8125rem 0 0 hsl(308.57, 100%, 75%),
        1.125rem -2.25rem 0 0 hsl(308.57, 100%, 75%);
    }
    100% {
      opacity: 0;
    }
  }

  &:hover {
    filter: ${(props) => (props.$liked ? "none" : "grayscale(0.5)")};
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
  isMyComment = false,
  onDelete,
  onUpdate,
  onReport,
}: CommentFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeClick) {
      onLikeClick();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  const handleSaveEdit = async () => {
    if (onUpdate && editedContent.trim()) {
      try {
        await onUpdate(editedContent.trim());
        setIsEditing(false);
      } catch (error) {
        console.error("댓글 수정 실패:", error);
        // 에러 시 수정 모드 유지
      }
    }
  };

  return (
    <CommentContainer
      style={{
        backgroundColor: isMyComment ? "#fafafa" : "transparent",
        borderRadius: isMyComment ? "8px" : "0",
      }}
    >
      <PostHeader
        variant="comment"
        userName={userName}
        userId={userId}
        avatarSrc={avatarSrc}
        avatarAlt={avatarAlt}
        postId={commentId}
        dateTime={dateTime}
        dateText={dateText}
        isMyComment={isMyComment}
        onEdit={handleEditClick}
        onDelete={onDelete}
        onReport={onReport}
      />

      {isEditing ? (
        <EditArea>
          <EditTextarea
            value={editedContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEditedContent(e.target.value)
            }
            autoFocus
          />
          <EditButtons>
            <EditButton onClick={handleCancelEdit}>취소</EditButton>
            <EditButton $primary onClick={handleSaveEdit}>
              저장
            </EditButton>
          </EditButtons>
        </EditArea>
      ) : (
        <CommentContent>{content}</CommentContent>
      )}
      {/* 댓글 좋아요 기능 -추후 구현하려면 하기? */}
      {onLikeClick && (
        <CommentFooter>
          <LikeButton
            $liked={isLiked}
            onClick={handleLikeClick}
            aria-label="댓글 좋아요"
          >
            <HeartLabel $liked={isLiked}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </HeartLabel>
            <span style={{ position: "relative", top: "-1px" }}>{likeCount}</span>
          </LikeButton>
        </CommentFooter>
      )}
    </CommentContainer>
  );
}

export default CommentField;
