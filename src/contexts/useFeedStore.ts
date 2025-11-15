import { create } from "zustand";
import { getToken } from "../utils/tokenManager";

interface FeedStore {
  feedList: any[];
  skip: number;
  isRefreshing: boolean;
  isInitialLoading: boolean;
  hasMore: boolean;
  isInitialLized: boolean;
  isFetching: boolean;
  isLoading: boolean;

  setFeedList: (list: any[]) => void;
  setSkip: (value: number) => void;
  setIsRefreshing: (value: boolean) => void;
  setIsInitialLoading: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;

  refreshFeed: () => void;
  fetchFeeds: (isLoadMore?: boolean) => Promise<void>;
  toggleLike: (postId: string) => void;
  updatePost: (updatedPost: any) => void;
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
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    await get().fetchFeeds(false);
  },

  fetchFeeds: async (isLoadMore = false) => {
    const token = getToken();
    if (!token) return;

    if (get().isFetching) return;

    const { skip, isRefreshing, hasMore, isLoading } = get();

    if (isLoadMore && (isRefreshing || !hasMore)) return;

    set({
      isFetching: true,
      ...(isLoadMore ? { isRefreshing: true } : {}),
    });
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

      if (serverCount === 0) {
        set({
          hasMore: false,
          isRefreshing: false,
          isInitialLoading: false,
          isFetching: false,
        });
        return;
      }

      const normalized = datalist
        .filter((ele: any) => ele.author.email.includes("pirate"))
        .map((ele: any) => ({
          ...ele,
          isLiked: ele.hearted ?? false,
          likeCount: ele.heartCount ?? ele.author?.hearts?.length ?? 0,
          profileImg: ele.author?.image ?? "/img/empty-profile.png",
        }));

      const shuffled = normalized.sort(() => 0.5 - Math.random());

      set((state) => {
        const newFeedList = isLoadMore
          ? [...state.feedList, ...shuffled]
          : shuffled;

        const newSkip = isLoadMore ? state.skip + serverCount : serverCount;

        return {
          feedList: newFeedList,
          skip: newSkip,
          isInitialLoading: false,
          isRefreshing: false,
          hasMore: serverCount === limit,
          isLoading: false,
          isInitialLized: true,
          isFetching: false,
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

  updatePost: (updatedPost: any) => {
    const { feedList } = get();

    const updated = feedList.map((feed) =>
      feed.id === updatedPost.id
        ? {
            ...feed,
            ...updatedPost,
            isLiked: updatedPost.hearted ?? feed.isLiked,
            likeCount: updatedPost.heartCount ?? feed.likeCount,
          }
        : feed
    );

    set({ feedList: updated });
  },
}));
