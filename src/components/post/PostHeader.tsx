import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PostHeader as StyledPostHeader,
  UserInfo,
  UserAvatar,
  UserDetails,
  UserName,
  UserId,
} from "./PostHeader.styled";
import MoreMenu from "../common/modal/MoreMenu";
import { formatPostDate } from "../../utils/formatter/dateFormatter";
import { deletePost, EditPost } from "../../services/postService";

// API 연동 준비 (추후 사용)
// import { Author } from "../../types/post";

interface PostHeaderProps {
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;

  postId: string;
  variant?: "post" | "comment";
  dateTime?: string;
  dateText?: string;
  onDelete?: () => void;

  // API 연동 준비 (추후 사용)
  // author: Author;
}

function PostHeader({
  userName,
  userId,
  avatarSrc,
  avatarAlt,
  postId,
  variant = "post",
  dateTime,
  onDelete,
}: PostHeaderProps) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(avatarSrc);

  const handleImageError = () => {
    setImgSrc("/img/fish-logo-GB.png");
  };

  // 게시글 액션 핸들러들
  const handleEditPost = () => {
    console.log("게시글 수정:", postId);
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
      <UserInfo>
        <UserAvatar
          src={imgSrc || "/img/fish-logo-GB.png"}
          alt={avatarAlt}
          onError={handleImageError}
          $variant={variant}
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
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      ) : (
        <MoreMenu
          type="post"
          size="sm"
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      )}

      {/* <MoreButton aria-label={variant === "comment" ? "댓글 더보기" : "게시글 더보기"} onClick={() => onMoreClick?.(postId)}>
         <img src="/img/icon-more-vertical.svg" alt="" />
       </MoreButton> */}

      {/* API 연동 준비 (추후 사용) */}
      {/* <UserInfo>
        <UserAvatar
          src={author.image || "/img/fish-logo-GB.png"}
          alt={`${author.username} 프로필 이미지`}
        />
        <UserDetails>
          <UserName>{author.username}</UserName>
          <UserId>@{author.accountname}</UserId>
        </UserDetails>
      </UserInfo>
      <MoreButton
        aria-label="게시글 더보기"
        onClick={handleMoreClick}
      >
        <img src="/img/icon-more-vertical.svg" alt="" />
      </MoreButton> */}
    </StyledPostHeader>
  );
}

export default PostHeader;
