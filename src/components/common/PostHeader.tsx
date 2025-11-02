import { useState } from "react";
import {
  PostHeader as StyledPostHeader,
  UserInfo,
  UserAvatar,
  UserDetails,
  UserName,
  UserId,
  MoreButton,
} from "./PostHeader.styled";

// API 연동 준비 (추후 사용)
// import { Author } from "../../types/post";

interface PostHeaderProps {
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  postId: string;
  onMoreClick?: (postId: string) => void;

  // API 연동 준비 (추후 사용)
  // author: Author;
}

function PostHeader({
  userName,
  userId,
  avatarSrc,
  avatarAlt,
  postId,
  onMoreClick,
}: PostHeaderProps) {
  const [imgSrc, setImgSrc] = useState(avatarSrc);

  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(postId);
    }
  };

  const handleImageError = () => {
    setImgSrc("/img/fish-logo-GB.png");
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
      <MoreButton aria-label="게시글 더보기" onClick={handleMoreClick}>
        <img src="/img/icon-more-vertical.svg" alt="" />
      </MoreButton>

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
