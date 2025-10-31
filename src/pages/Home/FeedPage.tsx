import { useState, useEffect } from "react";
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

const FeedPage = () => {
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
    // 실제 API 연결

    return [];
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
      if (!hasMore) return;
      setIsLoading(true);
      try {
        const newFeed: Feed[] = await fetchFeed(page);

        if (newFeed.length === 0) {
          setHasMore(false); // 더 이상 불러올 피드가 없음
        } else {
          setFeedList((prev: Feed[]) => [...prev, ...newFeed]); // 기존 피드에 추가
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




  // 초기 로딩 중
  if (isInitialLoading) {
    return (
      <>
      
        <main>
          <InitialLoadingSection>
            {/* 애니메이션 넣기? 스피너? */}
            <p>불러오는 중...</p>
          </InitialLoadingSection>
        </main>
      </>
    );
  }

  // 피드 없을 때 (빈 피드)
  if (feedList.length === 0) {
    return (
      <>
      
        <main>
          <EmptyFeedSection>
            <LogoImage src="/img/fish-logo-GB.svg" alt="물고기마켓 로고" />
            <h2>유저를 검색해 팔로우 해보세요!</h2>
            <DefaultButton
              text="검색하기"
              width={120}
            />
          </EmptyFeedSection>
        </main>
      </>
    );
  }

  // 피드 있을 때 (메인 피드 목록)
  return (
    <>
    
        <FeedSection>
          {/* 피드 목록 렌더링 */}
          {feedList.map((feed) => (
            <FeedItemWrapper key={feed.id}>
              {/* FeedCard 컴포넌트 추가 */}
              {/* <FeedCard feed={feed} onLikeToggle={handleLikeToggle} /> */}
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
    </>
  );
}

export default FeedPage;
