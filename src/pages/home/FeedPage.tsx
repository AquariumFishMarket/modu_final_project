import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Toast from "../../components/common/modal/Toast";

import { InitialLoadingSection } from "./FeedPage.styled";
import PostCard from "../../components/post/postCard/PostCard";
import { ToastContainer } from "react-toastify";
import { useFeedData } from "../../hooks/useFeedData";
//zustand 전역
import { useFeedStore } from "../../contexts/useFeedStore";

const FeedPage = () => {
  const navigate = useNavigate();
  const { handleLikeToggle } = useFeedData();
  const observer = useRef<IntersectionObserver | null>(null);

  // 페이지 애니메이션
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const feedList = useFeedStore((state) => state.feedList)
  const isLoading = useFeedStore((state) => state.isInitialLoading);
  const fetchFeeds = useFeedStore((state) => state.fetchFeeds);
  const hasMore = useFeedStore((state) => state.hasMore);
 const isRefreshing = useFeedStore((state) => state.isRefreshing);

  useEffect(()=>{
    fetchFeeds();
  },[])


  const lastCardRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    if (observer.current) observer.current.disconnect(); // 이전 observer 정리

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          //console.log("마지막 카드 감지");
          fetchFeeds(true);
        }
      },
      { threshold: 1 }
    );

    observer.current.observe(node);
  }, [hasMore,isRefreshing]);

  // 초기 로딩
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

  // 피드 없음
  // if (feedList.length === 0) {
  //   return (
  //     <motion.div
  //       initial="initial"
  //       animate="animate"
  //       exit="exit"
  //       variants={pageVariants}
  //     >
  //       <main>
  //         <EmptyFeedSection>
  //           <LogoImage src="/img/fish-logo-GB.svg" alt="물고기마켓 로고" />
  //           <h2>유저를 검색해 팔로우 해보세요!</h2>
  //           <DefaultButton
  //             text="검색하기"
  //             width={120}
  //             onClick={() => navigate("/search")}
  //           />
  //         </EmptyFeedSection>
  //       </main>
  //     </motion.div>
  //   );
  // }

  //  피드 있음
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <ToastContainer></ToastContainer>
      <Toast></Toast>

      {feedList.map((feed,idx) => {
        const isLast = idx === feedList.length - 1;

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
          dateTime={feed.updatedAt} //api 명세 없는부분
          dateText={feed.updatedAt} //api 명세 없는부분
          likeCount={feed.author.hearts.length}
          commentCount={feed.comments.length}
          isLiked={feed.isLiked}
          onLikeClick={() => handleLikeToggle(feed.id)}
          onCommentClick={() => navigate(`/post/${feed.id}`)}
          ref={isLast? lastCardRef : null}
        />
        )
      })}

    </motion.div>
  );
};

export default FeedPage;
