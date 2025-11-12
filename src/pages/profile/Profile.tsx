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
import { dummyPosts, type Post } from "../../data/dummyPosts";
import { getToken } from "../../utils/tokenManager";
import { useAuth } from "../../contexts/AuthContext";

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
  const { currentUser, isLoading: isAuthLoading } = useAuth();

  // URL 파라미터에서 userId 가져오기 (동적 라우팅 대비)
  const { accountname: paramAccountname } = useParams<{
    accountname?: string;
  }>();

  // 현재 로그인한 사용자의 accountname
  const currentUserAccountname = currentUser?.accountname || "";

  // URL 파라미터가 있으면 해당 유저, 없으면 내 프로필
  const targetAccountname = paramAccountname || currentUserAccountname;

  // 내 프로필인지 다른 사람 프로필인지 구분
  const isMyProfile = targetAccountname === currentUserAccountname;

  // 프로필 데이터 상태 관리
  // const [profileData, setProfileData] = useState<UserProfile>({
  //   _id: "my_user_id", // 임시: 내 프로필로 표시되도록 currentUserId와 동일하게 설정
  //   username: "물고기마켓",
  //   accountname: "@fishmarket",
  //   image: "/img/fish_profile.svg",
  //   intro: "안녕하세요! 물고기마켓입니다.",
  //   followerCount: 128,
  //   followingCount: 52,
  //   isFollowing: false,
  // });

  // 프로필 데이터 상태 관리
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 게시글 피드 데이터 상태 관리
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  // 포스트 상태 관리 (리스트 / 갤러리)
  const [postState, setPostState] = useState<"list" | "gallery">("list");

  // 팔로우 처리 중 상태 (중복 클릭 방지)
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  //  ✅ 프로필 데이터 가져오기
  const fetchProfileData = async (
    accountname?: string
  ): Promise<UserProfile | null> => {
    try {
      const token = getToken(); // 토큰 가져오기
      let url = "https://dev.wenivops.co.kr/services/mandarin/user/myinfo";
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      if (accountname && accountname !== currentUserAccountname) {
        url = `https://dev.wenivops.co.kr/services/mandarin/profile/${accountname}`;
        headers["Content-type"] = "application/json";
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) throw new Error("프로필을 불러올 수 없습니다");

      const data = await response.json();

      // 다른 유저 프로필은 data.profile로 반환됨
      // 내 프로필은 data.user
      return accountname && accountname !== currentUserAccountname
        ? data.profile
        : data.user;
    } catch (error) {
      console.error("프로필 데이터 가져오기 실패:", error);
      return null;
    }
  };

  // ✅ 사용자 게시글 피드 가져오기
  const fetchUserPosts = async (
    accountname: string
  ): Promise<Post[] | null> => {
    try {
      const token = getToken();
      const limit = 1000;

      const response = await fetch(
        `https://dev.wenivops.co.kr/services/mandarin/post/${accountname}/userpost?limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("내 게시글 데이터 가져오기 실패");
      const data = await response.json();
      console.log("게시글 응답 전체:", data);
      console.log(`${accountname}의 게시글 목록:`, data.post);

      return Array.isArray(data.post) ? data.post : [];
    } catch (error) {
      console.error("게시글 데이터 가져오기 실패:", error);
      return null;
    }
  };

  // API: 팔로우/언팔로우 처리 (낙관적 업데이트)
  //  API 연동 시 주석 해제된 부분 활성화

  const handleFollowToggle = async (): Promise<void> => {
    if (isFollowLoading || !profileData) return;

    const previousData = profileData;
    const newFollowState = !profileData.isfollow;

    // 낙관적 업데이트
    setProfileData((prev) =>
      prev
        ? {
            ...prev,
            isfollow: newFollowState,
            followerCount: Math.max(
              0,
              newFollowState ? prev.followerCount + 1 : prev.followerCount - 1
            ),
          }
        : null
    );

    setIsFollowLoading(true);
    try {
      // API 연동 시 주석 해제
      // const response = await fetch(`/api/users/${profileData.accountname}/follow`, {
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
    if (!profileData) return;
    navigate(
      `/profile/${encodeURIComponent(profileData.accountname)}/followers`
    );
  };

  // 팔로잉 목록 클릭 핸들러
  const handleFollowingClick = (): void => {
    if (!profileData) return;
    navigate(
      `/profile/${encodeURIComponent(profileData.accountname)}/following`
    );
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

  // 게시글 좋아요 토글 핸들러 (낙관적 업데이트)
  //  API 연동 시 주석 해제된 부분 활성화

  const handleLikeToggle = async (postId: string): Promise<void> => {
    const prevPosts = userPosts;

    // 낙관적 업데이트
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

    try {
      // API 연동 시 주석 해제
      // const response = await fetch(`/api/posts/${postId}/like`, {
      //   method: "POST",
      // });
      // if (!response.ok) throw new Error("좋아요 처리 실패");
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      setUserPosts(prevPosts);
    }
  };

  //  프로필 공유 버튼 클릭 핸들러
  // Web Share API 또는 클립보드 복사 기능 구현

  // const handleShareClick = async (): Promise<void> => {
  //   const profileUrl = `${window.location.origin}/profile/${profileData.accountname}`;
  //   try {
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: `${profileData.username}의 프로필`,
  //         text: profileData.intro,
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

    const loadProfileAndPosts = async (): Promise<void> => {
      // AuthContext 로딩이 완료될 때까지 대기
      if (isAuthLoading) return;

      // 로그인하지 않은 경우
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        let profileToLoad;

        // 내 프로필인 경우 currentUser 사용
        if (isMyProfile) {
          console.log("👤 내 프로필 데이터 설정");
          profileToLoad = {
            _id: currentUser._id,
            username: currentUser.username,
            accountname: currentUser.accountname,
            email: currentUser.email,
            image: currentUser.image,
            intro: currentUser.intro,
            followerCount: currentUser.followerCount,
            followingCount: currentUser.followingCount,
            isfollow: false, // 내 프로필은 팔로우 상태 없음
          };
        } else {
          console.log("👥 다른 사용자 프로필 로드");
          const fetchedProfile = await fetchProfileData(targetAccountname);
          if (!fetchedProfile) {
            throw new Error("프로필을 불러올 수 없습니다");
          }
          profileToLoad = fetchedProfile;
        }

        setProfileData(profileToLoad);

        // 게시글 로드 (공통)
        console.log("📝 게시글 로드 시작");
        const posts = await fetchUserPosts(profileToLoad.accountname);
        if (posts) {
          setUserPosts(posts);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileAndPosts();

    // 임시: API 연동 전까지 더미 데이터 사용
    // setUserPosts(dummyPosts);
    // setIsLoading(false);
  }, [
    targetAccountname,
    currentUserAccountname,
    currentUser,
    isAuthLoading,
    isMyProfile,
    setHeaderConfig,
    navigate,
  ]);

  // AuthContext 로딩 중일 때
  if (isAuthLoading) {
    return (
      <ProfileSection>
        <LoadingText>인증 확인 중...</LoadingText>
      </ProfileSection>
    );
  }

  // 로딩 중일 때
  if (isLoading || !profileData) {
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
                src={profileData.image}
                alt={`${profileData.username}의 프로필 이미지`}
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
            <UserName>{profileData.username}</UserName>
            <UserId>{profileData.accountname}</UserId>
          </UserInfoBox>
        </ProfileContainer>

        {/* 사용자 소개 */}
        <UserDescription>{profileData.intro}</UserDescription>

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
                text={profileData.isfollow ? "팔로잉" : "팔로우"}
                height="medium"
                variant={profileData.isfollow ? "secondary" : "primary"}
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
      <SellingProducts isLastSection={userPosts.length === 0} />

      {/* 게시글이 있을 때만 포스트 상태바와 피드 섹션 표시 */}
      {!isLoading && userPosts.length > 0 && (
        <>
          <PostStateBar postState={postState} setPostState={setPostState} />

          {/* 피드 섹션 - 모든 프로필에서 표시 */}
          <MyFeedSection>
            {postState === "list" ? (
              <PostListContainer>
                {userPosts.map((post) => (
                  <PostCard
                    key={post.postId}
                    postId={post.postId}
                    userName={profileData.username}
                    userId={profileData.accountname}
                    avatarSrc={profileData.image}
                    avatarAlt={`${profileData.username}의 프로필 이미지`}
                    content={post.content}
                    imageSrc={post.imageSrc}
                    imageAlt={post.imageAlt}
                    dateTime={post.dateTime}
                    dateText={post.dateText}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    isLiked={post.isLiked}
                    onLikeClick={() => handleLikeToggle(post.postId)}
                    onCommentClick={() => navigate(`/post/${post.postId}`)}
                  />
                ))}
              </PostListContainer>
            ) : (
              <PostGallery
                posts={userPosts}
                onPostClick={(postId) => {
                  navigate(`/post/${postId}`);
                }}
              />
            )}
          </MyFeedSection>
        </>
      )}

      {/* 게시글이 없을 때 빈 상태 메시지 표시 */}
      {!isLoading && userPosts.length === 0 && (
        <MyFeedSection>
          <EmptyPostMessage>게시글이 없습니다.</EmptyPostMessage>
        </MyFeedSection>
      )}
    </>
  );
}

export default Profile;
