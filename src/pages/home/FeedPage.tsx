import { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import PostCard from "../../components/post/postCard/PostCard";

import { useFeedStore } from "../../contexts/useFeedStore";
import { useAuthStore } from "../../contexts/useAuthStore";
import { reportPost } from "../../services/postService";
import FeedSkeleton from "./skeleton/FeedSkeleton";

const FeedPage = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const toggleLike = useFeedStore((state) => state.toggleLike);

  const observer = useRef<IntersectionObserver | null>(null);

  const handlePostReport = async (postId: string) => {
    try {
      await reportPost(postId);
      alert("게시글이 신고되었습니다.");
    } catch (error) {
      alert("게시글 신고에 실패했습니다.");
    }
  };

  const feedList = useFeedStore((state) => state.feedList);
  const isLoading = useFeedStore((state) => state.isInitialLoading);
  const fetchFeeds = useFeedStore((state) => state.fetchFeeds);
  const hasMore = useFeedStore((state) => state.hasMore);
  const isRefreshing = useFeedStore((state) => state.isRefreshing);
  const isInitialLized = useFeedStore((state) => state.isInitialLized);

  const hasMoreRef = useRef(hasMore);
  const isRefreshingRef = useRef(isRefreshing);
  const loadInProgressRef = useRef(false);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    if (isInitialLized) return;
    fetchFeeds(false);
  }, [isInitialLized, fetchFeeds]);

  const lastCardRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;

          if (!hasMoreRef.current) return;
          if (isRefreshingRef.current) return;
          if (loadInProgressRef.current) return;

          loadInProgressRef.current = true;

          fetchFeeds(true).finally(() => {
            loadInProgressRef.current = false;
          });
        },
        { threshold: 1 }
      );

      observer.current.observe(node);
    },
    [fetchFeeds]
  );

  return (
    <>
    {isLoading && <FeedSkeleton />}
        {feedList.map((feed, idx) => {
          const isLast = idx === feedList.length - 1;
          const isMyPost = currentUser?.accountname === feed.userId;

          return (
            <PostCard
              key={`${feed.id}-${idx}`}
              postId={feed.id}
              userName={feed.userName}
              userId={feed.userId}
              avatarSrc={feed.profileImg}
              avatarAlt={`${feed.userName} 프로필`}
              content={feed.content}
              imageSrc={feed.image}
              imageAlt="게시글 이미지"
              dateTime={feed.createdAt}
              likeCount={feed.likeCount}
              commentCount={feed.commentCount}
              isLiked={feed.isLiked}
              isMyPost={isMyPost}
              onLikeClick={() => toggleLike(feed.id)}
              onCommentClick={() => navigate(`/post/${feed.id}`)}
              onReportClick={() => handlePostReport(feed.id)}
              ref={isLast ? lastCardRef : null}
            />
          );
        })}

      {isRefreshing && hasMore && (
        <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
          로딩중..
        </div>
      )}

      {!hasMore && (
        <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
          마지막 페이지입니다.
        </div>
      )}
    </>
  );
};

export default FeedPage;
