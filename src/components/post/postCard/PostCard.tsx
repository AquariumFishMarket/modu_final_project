import { forwardRef, useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  PostCardContainer,
  PostContent,
  PostMain,
  PostFooter,
  PostActions,
  ActionButton,
  PostTime,
  HeartLabel,
  ImageCarousel,
  ImageCarouselViewport,
  ImageCarouselContainer,
  ImageCarouselSlide,
  CarouselDots,
  CarouselDot,
  CarouselButton,
} from "./PostCard.styled";
import PostHeader from "../PostHeader";
import { formatPostDate } from "../../../utils/formatter/dateFormatter";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  postId: string;
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  dateTime: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isMyPost?: boolean;
  onLikeClick?: () => void;
  onCommentClick?: () => void;
  onMoreClick?: () => void;
  onReportClick?: () => void;
}

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(

({
  postId,
  userName,
  userId,
  avatarSrc,
  avatarAlt,
  content,
  imageSrc,
  imageAlt,
  dateTime,
  likeCount,
  commentCount,
  isLiked,
  isMyPost,
  onLikeClick,
  onCommentClick,
  onReportClick
}, ref
) => {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  console.log('🪴PostCard : ' + avatarSrc)
  // 이미지 URL 배열 처리
  const getImageUrls = (imageSrc?: string): string[] => {
    if (!imageSrc) return [];

    // 쉼표로 구분된 이미지들을 배열로 변환
    const imageStrings = imageSrc.split(",").map((img) => img.trim()).filter(Boolean);

    return imageStrings.map((imageString) => {
      // 이미 전체 URL인 경우 그대로 반환
      if (imageString.startsWith("http")) {
        return imageString;
      }

      // API 명세에 따라: uploadFiles/filename.ext → filename.ext 추출 후 URL 조합
      const filename = imageString.includes("/")
        ? imageString.split("/")[1]
        : imageString;
      return `https://dev.wenivops.co.kr/services/mandarin/${filename}`;
    });
  };

  const imageUrls = getImageUrls(imageSrc);

  // Embla Carousel 슬라이드 선택 콜백
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Embla API가 준비되면 이벤트 리스너 등록
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // 슬라이드 이동 핸들러
  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollNext();
  }, [emblaApi]);

  // 게시글 상세보기
  const handleCardClick = () => {
    navigate(`/post/${postId}`);
  };

  const handleLikeClick = () => {
    if (onLikeClick) {
      onLikeClick();
    }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick();
    }
  };

  return (
    <PostCardContainer key={postId} ref={ref}>
      <PostHeader
        userName={userName}
        userId={userId}
        avatarSrc={avatarSrc}
        avatarAlt={avatarAlt}
        postId={postId}
        authorAccountname={userId}
        isMyPost={isMyPost}
        onReport={onReportClick}
      />

      <PostContent>
        <PostMain onClick={handleCardClick}>
          {content && <figcaption>{content}</figcaption>}

          {imageUrls.length > 1 && (
            <ImageCarousel>
              <ImageCarouselViewport ref={emblaRef}>
                <ImageCarouselContainer>
                  {imageUrls.map((url, index) => (
                    <ImageCarouselSlide key={index}>
                      <img
                        src={url}
                        alt={`${imageAlt || "게시글 이미지"} ${index + 1}`}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </ImageCarouselSlide>
                  ))}
                </ImageCarouselContainer>
              </ImageCarouselViewport>

              {canScrollPrev && (
                <CarouselButton
                  className="prev"
                  onClick={scrollPrev}
                  aria-label="이전 이미지"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </CarouselButton>
              )}

              {canScrollNext && (
                <CarouselButton
                  className="next"
                  onClick={scrollNext}
                  aria-label="다음 이미지"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </CarouselButton>
              )}

              <CarouselDots>
                {imageUrls.map((_, index) => (
                  <CarouselDot
                    key={index}
                    $isActive={index === selectedIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      emblaApi?.scrollTo(index);
                    }}
                    aria-label={`${index + 1}번째 이미지로 이동`}
                  />
                ))}
              </CarouselDots>
            </ImageCarousel>
          )}

          {imageUrls.length === 1 && (
            <img
              src={imageUrls[0]}
              alt={imageAlt || "게시글 이미지"}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </PostMain>
        <PostFooter>
          <PostActions>
            <ActionButton
              aria-label="좋아요"
              onClick={handleLikeClick}
              className={isLiked ? "liked" : ""}
            >
              <HeartLabel $liked={isLiked} aria-label="좋아요">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </HeartLabel>
              <span style={{ position: "relative", top: "-1px" }}>
                {likeCount}
              </span>
            </ActionButton>
            <ActionButton aria-label="댓글" onClick={handleCommentClick}>
              <img src="/img/icon-message.svg" alt="" />
              <span style={{ position: "relative", top: "-1px" }}>
                {commentCount}
              </span>
            </ActionButton>
          </PostActions>

          {dateTime && (
            <PostTime dateTime={dateTime}>{formatPostDate(dateTime)}</PostTime>
          )}
        </PostFooter>
      </PostContent>
    </PostCardContainer>
  );
})

export default PostCard;
