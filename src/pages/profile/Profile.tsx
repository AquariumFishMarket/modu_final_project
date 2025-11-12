import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHeader } from "../../contexts/HeaderContext";
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
  PostListContainer,
  EmptyPostMessage,
} from "./Profile.styled";

import DefaultButton from "../../components/common/buttons/Button";
import SellingProducts from "./components/SellingProducts";
import type { UserProfile } from "../../types/user";
import PostCard from "../../components/post/postCard/PostCard";
import PostStateBar from "../../components/post/PostStateBar";
import PostGallery from "./components/PostGallery";
import { useUserPostsData } from "../../hooks/useUserPostsData";
import type { Feed } from "../../types/feed";

//  Profile 컴포넌트
//  - 내 프로필과 다른 유저의 프로필을 조건부 렌더링
//  - isMyProfile = (profileData.id === currentUserId)로 구분

//  API 연동 예정:
//  - fetchProfileData: 프로필 정보 가져오기
//  - fetchUserPosts: 사용자 게시글 목록 가져오기
//  - handleFollowToggle: 팔로우/언팔로우 처리
//  - handleLikeToggle: 게시글 좋아요 처리

function Profile() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();

  // URL 파라미터에서 userId 가져오기 (동적 라우팅 대비)
  const { userId: paramUserId } = useParams<{ userId?: string }>();

  // 실제 로그인된 사용자 ID는 Context API 또는 Redux에서 가져오기
  // 임시: 더미 사용자 ID 설정
  const [currentUserId] = useState<string>("my_user_id");

  // URL 파라미터가 있으면 해당 유저, 없으면 내 프로필
  const targetUserId = paramUserId || currentUserId;

  // 프로필 데이터 상태 관리
  const [profileData, setProfileData] = useState<UserProfile>({
    id: "my_user_id", // 임시: 내 프로필로 표시되도록 currentUserId와 동일하게 설정
    userName: "물고기마켓",
    userId: "@fishmarket",
    profileImage: "/img/fish_profile.svg",
    description: "안녕하세요! 물고기마켓입니다.",
    followerCount: 128,
    followingCount: 52,
    isFollowing: false,
  });

  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 포스트 상태 관리 (리스트 / 갤러리)
  const [postState, setPostState] = useState<"list" | "gallery">("list");

  // 무한 스크롤 훅 사용
  const {
    postsList,
    isLoading: isPostsLoading,
    isInitialLoading: isPostsInitialLoading,
    hasMore,
    scrollContainerRef,
    loadMoreTriggerRef,
    handleLikeToggle: handlePostLikeToggle,
  } = useUserPostsData(profileData.userId);

  // 내 프로필인지 다른 사람 프로필인지 구분
  const isMyProfile = profileData.id && profileData.id === currentUserId;

  // 팔로우 처리 중 상태 (중복 클릭 방지)
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  //  API: 프로필 데이터 가져오기
  //  API 연동 시 주석 해제

  // const fetchProfileData = async (
  //   accountname: string
  // ): Promise<UserProfile | null> => {
  //   try {
  //     if (!accountname || accountname.trim() === "") {
  //       throw new Error("유효하지 않은 사용자 ID입니다");
  //     }
  //
  //     const response = await fetch(`/api/profile/${accountname}`);
  //     if (!response.ok) throw new Error('프로필을 불러올 수 없습니다');
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("프로필 데이터 가져오기 실패:", error);
  //     return null;
  //   }
  // };

  //  API: 사용자 게시글 피드 가져오기
  //  API 연동 시 주석 해제

  // const fetchUserPosts = async (
  //   userId: string
  // ): Promise<Post[] | null> => {
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
  //  API 연동 시 주석 해제된 부분 활성화

  const handleFollowToggle = async (): Promise<void> => {
    if (isFollowLoading) return;

    const previousData = profileData;
    const newFollowState = !profileData.isFollowing;

    // 낙관적 업데이트
    setProfileData((prev) => ({
      ...prev,
      isFollowing: newFollowState,
      followerCount: Math.max(
        0,
        newFollowState ? prev.followerCount + 1 : prev.followerCount - 1
      ),
    }));

    setIsFollowLoading(true);
    try {
      // API 연동 시 주석 해제
      // const response = await fetch(`/api/users/${profileData.id}/follow`, {
      //   method: newFollowState ? 'POST' : 'DELETE',
      // });
      // if (!response.ok) throw new Error('팔로우 처리 실패');
    } catch (error) {
      console.error("팔로우 처리 실패:", error);
      setProfileData(previousData);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // 채팅 버튼 클릭 핸들러
  // 채팅 페이지 라우팅 구현

  const handleChatClick = (): void => {
    // navigate(`/chat/${profileData.id}`);
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
    const target = e.currentTarget;
    // 무한 onError 방지: 이미 대체 이미지로 변경된 경우 중단
    if (target.src.includes("/img/fish_profile.png")) return;
    target.src = "/img/fish_profile.png";
  };

  // 프로필 수정 버튼 클릭 핸들러
  const handleEditProfile = (): void => {
    navigate("/profile/edit");
  };

  // 상품 등록 버튼 클릭 핸들러
  const handleUploadProduct = (): void => {
    navigate("/product/upload");
  };


  //  프로필 공유 버튼 클릭 핸들러
  // Web Share API 또는 클립보드 복사 기능 구현

  // const handleShareClick = async (): Promise<void> => {
  //   const profileUrl = `${window.location.origin}/profile/${profileData.userId}`;
  //   try {
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: `${profileData.userName}의 프로필`,
  //         text: profileData.description,
  //         url: profileUrl,
  //       });
  //     } else {
  //       await navigator.clipboard.writeText(profileUrl);
  //       alert("프로필 링크가 복사되었습니다!");
  //     }
  //   } catch (error) {
  //     console.error("프로필 공유 실패:", error);
  //   }
  // };

  // 컴포넌트 마운트 시 프로필 데이터 및 게시글 로드
  //  API 연동 시 주석 해제

  useEffect(() => {
    // 헤더 설정
    setHeaderConfig({
      show: true,
      type: "profile",
      onBackClick: () => navigate(-1),
    });

    // const loadProfileAndPosts = async (): Promise<void> => {
    //   setIsLoading(true);
    //   try {
    //     // 1. 프로필 데이터 로드
    //     const profileData = await fetchProfileData(targetUserId);
    //     if (profileData) {
    //       setProfileData(profileData);
    //
    //       // 2. 게시글 피드 로드
    //       const posts = await fetchUserPosts(profileData.id);
    //       if (posts) {
    //         setUserPosts(posts);
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

    // 임시: API 연동 전까지 프로필만 로드
    setIsLoading(false);
  }, [targetUserId, setHeaderConfig, navigate]);

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
                variant="white"
                width={120}
                height="medium"
                onClick={handleEditProfile}
              />
              <DefaultButton
                text="상품 등록"
                variant="white"
                width={120}
                height="medium"
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

              {/* 팔로우/팔로잉 버튼 */}
              <DefaultButton
                text={profileData.isFollowing ? "팔로잉" : "팔로우"}
                height="medium"
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
      <SellingProducts isLastSection={postsList.length === 0} />

      {/* 게시글 로딩 중 */}
      {isPostsInitialLoading && (
        <MyFeedSection>
          <LoadingText>게시글 불러오는 중...</LoadingText>
        </MyFeedSection>
      )}

      {/* 게시글이 있을 때만 포스트 상태바와 피드 섹션 표시 */}
      {!isPostsInitialLoading && postsList.length > 0 && (
        <>
          <PostStateBar postState={postState} setPostState={setPostState} />

          {/* 피드 섹션 - 모든 프로필에서 표시 */}
          <MyFeedSection ref={scrollContainerRef}>
            {postState === "list" ? (
              <PostListContainer>
                {postsList.map((post) => (
                  <PostCard
                    key={post.id}
                    postId={post.id}
                    userName={post.userName}
                    userId={post.userId}
                    avatarSrc={post.profileImg}
                    avatarAlt={`${post.userName}의 프로필 이미지`}
                    content={post.content}
                    imageSrc={post.image}
                    imageAlt="게시글 이미지"
                    dateTime={post.createdAt}
                    dateText={post.createdAt}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    isLiked={post.isLiked}
                    onLikeClick={() => handlePostLikeToggle(post.id)}
                    onCommentClick={() => navigate(`/post/${post.id}`)}
                  />
                ))}

                {/* IntersectionObserver 트리거 */}
                <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />

                {isPostsLoading && <LoadingText>불러오는 중...</LoadingText>}
                {!hasMore && postsList.length > 0 && (
                  <LoadingText>더 이상 게시글이 없습니다.</LoadingText>
                )}
              </PostListContainer>
            ) : (
              <PostGallery
                posts={postsList.map((post) => ({
                  postId: post.id,
                  userName: post.userName,
                  userId: post.userId,
                  avatarSrc: post.profileImg,
                  avatarAlt: `${post.userName}의 프로필 이미지`,
                  content: post.content,
                  imageSrc: post.image,
                  imageAlt: "게시글 이미지",
                  dateTime: post.createdAt,
                  dateText: post.createdAt,
                  likeCount: post.likeCount,
                  commentCount: post.commentCount,
                  isLiked: post.isLiked,
                }))}
                onPostClick={(postId) => {
                  navigate(`/post/${postId}`);
                }}
              />
            )}
          </MyFeedSection>
        </>
      )}

      {/* 게시글이 없을 때 빈 상태 메시지 표시 */}
      {!isPostsInitialLoading && postsList.length === 0 && (
        <MyFeedSection>
          <EmptyPostMessage>게시글이 없습니다.</EmptyPostMessage>
        </MyFeedSection>
      )}
    </>
  );
}

export default Profile;
