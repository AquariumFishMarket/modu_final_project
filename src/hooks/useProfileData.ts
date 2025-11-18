import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../contexts/useAuthStore";
import { useFollowStore } from "../contexts/followStore";
import {
  fetchProfile,
  fetchUserPosts,
  toggleProfileFollow,
} from "../services/profileService";
import { likePost, unlikePost } from "../services/postService";
import { fetchPostMeta } from "../utils/fetchPostMeta";
import type { UserProfile } from "../types/user";
import type { Post } from "../types/post";
import { useFeedStore } from "../contexts/useFeedStore";

export function useProfileData(targetAccountname?: string) {
  const navigate = useNavigate();

  const currentUser = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isLoading);

  const updatedFollow = useFollowStore((s) => s.lastUpdate);
  const clearFollowUpdate = useFollowStore((s) => s.clearUpdate);

  const toggleFeedLike = useFeedStore((s) => s.toggleLike);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // 실제 계정명
  const currentAccountname = currentUser?.accountname ?? "";
  const resolvedAccountname =
    targetAccountname && targetAccountname.trim() !== ""
      ? targetAccountname
      : currentAccountname;

  const isMyProfile = resolvedAccountname === currentAccountname;

  // 프로필 / 게시글 로딩
  useEffect(() => {
    const loadData = async () => {
      if (isAuthLoading) return;

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setLoading(true);

      try {
        const fetched = await fetchProfile(
          resolvedAccountname,
          currentAccountname
        );
        if (!fetched) throw new Error("프로필 정보를 불러올 수 없습니다.");

        let loadedProfile: UserProfile;

        if (isMyProfile) {
          loadedProfile = {
            ...fetched,
            username: currentUser.username,
            accountname: currentUser.accountname,
            intro: currentUser.intro,
            image: currentUser.image,
          };
        } else {
          loadedProfile = fetched;
        }

        setProfile(loadedProfile);

        // 게시글 로드
        const posts = await fetchUserPosts(loadedProfile.accountname);

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

        setPosts(enhancedPosts);
      } catch (error) {
        console.error("프로필 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    isAuthLoading,
    currentUser,
    navigate,
    isMyProfile,
    resolvedAccountname,
    currentAccountname,
  ]);

  // 팔로우 동기화
  useEffect(() => {
    if (!updatedFollow || !profile) return;

    // 보고 있는 프로필의 팔로우 정보 변경
    if (updatedFollow.accountname === profile.accountname) {
      setProfile((prev) =>
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

    // 내 프로필이면 followingCount 변경
    if (isMyProfile) {
      setProfile((prev) =>
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
  }, [updatedFollow, profile, clearFollowUpdate, isMyProfile]);

  // 팔로우 / 언팔로우
  const handleFollowToggle = useCallback(async () => {
    if (!profile || isFollowLoading) return;
    setIsFollowLoading(true);

    try {
      await toggleProfileFollow(profile.accountname, profile.isfollow);

      // 즉시 UI 반영
      setProfile((prev) =>
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

      if (isMyProfile) {
        await useAuthStore.getState().refreshUser();
      }
    } catch (err) {
      console.error("팔로우 토글 실패:", err);
    } finally {
      setIsFollowLoading(false);
    }
  }, [profile, isFollowLoading, isMyProfile]);

  // 좋아요 토글
  const handleProfileLike = useCallback(
    async (post: Post) => {
      const isLikedNow = post.hearted;

      setPosts((prev) =>
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
      } catch (error) {
        console.error("좋아요 처리 실패:", error);
      }
    },
    [toggleFeedLike]
  );

  return {
    loading,
    profile,
    posts,
    isMyProfile,
    isFollowLoading,
    handleFollowToggle,
    handleProfileLike,
  };
}
