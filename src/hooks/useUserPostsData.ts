import { useState, useCallback, useRef, useEffect } from "react";
import type { Feed } from "../types/feed";
import { fetchUserPosts, toggleLike } from "../services/feedService";

export const useUserPostsData = (userId: string) => {
  const [postsList, setPostsList] = useState<Feed[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  //  유저 게시글 데이터 로드

  const loadPosts = useCallback(
    async (pageNum: number, append: boolean = true) => {
      if (isLoading || !userId) return;

      setIsLoading(true);
      try {
        const newPosts = await fetchUserPosts(userId, pageNum);

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPostsList((prev) => {
            if (!append) return newPosts;

            const existingIds = new Set(prev.map((f) => f.id));
            const uniquePosts = newPosts.filter((f) => !existingIds.has(f.id));
            return [...prev, ...uniquePosts];
          });
        }
      } catch (err) {
        console.error("유저 게시글 로딩 실패:", err);
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    },
    [isLoading, userId]
  );

  //  좋아요 토글 (낙관적 업데이트)

  const handleLikeToggle = useCallback(
    async (postId: string): Promise<void> => {
      let previousPostsList: Feed[] = [];
      let originalIsLiked = false;

      // 낙관적 업데이트
      setPostsList((prev) => {
        previousPostsList = prev;
        const targetPost = prev.find((post) => post.id === postId);
        if (targetPost) {
          originalIsLiked = targetPost.isLiked;
        }

        return prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              }
            : post
        );
      });

      try {
        await toggleLike(postId, originalIsLiked);
      } catch (error) {
        console.error("좋아요 토글 실패:", error);
        // 실패 시 롤백
        setPostsList(previousPostsList);
      }
    },
    []
  );

  //  다음 페이지 로드
  const loadNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

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
  }, [postsList.length, hasMore, isLoading, loadNextPage]);

  //  페이지 변경 시 데이터 로드

  useEffect(() => {
    if (page === 1 && postsList.length > 0) return; // 초기 로드 제외
    loadPosts(page);
  }, [page]);

  //  초기 로드 - userId 변경 시마다 리셋

  useEffect(() => {
    if (!userId) return;

    // userId가 변경되면 상태 초기화
    setPostsList([]);
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true);

    loadPosts(1, false); // 초기엔 덮어쓰기
  }, [userId]);

  return {
    postsList,
    isLoading,
    isInitialLoading,
    hasMore,
    scrollContainerRef,
    loadMoreTriggerRef,
    handleLikeToggle,
  };
};