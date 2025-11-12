import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DefaultButton from "../../components/common/buttons/Button";
import Toast from "../../components/common/modal/Toast";


import {
  EmptyFeedSection,
  LogoImage,
  FeedSection,
  FeedItemWrapper,
  LoadingText,
  EndMessageText,
  InitialLoadingSection,
  RefreshSpinnerWrapper,
  RefreshSpinner,
} from "./FeedPage.styled";
import PostCard from "../../components/post/postCard/PostCard";
import ScrollButton from "./components/ScrollButton";
import { ToastContainer } from "react-toastify";
import { useFeedData } from "../../hooks/useFeedData";

const FeedPage = () => {
  const navigate = useNavigate();

  const {
    feedList,
    isLoading,
    isInitialLoading,
    isRefreshing,
    hasMore,
    scrollContainerRef,
    loadMoreTriggerRef,
    handleLikeToggle,
    triggerRefresh,
  } = useFeedData();

  const startY = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);

  // 모바일: 터치로 새로고침
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      } else {
        startY.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const distance = e.touches[0].clientY - startY.current;
      if (distance > 80 && !isRefreshingRef.current) {
        isRefreshingRef.current = true;
        triggerRefresh().finally(() => {
          isRefreshingRef.current = false;
        });
      }
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [feedList.length, triggerRefresh]);

  // 데스크톱: 마우스 드래그로 새로고침
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let startY = 0;
    let isDragging = false;

    const handlePointerDown = (e: PointerEvent) => {
      if (container.scrollTop === 0) {
        startY = e.clientY;
        isDragging = true;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const distance = e.clientY - startY;
      if (distance > 80 && !isRefreshing) {
        isDragging = false;
        triggerRefresh();
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
    };
  }, [feedList.length, isRefreshing, triggerRefresh]);

  // 페이지 애니메이션
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  // 초기 로딩
  if (isInitialLoading) {
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

  // 피드 없음
  if (feedList.length === 0) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <main>
          <EmptyFeedSection>
            <LogoImage src="/img/fish-logo-GB.svg" alt="물고기마켓 로고" />
            <h2>유저를 검색해 팔로우 해보세요!</h2>
            <DefaultButton
              text="검색하기"
              width={120}
              onClick={() => navigate("/search")}
            />
          </EmptyFeedSection>
        </main>
      </motion.div>
    );
  }

  //  피드 있음
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}

  

      <ToastContainer></ToastContainer>
      <Toast></Toast>
      <FeedSection as="div"
        ref={scrollContainerRef}
        style={{
          overflowY: isRefreshing ? "hidden" : "auto",
          pointerEvents: isRefreshing ? "none" : "auto",
        }}
      >

        {/* 새로고침 스피너 */}
        <RefreshSpinnerWrapper $visible={isRefreshing}>
          <RefreshSpinner>
            <img src="/img/spinnerfish.png" alt="로딩 중..." />
          </RefreshSpinner>
        </RefreshSpinnerWrapper>


        {feedList.map((feed) => (
          <FeedItemWrapper key={feed.id}>
            <PostCard
              postId={feed.id}
              userName={feed.userName}
              userId={feed.userId}
              avatarSrc={feed.profileImg}
              avatarAlt={`${feed.userName} 프로필`}
              content={feed.content}
              imageSrc={feed.image}
              imageAlt="게시글 이미지"
              dateTime={feed.createdAt}
              dateText={feed.createdAt}
              likeCount={feed.likeCount}
              commentCount={feed.commentCount}
              isLiked={feed.isLiked}
              onLikeClick={() => handleLikeToggle(feed.id)}
              onCommentClick={() => navigate(`/post/${feed.id}`)}
            />
          </FeedItemWrapper>
        ))}

        {/* IntersectionObserver 트리거 */}
        <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />

        {isLoading && <LoadingText>불러오는 중...</LoadingText>}
        {!hasMore && (
          <EndMessageText>더이상 헤엄칠 곳이 없어요. ㅠ.ㅠ</EndMessageText>
        )}
      </FeedSection>

      <ScrollButton scrollContainerRef={scrollContainerRef} />
    </motion.div>
  );
};

export default FeedPage;
