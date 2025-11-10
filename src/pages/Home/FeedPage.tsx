import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DefaultButton from "../../components/common/Button";
import {
  EmptyFeedSection,
  LogoImage,
  FeedSection,
  FeedItemWrapper,
  LoadingText,
  EndMessageText,
  InitialLoadingSection,
} from "./FeedPage.styled";
import { dummyPosts } from "../../data/dummyPosts";
import PostCard from "../../components/common/postCard/PostCard";
import ScrollButton from "../../components/common/Buttons/ScrollButton";

const FeedPage = () => {
  const navigate = useNavigate();
  type Feed = {
    id: string; // 게시글 고유 ID
    profileImg: string; // 프로필 이미지 URL
    userName: string; // 사용자 이름
    userId: string; // 사용자 ID (예: @hanlabong22)
    content: string; // 게시글 본문 텍스트
    image?: string; // 게시글 이미지 (선택적)
    isLiked: boolean; // 좋아요 여부
    likeCount: number; // 좋아요 개수
    commentCount: number; // 댓글 개수
    createdAt: string; // 게시글 작성일
  };

  /** 피드 게시글 목록 */
  const [feedList, setFeedList] = useState<Feed[]>([]);

  /** 현재 페이지 번호 (무한스크롤) */
  const [page, setPage] = useState<number>(1);

  /** 추가로 불러올 피드가 있는지 확인 */
  const [hasMore, setHasMore] = useState<boolean>(true);

  /** 추가 피드 로딩 중 확인 (무한스크롤) */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** 초기 로딩 중 확인 (첫 페이지 로드) */
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // API 연결 부분

  const fetchFeed = async (pageNum: number): Promise<Feed[]> => {
    // 더미 데이터 사용 (임시)
    // 실제 API 연결 시 아래 코드로 교체

    // 페이지당 5개씩 반환
    const itemsPerPage = 5;
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 더미 데이터를 Feed 타입으로 변환
    const convertedPosts = dummyPosts
      .slice(startIndex, endIndex)
      .map((post) => ({
        id: post.postId,
        profileImg: post.avatarSrc,
        userName: post.userName,
        userId: post.userId,
        content: post.content,
        image: post.imageSrc,
        isLiked: post.isLiked,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.dateText,
      }));

    // 로딩 시뮬레이션 (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    return convertedPosts;
  };

  const handleLikeToggle = (feedId: string): void => {
    // 낙관적 업데이트: UI를 먼저 변경
    // Ai가 추천해준 코드
    // 서버응답을 기다리지않고 UI를 먼저 바꿈
    // 사용자경험 상승 효과
    // 스켈레톤이랑은 다름
    setFeedList((prev: Feed[]) =>
      prev.map((feed: Feed) =>
        feed.id === feedId
          ? {
              ...feed,
              isLiked: !feed.isLiked,
              likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
            }
          : feed
      )
    );

    // 실제 API 호출
  };

  // 피드 로딩
  useEffect(() => {
    const loadFeed = async (): Promise<void> => {
      if (!hasMore || isLoading) return;
      setIsLoading(true);
      try {
        const newFeed: Feed[] = await fetchFeed(page);

        if (newFeed.length === 0) {
          setHasMore(false); // 더 이상 불러올 피드가 없음
        } else {
          setFeedList((prev: Feed[]) => {
            // 중복 제거: 이미 존재하는 ID는 추가하지 않음
            const existingIds = new Set(prev.map((feed) => feed.id));
            const uniqueNewFeed = newFeed.filter(
              (feed) => !existingIds.has(feed.id)
            );
            return [...prev, ...uniqueNewFeed];
          });
        }
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    };

    loadFeed();
  }, [page]);

  // 무한스크롤 부분
  // useInfiniteScroll 훅 추가 예정

  // 스크롤 버튼
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 페이지 전환 애니메이션
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // 초기 로딩 중
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
            {/* 애니메이션 넣기? 스피너? */}
            <p>불러오는 중...</p>
          </InitialLoadingSection>
        </main>
      </motion.div>
    );
  }

  // 피드 없을 때 (빈 피드)
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

  // 피드 있을 때 (메인 피드 목록)
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <FeedSection ref={scrollContainerRef}>
        {/* 피드 목록 렌더링 */}
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

        {/* 추가 피드 로딩 중 */}
        {isLoading && (
          <LoadingText>
            {/* 애니메이션 넣기? 스피너? */}
            불러오는 중...
          </LoadingText>
        )}

        {/* 더 이상 피드가 없을 때 */}
        {!hasMore && (
          <EndMessageText>
            {/* 텍스트로 할지 아니면 피드카드가 없다는 . 이런거? 넣을지 */}
            더이상 피드가 존재하지 않습니다.
          </EndMessageText>
        )}
      </FeedSection>

      <ScrollButton scrollContainerRef={scrollContainerRef} />
    </motion.div>
  );
};

export default FeedPage;
