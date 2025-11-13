import { useState, forwardRef } from "react";
import {
  PostCardContainer,
  PostContent,
  PostMain,
  PostFooter,
  PostActions,
  ActionButton,
  PostTime,
  HeartLabel,
} from "./PostCard.styled";
import PostHeader from "../PostHeader";
import { formatPostDate } from "../../../utils/formatter/dateFormatter";
import { useNavigate } from "react-router-dom";

// API 연동 준비 (추후 사용)
// import { Post } from "../../../types/post";
// import { addHeart, removeHeart } from "../../../api/postApi";

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
  onLikeClick?: () => void;
  onCommentClick?: () => void;
  onMoreClick?: () => void;

  // API 연동 준비 (추후 사용)
  // post: Post;
  // onLikeToggle?: (postId: string, isLiked: boolean) => void;
  // onPostClick?: (postId: string) => void;
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
  onLikeClick,
  onCommentClick,
}, ref
) => {
  const navigate = useNavigate();

  if (imageSrc) {
  }

  const cutImageSrc = imageSrc?.split("/") as string[];
  const [postImageSrc, setPostImageSrc] = useState<string | undefined>(
    cutImageSrc[1]
  );

  // 게시글 상세보기
  const handleCardClick = () => {
    navigate(`/post/${postId}`);
  };

  // 부모 컴포넌트에서 관리하는 상태 사용 -> 좋아요 버튼
  const handleLikeClick = () => {
    if (onLikeClick) {
      onLikeClick();
    }

    // API 연동 준비 (추후 사용)
    // const previousLiked = liked;
    // const previousLikes = likes;
    // try {
    //   if (newLikedState) {
    //     await addHeart(post.id);
    //   } else {
    //     await removeHeart(post.id);
    //   }
    //   if (onLikeToggle) {
    //     onLikeToggle(post.id, newLikedState);
    //   }
    // } catch (error) {
    //   console.error("좋아요 처리 실패:", error);
    //   setLiked(previousLiked);
    //   setLikes(previousLikes);
    // }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick();
    }

    // API 연동 준비 (추후 사용)
    // if (onCommentClick) {
    //   onCommentClick(post.id);
    // }
  };

  // const handlePostImageError = () => {
  //   setPostImageSrc("/img/cook.png");
  // };

  return (
    <PostCardContainer key={postId} ref={ref}>
      {/* 게시자 정보 */}
      <PostHeader
        userName={userName}
        userId={userId}
        avatarSrc={avatarSrc}
        avatarAlt={avatarAlt}
        postId={postId}
      />

      {/* API 연동 준비 (추후 사용) */}
      {/* <PostHeader author={post.author} postId={post.id} /> */}

      {/* 게시글 내용 */}
      <PostContent>
        <PostMain onClick={handleCardClick}>
          {content && <figcaption>{content}</figcaption>}
          {postImageSrc && (
            <img
              src={`https://dev.wenivops.co.kr/services/mandarin/${postImageSrc}`}
              alt={imageAlt || "게시글 이미지"}
            />
          )}
        </PostMain>

        {/* API 연동 준비 (추후 사용) */}
        {/* <PostMain onClick={handlePostClick} style={{ cursor: onPostClick ? "pointer" : "default" }}>
          {post.content && <figcaption>{post.content}</figcaption>}
          {post.image && (
            <img
              src={post.image}
              alt="게시글 이미지"
              style={{ width: "304px", height: "228px" }}
            />
          )}
        </PostMain> */}

        {/* 좋아요 / 댓글 / 날짜 */}
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

          {/* 전체 게시글에는 날짜가 없어서 일단 추가 */}
          {dateTime && (
            <PostTime dateTime={dateTime}>{formatPostDate(dateTime)}</PostTime>
          )}
        </PostFooter>
      </PostContent>
    </PostCardContainer>
  );
})

export default PostCard;
