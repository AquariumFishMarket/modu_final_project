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

import { likePost, unlikePost } from "../../../services/postService";
import MoreMenu from "../../../components/common/modal/MoreMenu";
import { formatPostDate } from "../../../utils/formatter/dateFormatter";
import { fetchPostMeta } from "../../../utils/fetchPostMeta";
import { useFeedStore } from "../../../contexts/useFeedStore";

function Profile() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const { currentUser, isLoading: isAuthLoading, logout } = useAuth();

  const { accountname: paramAccountname } = useParams<{
    accountname?: string;
  }>();

  const updatedFollow = useFollowStore((state) => state.lastUpdate);
  const clearFollowUpdate = useFollowStore((state) => state.clearUpdate);

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postState, setPostState] = useState<"list" | "gallery">("list");
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const toggleFeedLike = useFeedStore((state) => state.toggleLike);

  const currentUserAccountname = currentUser?.accountname ?? "";

  const targetAccountname =
    paramAccountname && paramAccountname.trim() !== ""
      ? paramAccountname
      : currentUserAccountname;

  const isMyProfile = currentUserAccountname === targetAccountname;

  // 헤더 설정
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

  // 프로필 / 게시글 불러오기
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

        const enhancedPosts: Post[] = await Promise.all(
          (posts || []).map(async (post) => {
            try {
              const meta = await fetchPostMeta(post.id);

              return {
                ...post,
                heartCount:
                  typeof meta.heartCount === "number"
                    ? meta.heartCount
                    : post.heartCount,
                commentCount:
                  typeof meta.commentCount === "number"
                    ? meta.commentCount
                    : post.commentCount,
                hearted:
                  typeof meta.hearted === "boolean"
                    ? meta.hearted
                    : post.hearted,
                image: meta.image || post.image,
              };
            } catch {
              return post;
            }
          })
        );

        setPostsList(enhancedPosts);
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

  // 팔로우 상태가 다른 곳에서 바뀐 경우 동기화
  useEffect(() => {
    if (!updatedFollow || !profileData) return;

    // 내가 보고 있는 프로필의 팔로우 정보가 바뀐 경우
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

    // 내 프로필이면 내가 팔로우한 수 갱신
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

  // 팔로우 / 언팔 토글
  const handleFollowToggle = async () => {
    if (!profileData || isFollowLoading) return;

    setIsFollowLoading(true);

    try {
      await toggleProfileFollow(profileData.accountname, profileData.isfollow);

      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              isfollow: !prev.isfollow,
              followerCount: prev.isfollow
                ? prev.followerCount - 1
                : prev.followerCount + 1,
            }
          : prev
      );
    } catch (err) {
      console.error("팔로우 토글 실패:", err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // 좋아요 기능
  const handleProfileLike = async (post: Post) => {
    const isLikedNow = post.hearted;

    setPostsList((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              hearted: !p.hearted,
              heartCount: p.hearted ? p.heartCount - 1 : p.heartCount + 1,
            }
          : p
      )
    );

    toggleFeedLike(post.id);

    try {
      const updatedPost = isLikedNow
        ? await unlikePost(post.id)
        : await likePost(post.id);

      if (updatedPost) {
        useFeedStore.getState().updatePost(updatedPost);
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      // 실패 시 롤백까지 하고 싶다면 여기서 setPostsList(prev => ...) 로 복구 가능
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
        <ProfileContainer>
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

          <UserInfoBox>
            <UserName>{profileData.username}</UserName>
            <UserId>@{profileData.accountname}</UserId>
          </UserInfoBox>

          <UserDescription>{profileData.intro}</UserDescription>

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
                  disabled={isFollowLoading}
                />
                <IconButton $iconUrl="/img/icon-share.svg" />
              </>
            )}
          </ActionButtonsContainer>
        </ProfileContainer>
      </ProfileSection>

      <SellingProducts isLastSection={postsList.length === 0} />

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
                posts={postsList.map((post) => ({
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
  );
}

export default Profile;
