import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  MyFeedSection,
  MyFeedTitle,
  PostListContainer,
  EmptyPostMessage,
} from "./Profile.styled";
import DefaultButton from "../Button";

import SellingProducts from "./SellingProducts";
import type { UserProfile } from "../../../types/user";

// import SellingProducts from "./SellingProducts";
import PostCard from "../postCard/PostCard";

//  Profile 컴포넌트
//   - 내 프로필과 다른 유저의 프로필을 조건부 렌더링
//   - isMyProfile = (profileData.id === currentUserId)로 구분

//  테스트
//    1. 내 프로필 보기: profileData.id를 currentUserId와 동일하게 설정 (현재 user123)
//      - 프로필 수정, 상품 등록 버튼 + 나의 게시글 피드 표시

//    2. 다른 사람 프로필 보기: profileData.id를 다른 값으로 변경 (예: user456)
//      → 채팅, 팔로우/언팔로우, 공유 버튼 표시 + 피드 미표시

// 게시글 타입 정의 (임시)
interface Post {
  postId: string;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  dateTime: string;
  dateText: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

function Profile() {
  const navigate = useNavigate();

  // URL 파라미터에서 userId 가져오기 (동적 라우팅 대비)
  // 예: /profile/:userId 라우트에서 사용
  const { userId: paramUserId } = useParams<{ userId?: string }>();

  // 실제 로그인된 사용자 ID는 상태관리 따로 해서 (Context API 또는 Redux에서) 가져오기
  const [currentUserId] = useState<string>("user123"); // 임시 현재 사용자 ID

  // URL 파라미터가 있으면 해당 유저, 없으면 내 프로필
  // API 연동 시 fetchProfileData(targetUserId)로 사용 예정
  const targetUserId = paramUserId || currentUserId;

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

  // 게시글 피드 데이터 상태 관리
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  // 내 프로필인지 다른 사람 프로필인지 구분
  const isMyProfile = profileData.id && profileData.id === currentUserId;

  // API 분리 예정 - 프로필 데이터 가져오기

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

  //     const response = await fetch(`/api/users/${userId}/profile`);
  //     if (!response.ok) throw new Error('프로필 데이터 가져오기 실패');
  //     const data = await response.json();
  //     return data;

  //   } catch (error) {
  //     console.error("프로필 데이터 가져오기 실패:", error);
  //     return null;
  //   }
  // };

  // 팔로우 처리 중 상태 (중복 클릭 방지)
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // API 분리 예정 - 사용자 게시글 피드 가져오기
  // const fetchUserPosts = async (
  //   userId: string
  // ): Promise<DummyPost[] | null> => {
  //   try {
  //     const response = await fetch(`/api/users/${userId}/posts`);
  //     if (!response.ok) throw new Error('게시글 데이터 가져오기 실패');
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("게시글 데이터 가져오기 실패:", error);
  //     return null;
  //   }
  // };

  // API: 팔로우/언팔로우 처리 (낙관적 업데이트)
  const handleFollowToggle = async (): Promise<void> => {
    // 중복 클릭 방지
    if (isFollowLoading) return;

    // 1. 현재 상태 스냅샷 저장 (롤백용)
    const previousData = profileData;

    // 2. 낙관적 업데이트 (팔로워 수 음수 방지)
    const newFollowState = !profileData.isFollowing;
    setProfileData((prev) => ({
      ...prev,
      isFollowing: newFollowState,
      followerCount: Math.max(
        0,
        newFollowState ? prev.followerCount + 1 : prev.followerCount - 1
      ),
    }));

    // 3. API 호출
    setIsFollowLoading(true);
    try {
      // 실제 API 엔드포인트로 교체
      // const response = await fetch(`/api/users/${profileData.id}/follow`, {
      //   method: newFollowState ? 'POST' : 'DELETE',
      // });
      // if (!response.ok) throw new Error('팔로우 처리 실패');
    } catch (error) {
      console.error("팔로우 처리 실패:", error);
      // 실패 시 정확한 원래 상태로 복원
      setProfileData(previousData);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // 채팅 버튼 클릭 핸들러
  const handleChatClick = (): void => {
    // 채팅 페이지로 이동
    // TODO: 채팅 페이지 연동
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

  // 프로필 수정 버튼 클릭 핸들러
  const handleEditProfile = (): void => {
    navigate("/profile/edit");
  };

  // 상품 등록 버튼 클릭 핸들러
  const handleUploadProduct = (): void => {
    navigate("/product/upload");
  };

  // 게시글 좋아요 토글 핸들러 (낙관적 업데이트)
  const handleLikeToggle = async (postId: string): Promise<void> => {
    // 1. 현재 상태 스냅샷 저장 (롤백용)
    const prevPosts = userPosts;

    // 2. 낙관적 업데이트
    setUserPosts((prev) =>
      prev.map((p) =>
        p.postId === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      )
    );

    // 3. API 호출
    try {
      // 실제 API 엔드포인트로 교체
      // const response = await fetch(`/api/posts/${postId}/like`, {
      //   method: "POST",
      // });
      // if (!response.ok) throw new Error("좋아요 처리 실패");
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      // 실패 시 원래 상태로 복원
      setUserPosts(prevPosts);
    }
  };

  // 프로필 공유 버튼 클릭 핸들러
  // 공유 기능 구현 예정 - 공유 방식 고민(링크만 복사할지 아니면 Web Share API사용할지)
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

  // 컴포넌트 마운트 시 프로필 데이터 및 게시글 로드
  useEffect(() => {
    // API 연동 - 프로필 데이터 및 게시글 로드
    // const loadProfileAndPosts = async (): Promise<void> => {
    //   setIsLoading(true);
    //   try {
    //     // 1. 프로필 데이터 로드 (targetUserId 사용)
    //     const profileData = await fetchProfileData(targetUserId);
    //     if (profileData) {
    //       setProfileData(profileData);
    //
    //       // 2. 내 프로필일 경우에만 게시글 피드 로드
    //       if (profileData.id === currentUserId) {
    //         const posts = await fetchUserPosts(profileData.id);
    //         if (posts) {
    //           setUserPosts(posts);
    //         }
    //       }
    //     }
    //   } catch (error) {
    //     console.error("데이터 로드 실패:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    //
    // loadProfileAndPosts();

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

        {/* 액션 버튼들 - 내 프로필 vs 다른 사람 프로필에 따라 다르게 렌더링 */}
        <ActionButtonsContainer>
          {isMyProfile ? (
            <>
              {/* 내 프로필: 프로필 수정 + 상품 등록 버튼 */}
              <DefaultButton
                text="프로필 수정"
                variant="secondary"
                width={120}
                onClick={handleEditProfile}
              />
              <DefaultButton
                text="상품 등록"
                variant="secondary"
                width={120}
                onClick={handleUploadProduct}
              />
            </>
          ) : (
            <>
              {/* 다른 사람 프로필: 채팅 + 팔로우 + 공유 버튼 */}

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
                onClick={() => {
                  // TODO: 공유 기능 구현
                }}
                aria-label="프로필 공유하기"
              />
            </>
          )}
        </ActionButtonsContainer>
      </ProfileSection>

      {/* 판매중인상품 영역 */}
      {/* <SellingProducts /> */}

      {/* 피드 헤더 추가 */}

      {/* 피드 게시물 추가 */}

      {/* 피드 섹션 - 모든 프로필에서 표시 */}
      <MyFeedSection>
        <MyFeedTitle>
          {isMyProfile ? "나의 게시글" : `${profileData.userName}님의 게시글`}
        </MyFeedTitle>

        <PostListContainer>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard
                key={post.postId}
                postId={post.postId}
                userName={profileData.userName}
                userId={profileData.userId}
                avatarSrc={profileData.profileImage}
                avatarAlt={`${profileData.userName}의 프로필 이미지`}
                content={post.content}
                imageSrc={post.imageSrc}
                imageAlt={post.imageAlt}
                dateTime={post.dateTime}
                dateText={post.dateText}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                isLiked={post.isLiked}
                onLikeClick={() => handleLikeToggle(post.postId)}
                onCommentClick={() => {
                  // TODO: 댓글 페이지 연동
                }}
                onMoreClick={() => {
                  // TODO: 더보기 메뉴 구현
                }}
              />
            ))
          ) : (
            <EmptyPostMessage>
              {isMyProfile
                ? "아직 작성한 게시글이 없습니다."
                : `${profileData.userName}님이 작성한 게시글이 없습니다.`}
            </EmptyPostMessage>
          )}
        </PostListContainer>
      </MyFeedSection>
    </>
  );
}

export default Profile;
