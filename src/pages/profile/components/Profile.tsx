import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHeader } from "../../../contexts/HeaderContext";
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
  // EmptyPostMessage,
} from "./Profile.styled";

import DefaultButton from "../../../components/common/buttons/Button";
import SellingProducts from "./SellingProducts";
import type { UserProfile } from "../../../types/user";
import PostCard from "../../../components/post/postCard/PostCard";
import PostStateBar from "../../../components/post/PostStateBar";
import PostGallery from "./PostGallery";
import { Post } from "../../../types/post";
import { useAuth } from "../../../contexts/AuthContext";
import {
  fetchProfile,
  fetchUserPosts,
  toggleProfileFollow,
} from "../../../services/profileService";
import MoreMenu from "../../../components/common/modal/MoreMenu";

const BASE_URL = `https://dev.wenivops.co.kr/services/mandarin`;

//  Profile 컴포넌트
//  - 내 프로필과 다른 유저의 프로필을 조건부 렌더링
//  - isMyProfile = targetAccountname === currentUserAccountname로 구분

function Profile() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const { currentUser, isLoading: isAuthLoading, logout } = useAuth();
  // URL 파라미터에서 계정ID 가져오기
  const { accountname: paramAccountname } = useParams<{
    accountname?: string;
  }>();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [postsList, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [postState, setPostState] = useState<"list" | "gallery">("list");
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const currentUserAccountname = currentUser?.accountname || "";
  const targetAccountname =
    paramAccountname && paramAccountname.trim() !== ""
      ? paramAccountname
      : currentUserAccountname;
  const isMyProfile = targetAccountname === currentUserAccountname;

  // 🔄 팔로우/언팔로우 처리 (낙관적 업데이트)
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
      await toggleProfileFollow(profileData.accountname, profileData.isfollow);
    } catch (error) {
      console.error("팔로우 처리 실패:", error);
      setProfileData(previousData);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // 채팅 버튼 클릭 핸들러 🗯️
  const handleChatClick = (): void => {
    // navigate(`/chat/${profileData.id}`);
  };

  // 팔로워 목록 클릭 핸들러
  const handleFollowerClick = (): void => {
    if (!profileData) return;
    navigate(`${BASE_URL}/profile/${profileData.accountname}/follower`);
  };

  // 팔로잉 목록 클릭 핸들러
  const handleFollowingClick = (): void => {
    if (!profileData) return;
    navigate(`${BASE_URL}/profile/${profileData.accountname}/following`);
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
    navigate("/product");
  };

  // ❤️ 좋아요 토글 핸들러 추가
  const handlePostLikeToggle = (postId: string): void => {
    // TODO: 좋아요 API 연동
    console.log("좋아요 토글:", postId);

    // 임시 낙관적 업데이트
    setUserPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              hearted: !post.hearted,
              likeCount: post.hearted
                ? post.heartCount - 1
                : post.heartCount + 1,
            }
          : post
      )
    );
  };

  useEffect(() => {
    // 헤더 설정
    setHeaderConfig({
      show: true,
      type: "profile",
      onBackClick: () => navigate(-1),
      rightElement: (
        <MoreMenu
          type="profile"
          onSettings={() => navigate("/settings")}
          onLogout={() => logout()}
        />
      ),
    });

    const loadProfileAndPosts = async (): Promise<void> => {
      if (isAuthLoading) return;

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        let profileToLoad;

        console.log("targetAccountname: ", targetAccountname);

        // 내 프로필인 경우 currentUser 사용
        if (isMyProfile) {
          console.log("👤 내 프로필 로드");
          profileToLoad = {
            _id: currentUser._id,
            username: currentUser.username,
            accountname: currentUser.accountname,
            image: currentUser.image,
            intro: currentUser.intro,
            followerCount: 0,
            followingCount: 0,
            follower: [],
            following: [],
            isfollow: false,
          };
        } else {
          console.log("👥 다른 사용자 프로필 로드");
          const fetchedProfile = await fetchProfile(
            targetAccountname,
            currentUserAccountname
          );
          if (!fetchedProfile) {
            throw new Error("프로필을 불러올 수 없습니다");
          }
          profileToLoad = fetchedProfile;
        }

        setProfileData(profileToLoad);

        // 게시글 로드 (공통)
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
  }, [
    targetAccountname,
    currentUserAccountname,
    currentUser,
    isAuthLoading,
    isMyProfile,
    setHeaderConfig,
    navigate,
  ]);

  if (isAuthLoading) {
    return (
      <ProfileSection>
        <LoadingText>인증 확인 중...</LoadingText>
      </ProfileSection>
    );
  }

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
                $iconUrl="/img/icon-message.svg"
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
                onClick={() => {}}
                aria-label="프로필 공유하기"
              />
            </>
          )}
        </ActionButtonsContainer>
      </ProfileSection>

      {/* 판매중인상품 영역 */}
      <SellingProducts isLastSection={postsList.length === 0} />

      {/* 게시글 로딩 중 */}
      {/* {isPostsInitialLoading && (
        <MyFeedSection>
          <LoadingText>게시글 불러오는 중...</LoadingText>
        </MyFeedSection>
      )} */}

      {/* 게시글이 있을 때만 포스트 상태바와 피드 섹션 표시 */}
      {/* {!isPostsInitialLoading && postsList.length > 0 && ( */}
      {postsList.length > 0 && (
        <>
          <PostStateBar postState={postState} setPostState={setPostState} />

          {/* 피드 섹션 - 모든 프로필에서 표시 */}
          <MyFeedSection>
            {postState === "list" ? (
              <PostListContainer>
                {postsList.map((post) => (
                  <PostCard
                    key={post.id}
                    postId={post.id}
                    userName={post.author.username}
                    userId={post.author.accountname}
                    avatarSrc={post.author.image}
                    avatarAlt={`${post.author.username}의 프로필 이미지`}
                    content={post.content}
                    imageSrc={post.image}
                    imageAlt="게시글 이미지"
                    dateTime={post.createdAt}
                    likeCount={post.heartCount}
                    commentCount={post.commentCount}
                    isLiked={post.hearted}
                    onLikeClick={() => handlePostLikeToggle(post.id)}
                    onCommentClick={() => navigate(`/post/${post.id}`)}
                  />
                ))}

                {/* IntersectionObserver 트리거 */}
                {/* <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />

                {isPostsLoading && <LoadingText>불러오는 중...</LoadingText>} */}
                {/* {!hasMore && postsList.length > 0 && (
                  <LoadingText>더 이상 게시글이 없습니다.</LoadingText>
                )} */}
              </PostListContainer>
            ) : (
              <PostGallery
                posts={postsList.map((post) => ({
                  postId: post.id,
                  userName: post.author.username,
                  userId: post.author.accountname,
                  avatarSrc: post.author.image,
                  avatarAlt: `${post.author.username}의 프로필 이미지`,
                  content: post.content,
                  imageSrc: post.image,
                  imageAlt: "게시글 이미지",
                  dateTime: post.createdAt,
                  dateText: post.createdAt,
                  likeCount: post.heartCount,
                  commentCount: post.commentCount,
                  isLiked: post.hearted,
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
      {/* {!isPostsInitialLoading && postsList.length === 0 && ( */}
      {/* <MyFeedSection>
        <EmptyPostMessage>게시글이 없습니다.</EmptyPostMessage>
      </MyFeedSection> */}
      {/* )} */}
    </>
  );
}

export default Profile;
