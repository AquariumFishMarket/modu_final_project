import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useHeader } from "../../../contexts/HeaderContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useFollowStore } from "../../../contexts/followStore";

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
import SellingProducts from "./SellingProducts";
import PostCard from "../../../components/post/postCard/PostCard";
import PostStateBar from "../../../components/post/PostStateBar";
import PostGallery from "./PostGallery";
import ProfileImageContainer from "./ProfileImageContainer";

import type { UserProfile } from "../../../types/user";
import type { Post } from "../../../types/post";

import {
  fetchProfile,
  fetchUserPosts,
  toggleProfileFollow,
} from "../../../services/profileService";
import MoreMenu from "../../../components/common/modal/MoreMenu";

function Profile() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const { currentUser, isLoading: isAuthLoading, logout } = useAuth();

  const { accountname: paramAccountname } = useParams<{
    accountname?: string;
  }>();

  const updatedFollow = useFollowStore((state) => state.updatedUser);
  const clearFollowUpdate = useFollowStore((state) => state.clearUpdate);

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postState, setPostState] = useState<"list" | "gallery">("list");
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const currentUserAccountname = currentUser?.accountname ?? "";

  const targetAccountname =
    paramAccountname && paramAccountname.trim() !== ""
      ? paramAccountname
      : currentUserAccountname;

  const isMyProfile = currentUserAccountname === targetAccountname;

  useEffect(() => {
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
  }, [navigate, setHeaderConfig, logout]);

  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthLoading) return;
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        let profile: UserProfile;

        if (isMyProfile) {
          profile = {
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
          const data = await fetchProfile(
            targetAccountname,
            currentUserAccountname
          );
          if (!data) throw new Error("프로필 정보를 불러올 수 없습니다.");
          profile = data;
        }

        setProfileData(profile);

        const posts = await fetchUserPosts(profile.accountname);
        setPostsList(posts || []);
      } catch (err) {
        console.error("프로필 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [
    isAuthLoading,
    currentUser,
    navigate,
    isMyProfile,
    targetAccountname,
    currentUserAccountname,
  ]);

  useEffect(() => {
    if (!updatedFollow || !profileData) return;

    if (updatedFollow.accountname === profileData.accountname) {
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              isfollow: updatedFollow.isfollow ?? prev.isfollow,
              followerCount:
                typeof updatedFollow.followerCountDiff === "number"
                  ? prev.followerCount + updatedFollow.followerCountDiff
                  : prev.followerCount,
            }
          : prev
      );
    }

    if (isMyProfile) {
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              followingCount:
                typeof updatedFollow.followerCountDiff === "number"
                  ? prev.followingCount + updatedFollow.followerCountDiff
                  : prev.followingCount,
            }
          : prev
      );
    }

    clearFollowUpdate();
  }, [updatedFollow, profileData, clearFollowUpdate, isMyProfile]);

  const handleFollowToggle = async () => {
    if (!profileData || isFollowLoading) return;

    const prev = profileData;
    const newState = !profileData.isfollow;

    setProfileData({
      ...profileData,
      isfollow: newState,
      followerCount: profileData.followerCount + (newState ? 1 : -1),
    });

    setIsFollowLoading(true);

    try {
      await toggleProfileFollow(profileData.accountname, prev.isfollow);

      useFollowStore.getState().updateFollow({
        accountname: profileData.accountname,
        isfollow: newState,
        followerCountDiff: newState ? 1 : -1,
      });
    } catch (err) {
      setProfileData(prev); // 롤백
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isAuthLoading || isLoading || !profileData) {
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
          {/* 상단 FOLLOWER - IMAGE - FOLLOWING */}
          <ProfileTopSection>
            <FollowStatBox
              onClick={() =>
                navigate(`/profile/${profileData.accountname}/follower`)
              }
            >
              <FollowerValue>{profileData.followerCount}</FollowerValue>
              <FollowText>followers</FollowText>
            </FollowStatBox>

            <ProfileImageContainer
              src={profileData.image}
              alt={`${profileData.username}의 프로필 이미지`}
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.src.includes("/img/fish_profile.png"))
                  t.src = "/img/fish_profile.png";
              }}
            />

            <FollowStatBox
              onClick={() =>
                navigate(`/profile/${profileData.accountname}/following`)
              }
            >
              <FollowingValue>{profileData.followingCount}</FollowingValue>
              <FollowText>following</FollowText>
            </FollowStatBox>
          </ProfileTopSection>

          {/* 유저 정보 */}
          <UserInfoBox>
            <UserName>{profileData.username}</UserName>
            <UserId>@{profileData.accountname}</UserId>
          </UserInfoBox>

          <UserDescription>{profileData.intro}</UserDescription>

          {/* 버튼 그룹 */}
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
                  text={profileData.isfollow ? "팔로잉" : "팔로우"}
                  height="medium"
                  variant={profileData.isfollow ? "secondary" : "primary"}
                  width={120}
                  onClick={handleFollowToggle}
                />
                <IconButton $iconUrl="/img/icon-share.svg" />
              </>
            )}
          </ActionButtonsContainer>
        </ProfileContainer>
      </ProfileSection>

      {/* 상품 */}
      <SellingProducts isLastSection={postsList.length === 0} />

      {/* 게시글 */}
      {postsList.length > 0 && (
        <>
          <PostStateBar postState={postState} setPostState={setPostState} />

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
                    avatarAlt={`@${post.author.accountname} 프로필 이미지`}
                    content={post.content}
                    imageSrc={post.image}
                    dateTime={post.createdAt}
                    likeCount={post.heartCount}
                    commentCount={post.commentCount}
                    isLiked={post.hearted}
                    onCommentClick={() => navigate(`/post/${post.id}`)}
                  />
                ))}
              </PostListContainer>
            ) : (
              <PostGallery
                posts={postsList.map((post) => ({
                  postId: post.id,
                  userName: post.author.username,
                  userId: post.author.accountname,
                  avatarSrc: post.author.image,
                  content: post.content,
                  imageSrc: post.image,
                  dateTime: post.createdAt,
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
  );
}

export default Profile;
