
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