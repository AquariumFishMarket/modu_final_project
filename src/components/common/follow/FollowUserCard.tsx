import React from "react";
import {
  UserCard as UserCardContainer,
  UserProfileLink,
  UserInfoWrapper,
  UserTextInfo,
  UserImageWrapper,
  UserImage,
  UserName,
  UserIntro,
} from "./FollowUserCard.styled";
import DefaultButton from "../buttons/Button";

interface FollowUserCardProps {
  userName: string;
  userId: string;
  userImage: string;
  userIntro: string; // 소개글
  isFollowing: boolean; // 팔로우 상태
  onFollowToggle?: (targetUserId: string) => void; // 팔로우 토글 콜백
}

function FollowUserCard({
  userName,
  userId,
  userImage,
  userIntro,
  isFollowing,
  onFollowToggle,
}: FollowUserCardProps) {
  const handleFollowClick = () => {
    // userId를 콜백에 전달
    onFollowToggle?.(userId);
  };

  return (
    <UserCardContainer>
      {/* 프로필 링크 영역 */}
      <UserProfileLink to={`/profile/${encodeURIComponent(userId)}`}>
        <UserInfoWrapper>
          {/* 프로필 이미지 */}
          <UserImageWrapper>
            <UserImage
              src={userImage || "/img/fish_profile.png"}
              onError={(e) => {
                e.currentTarget.src = "/img/fish_profile.png";
              }}
              alt={`${userName}의 프로필 이미지`}
            />
          </UserImageWrapper>

          {/* 이름 + 소개글 */}
          <UserTextInfo>
            <UserName>{userName}</UserName>
            <UserIntro>{userIntro || "소개글이 없습니다."}</UserIntro>
          </UserTextInfo>
        </UserInfoWrapper>
      </UserProfileLink>

      {/* 팔로우 버튼 */}
      <DefaultButton
        text={isFollowing ? "언팔로우" : "팔로우"}
        variant={isFollowing ? "secondary" : "primary"}
        width={90}
        onClick={handleFollowClick}
      />
    </UserCardContainer>
  );
}

export default React.memo(FollowUserCard);
