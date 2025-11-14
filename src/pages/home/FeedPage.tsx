import { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Toast from "../../components/common/modal/Toast";

import { InitialLoadingSection } from "./FeedPage.styled";
import PostCard from "../../components/post/postCard/PostCard";
import { ToastContainer } from "react-toastify";

import { useFeedStore } from "../../contexts/useFeedStore";
import { useAuth } from "../../contexts/AuthContext";
import { reportPost } from "../../services/postService";

const FeedPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
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

  if (isLoading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <main>
          <InitialLoadingSection>
            <p>불러오는 중...</p>
          </InitialLoadingSection>
        </main>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <ToastContainer />
      <Toast />

      {feedList.map((feed, idx) => {
        const isLast = idx === feedList.length - 1;
        const isMyPost = currentUser?.accountname === feed.author.accountname;

        return (
          <PostCard
            key={`${feed.id}-${idx}`}
            postId={feed.id}
            userName={feed.author.username}
            userId={feed.author.accountname}
            avatarSrc={feed.profileImg}
            avatarAlt={`${feed.author.username} 프로필`}
            content={feed.content}
            imageSrc={feed.image}
            imageAlt="게시글 이미지"
            dateTime={feed.updatedAt}
            likeCount={feed.likeCount}
            commentCount={feed.comments.length}
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

      {!isRefreshing && (
        <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
          마지막 페이지입니다.
        </div>
      )}
    </motion.div>
  );
};

export default FeedPage;
