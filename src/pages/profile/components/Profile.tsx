import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useHeader } from "../../../contexts/HeaderContext";
import { useAuthStore } from "../../../contexts/useAuthStore";

import {
  ProfileSection,
  ProfileContainer,
  ProfileTopSection,
  FollowStatBox,
  FollowText,
  FollowerValue,
  FollowingValue,
  UserInfoBox,
  UserName,
  UserId,
  UserDescription,
  ActionButtonsContainer,
  IconButton,
  LoadingText,
  MyFeedSection,
  PostListContainer,
} from "./Profile.styled";

import DefaultButton from "../../../components/common/buttons/Button";
import { useProfileData } from "../../../hooks/useProfileData";
import { useUserProducts } from "../../../hooks/useUserProducts";

import SellingProducts from "./SellingProducts";
import PostCard from "../../../components/post/postCard/PostCard";
import PostStateBar from "../../../components/post/PostStateBar";
import PostGallery from "./PostGallery";
import ProfileImageContainer from "./ProfileImageContainer";
import MoreMenu from "../../../components/common/modal/MoreMenu";
import { formatPostDate } from "../../../utils/formatter/dateFormatter";
import ProfileSkeleton from "./skeleton/ProfileSkeleton";

function Profile() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const logout = useAuthStore((s) => s.logout);
  const { accountname } = useParams();
  const {
    loading: profileLoading,
    profile,
    posts,
    isMyProfile,
    isFollowLoading,
    handleFollowToggle,
    handleProfileLike,
  } = useProfileData(accountname);
  const {
    products,
    loading: productLoading,
    error: productError,
  } = useUserProducts(profile?.accountname);
  const [postState, setPostState] = useState<"list" | "gallery">("list");

  // 전체 로딩 통합
  const loading = profileLoading || (profile && productLoading);

  // 로그아웃
  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  // 헤더
  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "profile",
      onBackClick: () => navigate(-1),
      rightElement: (
        <MoreMenu
          type="profile"
          onSettings={() => navigate("/404")}
          onLogout={handleLogout}
        />
      ),
    });
  }, [navigate, setHeaderConfig, handleLogout]);

  return (
    <>
    {(loading || !profile) ? (
      <ProfileSkeleton />
    ) : (
      <>
      {/* 프로필 상단 */}
      <ProfileSection>
        <ProfileContainer>
          <ProfileTopSection>
            <FollowStatBox
              onClick={() =>
                navigate(`/profile/${profile.accountname}/follower`)
              }
            >
              <FollowerValue>{profile.followerCount}</FollowerValue>
              <FollowText>followers</FollowText>
            </FollowStatBox>

            <ProfileImageContainer
              src={profile.image}
              alt={`${profile.username}의 프로필 이미지`}
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.src.includes("/img/fish_profile.png"))
                  t.src = "/img/fish_profile.png";
              }}
            />

            <FollowStatBox
              onClick={() =>
                navigate(`/profile/${profile.accountname}/following`)
              }
            >
              <FollowingValue>{profile.followingCount}</FollowingValue>
              <FollowText>following</FollowText>
            </FollowStatBox>
          </ProfileTopSection>

          <UserInfoBox>
            <UserName>{profile.username}</UserName>
            <UserId>@{profile.accountname}</UserId>
          </UserInfoBox>

          <UserDescription>{profile.intro}</UserDescription>

          {/* 액션 버튼 */}
          <ActionButtonsContainer>
            {isMyProfile ? (
              <>
                <DefaultButton
                  text="프로필 수정"
                  variant="white"
                  width={120}
                  height="medium"
                  onClick={() => navigate("/profile/edit")}
                />
                <DefaultButton
                  text="상품 등록"
                  variant="white"
                  width={120}
                  height="medium"
                  onClick={() => navigate("/product")}
                />
              </>
            ) : (
              <>
                <IconButton $iconUrl="/img/icon-message.svg" />
                <DefaultButton
                  text={profile.isfollow ? "팔로잉" : "팔로우"}
                  height="medium"
                  variant={profile.isfollow ? "secondary" : "primary"}
                  width={120}
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                />
                <IconButton $iconUrl="/img/icon-share.svg" />
              </>
            )}
          </ActionButtonsContainer>
        </ProfileContainer>
      </ProfileSection>

      {/* 상품 섹션 */}
      <SellingProducts products={products} isLastSection={posts.length === 0} />

      {/* 게시물 섹션 */}
      {posts.length > 0 && (
        <>
          <PostStateBar postState={postState} setPostState={setPostState} />

          <MyFeedSection>
            {postState === "list" ? (
              <PostListContainer>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    postId={post.id}
                    userName={post.author?.username || "알 수 없음"}
                    userId={post.author?.accountname || ""}
                    avatarSrc={post.author?.image || "/img/empty-profile.png"}
                    avatarAlt={`@${
                      post.author?.accountname || "unknown"
                    } 프로필 이미지`}
                    content={post.content}
                    imageSrc={post.image}
                    dateTime={post.createdAt}
                    likeCount={post.heartCount}
                    commentCount={post.commentCount}
                    isLiked={post.hearted}
                    onLikeClick={() => handleProfileLike(post)}
                    onCommentClick={() => navigate(`/post/${post.id}`)}
                  />
                ))}
              </PostListContainer>
            ) : (
              <PostGallery
                posts={posts.map((post) => ({
                  postId: post.id,
                  userName: post.author?.username || "알 수 없음",
                  userId: post.author?.accountname || "",
                  avatarSrc: post.author?.image || "/img/empty-profile.png",
                  content: post.content,
                  imageSrc: post.image,
                  dateTime: post.createdAt,
                  dateText: formatPostDate(post.createdAt),
                  likeCount: post.heartCount,
                  commentCount: post.commentCount,
                  isLiked: post.hearted,
                }))}
                onPostClick={(id) => navigate(`/post/${id}`)}
              />
            )}
          </MyFeedSection>
        </>
      )}
      </>
    )}
    </>
  );
}

export default Profile;
