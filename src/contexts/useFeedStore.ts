import { create } from "zustand";
import { getToken } from "../utils/tokenManager";
import type { Feed } from "../types/feed";
import type { Post } from "../types/post";

interface FeedStore {
  feedList: Feed[];
  skip: number;
  isRefreshing: boolean;
  isInitialLoading: boolean;
  hasMore: boolean;
  isInitialLized: boolean;
  isFetching: boolean;
  isLoading: boolean;
  lastFetchCount: number;
  requestCount: number;

  setFeedList: (list: Feed[]) => void;
  setSkip: (value: number) => void;
  setIsRefreshing: (value: boolean) => void;
  setIsInitialLoading: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;

  refreshFeed: () => void;
  fetchFeeds: (isLoadMore?: boolean) => Promise<void>;
  toggleLike: (postId: string) => void;
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
  lastFetchCount: 0,
  requestCount: 0,

  setFeedList: (list) => set({ feedList: list }),
  setSkip: (val) => set({ skip: val }),
  setIsRefreshing: (value) => set({ isRefreshing: value }),
  setIsInitialLoading: (value) => set({ isInitialLoading: value }),
  setIsLoading: (value) => set({ isLoading: value }),

  refreshFeed: async () => {
    set({
      isRefreshing: true,
      skip: 0,
      feedList: [],
      hasMore: true,
      isLoading: true,
      isInitialLoading: true,
      isInitialLized: false,
      isFetching: false,
      requestCount: 0,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    await get().fetchFeeds(false);
  },

  fetchFeeds: async (isLoadMore = false) => {
    const token = getToken();
    if (!token) return;

    if (get().isFetching) return;

    const { skip, isRefreshing, requestCount } = get();

    if (isLoadMore && isRefreshing) return;

    const MAX_REQUESTS = 10;
      if (isLoadMore && requestCount >= MAX_REQUESTS) {
        set({
          hasMore: false,
          isRefreshing: false,
          isFetching: false,
        });
        return;
      }

    if(isLoadMore) {
      set({ isRefreshing: true })
    }

    set({ isFetching: true });

    try {
      const query = new URLSearchParams();
      const limit = 5;
      const querySkip = isLoadMore ? skip : 0;

      query.append("limit", String(limit));
      query.append("skip", querySkip.toString());

      const url = `https://dev.wenivops.co.kr/services/mandarin/post?${query}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });

      if (!res.ok) throw new Error("게시글 불러오기 실패");

      const data = await res.json();
      const datalist = data.posts || [];
      const serverCount = datalist.length;

      //console.log('[fetchFeeds] requestCount:', requestCount + 1, 'serverCount:', serverCount);

      if (serverCount === 0) {
        set({
          hasMore: false,
          isRefreshing: false,
          isInitialLoading: false,
          isFetching: false,
          lastFetchCount: 0,
          requestCount: isLoadMore ? requestCount + 1 : 1,
        });
        return;
      }

      const normalized = datalist
        .filter((ele: Post) => ele.author.email.includes("pirate"))
        .map((ele: Post): Feed => ({
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
        }));

      const shuffled = normalized.sort(() => 0.5 - Math.random());

      set((state) => {
        const newFeedList = isLoadMore
          ? [...state.feedList, ...shuffled]
          : shuffled;

        const newSkip = isLoadMore ? state.skip + serverCount : serverCount;
        const newRequestCount = isLoadMore ? requestCount + 1 : 1;
        const hasMoreNext = normalized.length > 0 && newRequestCount < MAX_REQUESTS;

        return {
          feedList: newFeedList,
          skip: newSkip,
          isInitialLoading: false,
          isRefreshing: false,
          hasMore: hasMoreNext,
          isInitialLized: true,
          isFetching: false,
          lastFetchCount: serverCount,
          requestCount: newRequestCount
        };
      });
    } catch (err) {
      set({
        isRefreshing: false,
        isInitialLoading: false,
        isFetching: false,
      });
    }
  },

  toggleLike: (postId: string) => {
    const { feedList } = get();

    const updated = feedList.map((feed) =>
      feed.id === postId
        ? {
            ...feed,
            isLiked: !feed.isLiked,
            likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
          }
        : feed
    );

    set({ feedList: updated });
  },

  updatePost: (updatedPost: Post) => {
    const { feedList } = get();

    const updated = feedList.map((feed) =>
      feed.id === updatedPost.id
        ? {
            ...feed,
            content: updatedPost.content,
            image: updatedPost.image ?? "",
            isLiked: updatedPost.hearted ?? feed.isLiked,
            likeCount: updatedPost.heartCount ?? feed.likeCount,
            commentCount: updatedPost.commentCount ?? feed.commentCount,
          }
        : feed
    );

    set({ feedList: updated });
  },
}));
