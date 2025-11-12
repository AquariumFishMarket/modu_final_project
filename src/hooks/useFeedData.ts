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

  /**
   * 피드 데이터 로드
   */
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

  /**
   * 좋아요 토글 (낙관적 업데이트)
   */
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

  /**
   * 새로고침
   */
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
      setTimeout(() => setIsRefreshing(false), 800);
    }
  }, []);

  /**
   * 다음 페이지 로드
   */
  const loadNextPage = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isLoading]);

  /**
   * IntersectionObserver로 무한 스크롤 구현
   */
  useEffect(() => {
    if (!loadMoreTriggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadNextPage();
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "100px", // 바닥에 닿기 100px 전에 로딩 시작
        threshold: 0.1,
      }
    );

    observerRef.current.observe(loadMoreTriggerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadNextPage]);

  /**
   * 페이지 변경 시 데이터 로드
   */
  useEffect(() => {
    if (page === 1 && feedList.length > 0) return; // 초기 로드 또는 새로고침 제외
    loadFeed(page);
  }, [page]);

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadFeed(1);
  }, []);

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
