<<<<<<< Updated upstream

import { create } from 'zustand';
import { getToken } from '../utils/tokenManager';

interface FeedStore {
    feedList: any[];
    isRefreshing: boolean;
    isInitialLoading: boolean;
    setFeedList: (list: any[]) => void;
    setIsRefreshing: (value: boolean) => void;
    setIsInitialLoading: (value: boolean) => void;
    refreshFeed: () => void;
    fetchFeeds: () => Promise<void>;
}

export const useFeedStore = create<FeedStore>((set, get)=>({
    feedList: [],
    isRefreshing: false,
    isInitialLoading: true,
    setFeedList: (list) => set({ feedList: list}),
    setIsRefreshing: (value) => set({ isRefreshing: value }),
    setIsInitialLoading: (value) => set({ isInitialLoading: value }),
    refreshFeed: () => {
        set({ isRefreshing: true });
        get().fetchFeeds();
    },
    fetchFeeds: async() => {

        const token = getToken();
        if (!token) return;

        try {
            const query = new URLSearchParams();
            query.append("limit", "10");
            query.append("skip", "0");

            const url = `https://dev.wenivops.co.kr/services/mandarin/post${
            query.toString() ? `?${query}` : ""
            }`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "게시글 불러오기 실패");
            }

            const data = await res.json();

            const datalist = data.posts;
            const filtered = datalist.filter((ele: any) =>
                ele.author.email.includes("pirate")
            );
            const shuffled = filtered.sort(()=> 0.5 - Math.random() )

            set({ feedList: shuffled })

        } catch(err) {
            console.log(err)
        } finally {
            setTimeout(()=>{
                set({ isRefreshing : false, isInitialLoading: false  })
            },1000)
        }
    }
}))
=======
import { create } from "zustand";
import { getToken } from "../utils/tokenManager";

interface FeedStore {
  feedList: any[];
  skip: number;
  isRefreshing: boolean;
  isInitialLoading: boolean;
  hasMore: boolean; // 추가: 더 불러올 데이터가 있는지
  isInitialLized: boolean;
  isFetching: boolean; // 새 플래그
  setFeedList: (list: any[]) => void;
  setSkip: (value: number) => void;
  setIsRefreshing: (value: boolean) => void;
  setIsInitialLoading: (value: boolean) => void;
  refreshFeed: () => void;
  fetchFeeds: (isLoadMore?: boolean) => Promise<void>;
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  feedList: [],
  skip: 0,
  isRefreshing: false,
  isInitialLoading: true,
  hasMore: true, // 초기값
  isInitialLized: false,
  isFetching: false,
  setFeedList: (list) => set({ feedList: list }),
  setSkip: (val) => set({ skip: val }),
  setIsRefreshing: (value) => set({ isRefreshing: value }),
  setIsInitialLoading: (value) => set({ isInitialLoading: value }),

  refreshFeed: async () => {
    // 상태를 완전히 초기화
    set({
      isRefreshing: true,
      skip: 0,
      feedList: [],
      hasMore: true,
      isInitialLoading: true,
      isInitialLized: false,
    });

    // 약간의 딜레이 후 fetchFeeds 호출 (상태 업데이트 보장)
    await new Promise((resolve) => setTimeout(resolve, 50));

    await get().fetchFeeds(false);
  },

  fetchFeeds: async (isLoadMore = false) => {
    const token = getToken();
    if (!token) {
      console.log("토큰 없음");
      return;
    }

    // 중복 fetch 방지
    if (get().isFetching) return;

    // 상태를 다시 읽어옴 (최신 상태 보장)
    const currentState = get();
    const { skip, isRefreshing, hasMore } = currentState;

    // 무한스크롤일 때만 중복 체크
    if (isLoadMore && (isRefreshing || !hasMore)) {
      return;
    }

    // 시작 시점에 fetch중 플래그 설정 및 필요하면 isRefreshing 설정
    set({ isFetching: true, ...(isLoadMore ? { isRefreshing: true } : {}) });

    try {
      const query = new URLSearchParams();
      const limit = 5;
      const querySkip = isLoadMore ? skip : 0;
      query.append("limit", String(limit));
      query.append("skip", querySkip.toString()); // 새로고침이면 skip=0
      const url = `https://dev.wenivops.co.kr/services/mandarin/post?${query}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "게시글 불러오기 실패");
      }

      const data = await res.json();
      const datalist = data.posts;

      // serverCount 정의 (datalist.length 사용)
      const serverCount = Array.isArray(datalist) ? datalist.length : 0;
      //console.log('[fetchFeeds] querySkip:', querySkip, 'serverCount:', serverCount);

      // 디버그 로그: 요청/응답 상태 확인용
      if (serverCount === 0) {
        set({
          hasMore: false,
          isRefreshing: false,
          isInitialLoading: false,
          isFetching: false,
        });
        return;
      }

      const filtered = datalist
        .filter((ele: any) => ele.author.email.includes("pirate"))
        .map((ele: any) => ({
          ...ele,
          isLiked: ele.hearted ?? false,
          likeCount: ele.heartCount ?? ele.author?.hearts?.length ?? 0,
        }));

      const shuffled = filtered.slice().sort(() => 0.5 - Math.random());

      // serverCount: 서버가 반환한 원본 배열 길이(datalist.length)를 기준으로 skip 증가
      set((state) => {
        const newFeedList = isLoadMore
          ? [...state.feedList, ...shuffled]
          : shuffled;
        const newSkip = isLoadMore ? state.skip + serverCount : serverCount;
        // hasMore: 서버가 limit 만큼 반환했다면 다음 페이지가 있을 가능성이 큼
        const hasMoreNext = serverCount === limit;
        return {
          feedList: newFeedList,
          skip: newSkip,
          isInitialLoading: false,
          isRefreshing: false,
          hasMore: hasMoreNext,
          isInitialLized: true,
          isFetching: false,
        };
      });
    } catch (err) {
      set({ isRefreshing: false, isInitialLoading: false, isFetching: false });
    }
  },

  toggleLike: (postId) => {
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
}));
>>>>>>> Stashed changes
