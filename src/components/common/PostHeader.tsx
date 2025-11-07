import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PostHeader as StyledPostHeader,
  UserInfo,
  UserAvatar,
  UserDetails,
  UserName,
  UserId,
  // MoreButton,
} from "./PostHeader.styled";
import MoreMenu from "./MoreMenu";

// API 연동 준비 (추후 사용)
// import { Author } from "../../types/post";

interface PostHeaderProps {
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  postId?: string;
  onEditPost?: () => void;
  onDeletePost?: () => void;

  // API 연동 준비 (추후 사용)
  // author: Author;
}

function PostHeader({
  userName,
  userId,
  avatarSrc,
  avatarAlt,
  postId,
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

  const handleDeletePost = () => {
    console.log("게시글 삭제:", postId);
  };

  return (
    <StyledPostHeader>
      <h2 className="sr-only">게시자 정보</h2>
      <UserInfo>
        <UserAvatar
          src={imgSrc || "/img/fish-logo-GB.png"}
          alt={avatarAlt}
          onError={handleImageError}
        />
        <UserDetails>
          <UserName>{userName}</UserName>
          <UserId>{userId}</UserId>
        </UserDetails>
      </UserInfo>

      <MoreMenu
        type="post"
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />

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
