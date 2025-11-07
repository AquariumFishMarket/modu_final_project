import PostHeader from "../PostHeader";
import { CommentContainer, CommentContent } from "./CommentField.styled";

interface CommentFieldProps {
  commentId: string;
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  content: string;
  dateTime: string;
  dateText: string;
}

function CommentField({
  commentId,
  userName,
  userId,
  avatarSrc,
  avatarAlt,
  content,
  dateTime,
  dateText,
}: CommentFieldProps) {
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
    </CommentContainer>
  );
}

export default CommentField;
