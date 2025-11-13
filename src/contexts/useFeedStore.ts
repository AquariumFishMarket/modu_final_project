import { create } from 'zustand';
import { getToken } from '../utils/tokenManager';

interface FeedStore {
    feedList: any[];
    skip: number;
    isRefreshing: boolean;
    isInitialLoading: boolean;
    hasMore: boolean; // ✅ 추가: 더 불러올 데이터가 있는지
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
    hasMore: true, // ✅ 초기값

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
            isInitialLoading: true
        });


        // 약간의 딜레이 후 fetchFeeds 호출 (상태 업데이트 보장)
        await new Promise(resolve => setTimeout(resolve, 50));

        await get().fetchFeeds(false);
    },

    fetchFeeds: async (isLoadMore = false) => {
        const token = getToken();
        if (!token) {
            console.log('토큰 없음');
            return;
        }

        // 상태를 다시 읽어옴 (최신 상태 보장)
        const currentState = get();
        const { skip, feedList, isRefreshing, hasMore } = currentState;

        // 무한스크롤일 때만 중복 체크
        if (isLoadMore && (isRefreshing || !hasMore)) {
            return;
        }

        try {
            // 무한스크롤일 때만 isRefreshing 설정
            if (isLoadMore) {
                set({ isRefreshing: true });
            }

            const query = new URLSearchParams();
            query.append("limit", "3");
            query.append("skip", skip.toString()); // ✅ 새로고침이면 skip=0
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

            if (datalist.length === 0) {
                set({ hasMore: false, isRefreshing: false, isInitialLoading: false });
                return;
            }

            const filtered = datalist.filter((ele: any) =>
                ele.author.email.includes("pirate")
            );

            const shuffled = filtered.slice().sort(() => 0.5 - Math.random());

            set((state) => {
                const newFeedList = isLoadMore
                    ? [...state.feedList, ...shuffled]
                    : shuffled;
                const newSkip = isLoadMore ? state.skip + 3 : 3;

                return {
                    feedList: newFeedList,
                    skip: newSkip,
                    isInitialLoading: false,
                    isRefreshing: false,
                    hasMore: shuffled.length > 0,
                };
            });

        } catch (err) {
            set({ isRefreshing: false, isInitialLoading: false });
        }
    },
}));