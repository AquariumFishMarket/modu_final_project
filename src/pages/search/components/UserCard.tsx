import { useState } from "react";
import {
  UserCard as UserCardContainer,
  UserProfileLink,
  UserInfoWrapper,
  UserTextInfo,
  UserImageWrapper,
  UserImage,
  UserName,
  UserId,
} from "./UserCard.styled";
import DefaultButton from "../../../components/common/buttons/Button";

interface UserCardProps {
  userName: string;
  userId: string;
  userImage: string;
  searchKeyword?: string; // 검색어 하이라이팅용
  isFollowing?: boolean; // 팔로우 상태
  onFollowToggle?: () => void; // 팔로우 토글 콜백
}

//  텍스트에서 검색어를 찾아 하이라이팅하는 함수
//  정규식 기반으로 모든 매칭을 하이라이트

function highlightText(text: string, keyword?: string): React.ReactNode {
  if (!keyword || !keyword.trim()) {
    return text;
  }

  // 정규식 특수문자 이스케이프
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 대소문자 구분 없이 모든 매칭 찾기
  const regex = new RegExp(`(${escapedKeyword})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={index} style={{ color: "var(--main-color, #00A0B3)" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

function UserCard({
  userName,
  userId,
  userImage,
  searchKeyword,
  isFollowing: initialIsFollowing = false,
  onFollowToggle,
}: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const handleFollowClick = async () => {
    // 낙관적 업데이트 - 이전 상태 저장
    const previousFollowState = isFollowing;
    setIsFollowing(!previousFollowState);
// 귀신이다 귀신이야!!!!!!
    // 콜백 실행
    if (onFollowToggle) {
      onFollowToggle();
    }

    // API 연동 시 주석 해제
    // try {
    //   if (previousFollowState) {
    //     await unfollowUser(userId);
    //   } else {
    //     await followUser(userId);
    //   }
    // } catch (error) {
    //   console.error('팔로우 처리 실패:', error);
    //   // 실패 시 이전 상태로 복원
    //   setIsFollowing(previousFollowState);
    // }
  };

  return (
    <UserCardContainer>
      {/* 프로필 링크 영역 (이미지 + 텍스트만) */}
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

          {/* 이름 + ID */}
          <UserTextInfo>
            <UserName>{highlightText(userName ?? "", searchKeyword)}</UserName>
            <UserId>@ {highlightText(userId ?? "", searchKeyword)}</UserId>
          </UserTextInfo>
        </UserInfoWrapper>
      </UserProfileLink>

      {/* 팔로우 버튼 (Link 밖에 배치) */}
      <DefaultButton
        text={isFollowing ? "언팔로우" : "팔로우"}
        variant={isFollowing ? "secondary" : "primary"}
        width={90}
        onClick={handleFollowClick}
      />
    </UserCardContainer>
  );
}

export default UserCard;
