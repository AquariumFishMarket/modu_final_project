import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProfileSection,
  ProfileContainer,
  ProfileTopSection,
  FollowStatBox,
  FollowText,
  FollowerValue,
  FollowingValue,
  ProfileImageBox,
  ProfileImage,
  UserInfoBox,
  UserName,
  UserId,
  UserDescription,
  ActionButtonsContainer,
  IconButton,
  LoadingText,
} from "./Profile.styled";
import DefaultButton from "../Button";
import SellingProducts from "./SellingProducts";
import type { UserProfile } from "../../../types/user";

function Profile() {
  const navigate = useNavigate();

  // 프로필 데이터 상태 관리
  const [profileData, setProfileData] = useState<UserProfile>({
    id: "",
    userName: "사용자 이름",
    userId: "@userid",
    profileImage: "/img/fish_profile.png",
    description: "사용자 소개가 여기에 표시됩니다.",
    followerCount: 0,
    followingCount: 0,
    isFollowing: false,
  });

  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 실제 로그인한 사용자 ID (추후 Auth Context나 Redux에서 가져올 예정)
  // const currentUserId = ""; // 임시로 빈 문자열

  // 내 프로필인지 여부 확인 (임시로 false로 설정하여 다른 사람 프로필 테스트)
  const isMyProfile = true; // 원래: profileData.id !== "" && profileData.id === currentUserId;

  // API: 프로필 데이터 가져오기
  // API 분리 예정 - 렌더링마다 함수 재생성 방지를 위해 주석처리
  // const fetchProfileData = async (
  //   accountname: string
  // ): Promise<UserProfile | null> => {
  //   try {
  //     // accountname 빈 값 검증 추가
  //     // if (!accountname || accountname.trim() === "") {
  //     //   throw new Error("유효하지 않은 사용자 ID입니다");
  //     // }
  //
  //     // 실제 API 엔드포인트로 교체
  //     // const response = await fetch(`/api/profile/${accountname}`);
  //     // if (!response.ok) throw new Error('프로필을 불러올 수 없습니다');
  //     // const data = await response.json();
  //     // return data;

  //     // 임시 데이터 (실제 API 연결 시 삭제)
  //     return {
  //       id: "user123",
  //       userName: "물고기마켓",
  //       userId: "@fishmarket",
  //       profileImage: "/img/fish_profile.png",
  //       description: "물고기를 사랑하는 사람들의 커뮤니티",
  //       followerCount: 1234,
  //       followingCount: 567,
  //       isFollowing: false,
  //     };
  //   } catch (error) {
  //     console.error("프로필 데이터 가져오기 실패:", error);
  //     return null;
  //   }
  // };

  // 팔로우 처리 중 상태 (중복 클릭 방지)
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // API: 팔로우/언팔로우 처리 (낙관적 업데이트)
  const handleFollowToggle = async (): Promise<void> => {
    // 중복 클릭 방지
    if (isFollowLoading) return;

    // 1. 현재 상태 스냅샷 저장 (롤백용)
    const previousData = profileData;

    // 2. 낙관적 업데이트
    const newFollowState = !profileData.isFollowing;
    setProfileData((prev) => ({
      ...prev,
      isFollowing: newFollowState,
      // 팔로워 수 음수 방지
      followerCount: newFollowState
        ? prev.followerCount + 1
        : Math.max(0, prev.followerCount - 1),
    }));

    // 3. API 호출
    setIsFollowLoading(true);
    try {
      // 실제 API 엔드포인트로 교체
      // const response = await fetch(`/api/users/${profileData.id}/follow`, {
      //   method: newFollowState ? 'POST' : 'DELETE',
      // });
      // if (!response.ok) throw new Error('팔로우 처리 실패');

      console.log(
        newFollowState ? "팔로우 처리" : "언팔로우 처리",
        profileData.id
      );
    } catch (error) {
      console.error("팔로우 처리 실패:", error);
      // 4. 실패 시 정확한 원래 상태로 복원
      setProfileData(previousData);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // 채팅 버튼 클릭 핸들러
  const handleChatClick = (): void => {
    // 채팅 페이지로 이동
    console.log("채팅 시작:", profileData.id);
  };

  // 팔로워 목록 클릭 핸들러
  const handleFollowerClick = (): void => {
    navigate(`/profile/${encodeURIComponent(profileData.userId)}/followers`);
  };

  // 팔로잉 목록 클릭 핸들러
  const handleFollowingClick = (): void => {
    navigate(`/profile/${encodeURIComponent(profileData.userId)}/following`);
  };

  // 이미지 로드 에러 핸들러
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ): void => {
    e.currentTarget.src = "/img/fish_profile.png";
  };

  // 프로필 공유 버튼 클릭 핸들러
  // 공유 기능 구현 예정 - 공유 방식 고민(텍스트만 복사할지 아니면 Web Share API사용할지)
  // const handleShareClick = async (): Promise<void> => {
  //   const profileUrl = `${window.location.origin}/profile/${profileData.userId}`;

  //   try {
  //     // Web Share API 지원 여부 확인
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: `${profileData.userName}의 프로필`,
  //         text: profileData.description,
  //         url: profileUrl,
  //       });
  //       console.log("프로필 공유 성공");
  //     } else {
  //       // Web Share API 미지원 시 클립보드에 복사
  //       await navigator.clipboard.writeText(profileUrl);
  //       alert("📎 프로필 링크가 복사되었습니다!");
  //     }
  //   } catch (error) {
  //     console.error("프로필 공유 실패:", error);
  //   }
  // };

  // 컴포넌트 마운트 시 프로필 데이터 로드
  useEffect(() => {
    // API 분리 후 실제 데이터 로드 로직 구현
    // const loadProfile = async (): Promise<void> => {
    //   setIsLoading(true);
    //   try {
    //     // 실제 사용자 ID로 교체
    //     const data = await fetchProfileData("currentUserId");
    //     if (data) {
    //       setProfileData(data);
    //     }
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // loadProfile();

    // 임시: 로딩 상태 해제
    setIsLoading(false);
  }, []);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <ProfileSection>
        <LoadingText>로딩 중...</LoadingText>
      </ProfileSection>
    );
  }

  return (
    <>
      <ProfileSection>
        <h2 className="sr-only">프로필</h2>
        <ProfileContainer>
          {/* 상단: 팔로워 - 이미지 - 팔로잉 */}
          <ProfileTopSection>
            {/* 팔로워 수 */}
            <FollowStatBox onClick={handleFollowerClick}>
              <FollowerValue>{profileData.followerCount}</FollowerValue>
              <FollowText>followers</FollowText>
            </FollowStatBox>

            {/* 프로필 이미지 */}
            <ProfileImageBox>
              <ProfileImage
                src={profileData.profileImage}
                alt={`${profileData.userName}의 프로필 이미지`}
                onError={handleImageError}
              />
            </ProfileImageBox>

            {/* 팔로잉 수 */}
            <FollowStatBox onClick={handleFollowingClick}>
              <FollowingValue>{profileData.followingCount}</FollowingValue>
              <FollowText>following</FollowText>
            </FollowStatBox>
          </ProfileTopSection>

          {/* 유저 정보 (이름 + 아이디) */}
          <UserInfoBox>
            <UserName>{profileData.userName}</UserName>
            <UserId>{profileData.userId}</UserId>
          </UserInfoBox>
        </ProfileContainer>

        {/* 사용자 소개 */}
        <UserDescription>{profileData.description}</UserDescription>

        {/* 액션 버튼들 */}
        <ActionButtonsContainer>
          {isMyProfile ? (
            <>
              {/* 내 프로필일 때: 프로필 수정 + 상품 등록 버튼 표시 */}
              <DefaultButton
                text="프로필 수정"
                variant="secondary"
                width={120}
                onClick={() => navigate("/profile/edit")}
              />
              <DefaultButton
                text="상품 등록"
                variant="secondary"
                width={120}
                onClick={() => navigate("/product/add")}
              />
            </>
          ) : (
            <>
              {/* 다른 사람 프로필일 때: 채팅 + 팔로우 + 공유 버튼 표시 */}
              {/* 채팅 버튼 */}
              <IconButton
                $iconUrl="/img/message-circle.svg"
                onClick={handleChatClick}
                aria-label="채팅하기"
              />

              {/* 팔로우/언팔로우 버튼 */}
              <DefaultButton
                text={profileData.isFollowing ? "언팔로우" : "팔로우"}
                variant={profileData.isFollowing ? "secondary" : "primary"}
                width={120}
                onClick={handleFollowToggle}
              />

              {/* 공유 버튼 - 공유 기능 구현 예정 */}
              <IconButton
                $iconUrl="/img/icon-share.svg"
                onClick={() => console.log("공유 기능 구현 예정")}
                aria-label="프로필 공유하기"
              />
            </>
          )}
        </ActionButtonsContainer>
      </ProfileSection>

      {/* 판매중인상품 영역 */}
      <SellingProducts />

      {/* 피드 헤더 추가 */}

      {/* 피드 게시물 추가 */}
    </>
  );
}

export default Profile;
