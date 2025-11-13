import { useState, useCallback, useRef, useEffect } from "react";
import type { Feed } from "../types/feed";
import { fetchFeed, toggleLike } from "../services/feedService";
import { getToken } from "../utils/tokenManager";

export const useFeedData = () => {
  const [feedList, setFeedList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);


  //  좋아요 토글 (낙관적 업데이트)

  const handleLikeToggle = useCallback(
    async (feedId: string): Promise<void> => {
      const previousFeedList = feedList;
      const targetFeed = feedList.find((feed) => feed.id === feedId);
      if (!targetFeed) return;

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
        await toggleLike(feedId, targetFeed.isLiked);
      } catch (error) {
        console.error("좋아요 토글 실패:", error);
        // 실패 시 롤백
        setFeedList(previousFeedList);
      }
    },
    [feedList]
  );


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


  return {
    hasMore,
    scrollContainerRef,
    loadMoreTriggerRef,
    handleLikeToggle,
  };
};
