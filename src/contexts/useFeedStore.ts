import { create } from "zustand";
import { getToken } from "../utils/tokenManager";
import type { Feed } from "../types/feed";
import type { Post } from "../types/post";
import { fetchPostMeta } from "../utils/fetchPostMeta";
import {
  likePost as apiLikePost,
  unlikePost as apiUnlikePost,
} from "../services/postService";

const LIKE_STORAGE_KEY = "feed-liked-posts";

// 로컬 좋아요 기록 불러오기
const loadLikedPosts = (): Record<string, boolean> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LIKE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// 로컬 좋아요 기록 저장
const saveLikedPosts = (liked: Record<string, boolean>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(liked));
  } catch {
    // 저장 실패
  }
};

interface FeedStore {
  feedList: Feed[];
  skip: number;
  isRefreshing: boolean;
  isInitialLoading: boolean;
  hasMore: boolean;
  isInitialLized: boolean;
  isFetching: boolean;
  isLoading: boolean;

  likedPosts: Record<string, boolean>;

  setFeedList: (list: Feed[]) => void;
  setSkip: (value: number) => void;
  setIsRefreshing: (value: boolean) => void;
  setIsInitialLoading: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;

  refreshFeed: () => void;
  fetchFeeds: (isLoadMore?: boolean) => Promise<void>;

  toggleLike: (postId: string) => Promise<Post | null>;
  updatePost: (updatedPost: Post) => void;
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  feedList: [],
  skip: 0,
  isRefreshing: false,
  isInitialLoading: true,
  hasMore: true,
  isInitialLized: false,
  isFetching: false,
  isLoading: true,

  likedPosts: loadLikedPosts(),

  setFeedList: (list) => set({ feedList: list }),
  setSkip: (val) => set({ skip: val }),
  setIsRefreshing: (value) => set({ isRefreshing: value }),
  setIsInitialLoading: (value) => set({ isInitialLoading: value }),
  setIsLoading: (value) => set({ isLoading: value }),

  // 전체 새로고침
  refreshFeed: async () => {
    set({
      isRefreshing: true,
      skip: 0,
      feedList: [],
      hasMore: true,
      isLoading: true,
      isInitialLoading: true,
      isInitialLized: false,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    await get().fetchFeeds(false);
  },

  // 피드 불러오기
  fetchFeeds: async (isLoadMore = false) => {
    const token = getToken();
    if (!token) return;

    const { skip, isRefreshing, hasMore, isFetching, likedPosts } = get();

    if (isFetching) return;
    if (isLoadMore && (isRefreshing || !hasMore)) return;

    set({
      isFetching: true,
      ...(isLoadMore ? { isRefreshing: true } : {}),
    });

    try {
      const limit = 5;
      const querySkip = isLoadMore ? skip : 0;

      const url = `https://dev.wenivops.co.kr/services/mandarin/post?limit=${limit}&skip=${querySkip}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });

      if (!res.ok) throw new Error("피드 불러오기 실패");

      const data = await res.json();
      const datalist = data.posts || [];
      const serverCount = datalist.length;

      // 더 이상 불러올 데이터 없음
      if (serverCount === 0) {
        set({
          hasMore: false,
          isRefreshing: false,
          isInitialLoading: false,
          isFetching: false,
        });
        return;
      }

      const normalized: Feed[] = datalist
        .filter((ele: Post) => ele.author.email.includes("pirate"))
        .map(
          (ele: Post): Feed => ({
            id: ele.id,
            profileImg: ele.author?.image ?? "/img/empty-profile.png",
            userName: ele.author.username,
            userId: ele.author.accountname,
            content: ele.content,
            image: ele.image ?? "",
            isLiked: ele.hearted ?? false,
            likeCount: ele.heartCount ?? 0,
            commentCount: ele.commentCount ?? 0,
            createdAt: ele.createdAt,
          })
        );

      const merged = await Promise.all(
        normalized.map(async (item) => {
          const meta = await fetchPostMeta(item.id);

          const localLiked = likedPosts[item.id];

          const finalIsLiked = localLiked ?? meta.hearted;

          const finalLikeCount = meta.heartCount;

          return {
            ...item,
            isLiked: finalIsLiked,
            likeCount: finalLikeCount,
            commentCount: meta.commentCount,
            image: meta.image || item.image,
          };
        })
      );

      const shuffled = merged.sort(() => 0.5 - Math.random());

      set((state) => ({
        feedList: isLoadMore ? [...state.feedList, ...shuffled] : shuffled,
        skip: isLoadMore ? state.skip + serverCount : serverCount,

        isInitialLoading: false,
        isRefreshing: false,
        isLoading: false,
        isInitialLized: true,
        isFetching: false,
        hasMore: serverCount === limit,
      }));
    } catch (err) {
      console.error(err);
      set({
        isRefreshing: false,
        isInitialLoading: false,
        isFetching: false,
      });
    }
  },

  // 좋아요 토글
  toggleLike: async (postId: string): Promise<Post | null> => {
    const { feedList, likedPosts } = get();

    const target = feedList.find((f) => f.id === postId);
    if (!target) return null;

    const prevLiked = target.isLiked;
    const prevFeedList = feedList;
    const prevLikedPosts = likedPosts;

    const optimisticLiked = !prevLiked;

    // 낙관적 업데이트
    const optimisticFeedList = feedList.map((feed) =>
      feed.id === postId
        ? {
            ...feed,
            isLiked: optimisticLiked,
            likeCount: optimisticLiked
              ? feed.likeCount + 1
              : Math.max(feed.likeCount - 1, 0),
          }
        : feed
    );

    set({ feedList: optimisticFeedList });

    try {
      const updatedPost = (
        prevLiked ? await apiUnlikePost(postId) : await apiLikePost(postId)
      ) as Post | null;

      if (!updatedPost) {
        set({ feedList: prevFeedList, likedPosts: prevLikedPosts });
        return null;
      }

      set((state) => {
        const syncedFeedList = state.feedList.map((feed) =>
          feed.id === updatedPost.id
            ? {
                ...feed,
                content: updatedPost.content,
                image: updatedPost.image ?? feed.image,
                isLiked: updatedPost.hearted,
                likeCount: updatedPost.heartCount,
                commentCount: updatedPost.commentCount,
              }
            : feed
        );

        const newLikedPosts = {
          ...state.likedPosts,
          [postId]: updatedPost.hearted,
        };
        saveLikedPosts(newLikedPosts);

        return {
          feedList: syncedFeedList,
          likedPosts: newLikedPosts,
        };
      });

      return updatedPost;
    } catch (error) {
      console.error("피드 좋아요 토글 실패:", error);
      set({
        feedList: prevFeedList,
        likedPosts: prevLikedPosts,
      });
      return null;
    }
  },

  updatePost: (updatedPost: Post) => {
    const { feedList } = get();

    const updated = feedList.map((feed) =>
      feed.id === updatedPost.id
        ? {
            ...feed,
            content: updatedPost.content,
            image: updatedPost.image ?? feed.image,
            isLiked: updatedPost.hearted,
            likeCount: updatedPost.heartCount,
            commentCount: updatedPost.commentCount,
          }
        : feed
    );

    set({ feedList: updated });
  },
}));
