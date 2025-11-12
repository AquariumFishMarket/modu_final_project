import { useState, useCallback, useRef, useEffect } from "react";
import type { Feed } from "../types/feed";
import { fetchFeed, toggleLike } from "../services/feedService";

export const useFeedData = () => {
  const [feedList, setFeedList] = useState<Feed[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  //  피드 데이터 로드

  const loadFeed = useCallback(
    async (pageNum: number, append: boolean = true) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const newFeed = await fetchFeed(pageNum);

        if (newFeed.length === 0) {
          setHasMore(false);
        } else {
          setFeedList((prev) => {
            if (!append) return newFeed;

            const existingIds = new Set(prev.map((f) => f.id));
            const uniqueFeed = newFeed.filter((f) => !existingIds.has(f.id));
            return [...prev, ...uniqueFeed];
          });
        }
      } catch (err) {
        console.error("피드 로딩 실패:", err);
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    },
    [isLoading]
  );

  //  좋아요 토글 (낙관적 업데이트)

  const handleLikeToggle = useCallback(
    async (feedId: string): Promise<void> => {
      const previousFeedList = feedList;

      // 낙관적 업데이트
      setFeedList((prev) =>
        prev.map((feed) =>
          feed.id === feedId
            ? {
                ...feed,
                isLiked: !feed.isLiked,
                likeCount: feed.isLiked
                  ? feed.likeCount - 1
                  : feed.likeCount + 1,
              }
            : feed
        )
      );

      try {
        await toggleLike(feedId);
      } catch (error) {
        console.error("좋아요 토글 실패:", error);
        // 실패 시 롤백
        setFeedList(previousFeedList);
      }
    },
    [feedList]
  );

  //  새로고침

  const triggerRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const newFeed = await fetchFeed(1);
      setFeedList(newFeed);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error("새로고침 실패:", error);
    } finally {
      // 데이터 실제 로드 후 200ms 후에만 복구
      setTimeout(() => setIsRefreshing(false), 200);
    }
  }, []);

  //  다음 페이지 로드
  const loadNextPage = useCallback(() => {
    setPage((prev) => {
      return prev + 1;
    });
  }, []); // deps 제거로 함수 재생성 방지

  //  IntersectionObserver로 무한 스크롤 구현

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    const container = scrollContainerRef.current;

    if (!trigger || !container) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadNextPage();
        }
      },
      {
        root: container,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(trigger);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [feedList.length, hasMore, isLoading, loadNextPage]);

  //  페이지 변경 시 데이터 로드

  useEffect(() => {
    if (page === 1 && feedList.length > 0) return; // 초기 로드 또는 새로고침 제외
    loadFeed(page);
  }, [page]);

  //  초기 로드

  useEffect(() => {
    loadFeed(1, false); // 초기엔 덮어쓰기
  }, []); // 마운트 시 딱 한 번만 실행

  return {
    feedList,
    isLoading,
    isInitialLoading,
    isRefreshing,
    hasMore,
    scrollContainerRef,
    loadMoreTriggerRef,
    handleLikeToggle,
    triggerRefresh,
  };
};
