import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PostHeader as StyledPostHeader,
  UserInfo,
  UserDetails,
  UserName,
  UserId,
} from "./PostHeader.styled";
import MoreMenu from "../common/modal/MoreMenu";
import { formatPostDate } from "../../utils/formatter/dateFormatter";
import { deletePost, EditPost } from "../../services/postService";
import UserAvatarBox from "./UserAvatar";

interface PostHeaderProps {
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;

  postId: string;
  variant?: "post" | "comment";
  dateTime?: string;
  dateText?: string;
  authorAccountname: string;
  isMyComment?: boolean;
  isMyPost?: boolean;
  onEdit?: () => void; // 댓글 수정 핸들러
  onDelete?: () => void; // 댓글 삭제 핸들러
  onReport?: () => void; // 댓글/게시글 신고 핸들러
}

function PostHeader({
  userName,
  userId,
  avatarSrc,
  avatarAlt,
  postId,
  variant = "post",
  dateTime,
  authorAccountname,
  isMyComment,
  isMyPost,
  onEdit,
  onDelete,
  onReport,
}: PostHeaderProps) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(avatarSrc);

  const handleImageError = () => {
    setImgSrc("/img/fish-logo-GB.png");
  };

  // 게시글 액션 핸들러들
  const handleEditPost = () => {
    navigate(`/post/${postId}/edit`);
  };

  const handleDeletePost = async () => {
    try {
      const result = await deletePost(postId);
      if (result) {
        console.log("삭제 성공");
        window.location.reload(); // 새로고침
      }
    } catch (error) {
      console.error("삭제 실패", error);
    }
  };

  return (
    <StyledPostHeader>
      <h2 className="sr-only">
        {variant === "comment" ? "댓글 작성자 정보" : "게시자 정보"}
      </h2>
      <UserInfo
        onClick={() => navigate(`/profile/${encodeURIComponent(userId)}`)}
        style={{ cursor: "pointer" }}
      >
        <UserAvatarBox
          src={imgSrc}
          alt={avatarAlt}
          onError={handleImageError}
          variant={variant}
        />
        {variant === "comment" ? (
          <>
            <UserName>{userName}</UserName>
            {dateTime && (
              <time
                dateTime={dateTime}
                style={{
                  fontSize: "1rem",
                  color: "var(--color-gray-dark)",
                  marginLeft: "0.6rem",
                }}
              >
                {formatPostDate(dateTime)}
              </time>
            )}
          </>
        ) : (
          <UserDetails>
            <UserName>{userName}</UserName>
            <UserId>{userId}</UserId>
          </UserDetails>
        )}
      </UserInfo>

      {variant === "comment" ? (
        <MoreMenu
          type="comment"
          size="md"
          authorAccountname={authorAccountname}
          isMyComment={isMyComment}
          onEdit={onEdit}
          onDelete={onDelete}
          onReport={onReport}
        />
      ) : (
        <MoreMenu
          type="post"
          size="sm"
          authorAccountname={authorAccountname}
          isMyPost={isMyPost}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onReport={onReport}
        />
      )}
    </StyledPostHeader>
  );
}

export default PostHeader;
