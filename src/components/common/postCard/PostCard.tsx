import { useState } from "react";
import {
  PostCardContainer,
  PostContent,
  PostMain,
  PostFooter,
  PostActions,
  ActionButton,
  PostTime,
} from "./PostCard.styled";
import PostHeader from "../PostHeader";

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
  dateText: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  onLikeClick?: () => void;
  onCommentClick?: () => void;

  // API 연동 준비 (추후 사용)
  // post: Post;
  // onLikeToggle?: (postId: string, isLiked: boolean) => void;
  // onPostClick?: (postId: string) => void;
}

function PostCard({
  postId,
  userName,
  userId,
  avatarSrc,
  avatarAlt,
  content,
  imageSrc,
  imageAlt,
  dateTime,
  dateText,
  likeCount,
  commentCount,
  isLiked,
  onLikeClick,
  onCommentClick,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [postImageSrc, setPostImageSrc] = useState(imageSrc);

  // 낙관적 업데이트
  const handleLikeClick = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(newLikedState ? likes + 1 : likes - 1);

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

  const handlePostImageError = () => {
    setPostImageSrc("/img/cook.png");
  };

  return (
    <PostCardContainer>
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
        <PostMain>
          {content && <figcaption>{content}</figcaption>}
          {postImageSrc && (
            <img
              src={postImageSrc}
              alt={imageAlt || "게시글 이미지"}
              onError={handlePostImageError}
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
              className={liked ? "liked" : ""}
            >
              <img
                src={
                  liked ? "/img/icon-like-full.svg" : "/img/icon-like-empty.svg"
                }
                alt=""
              />
              <span>{likes}</span>
            </ActionButton>
            <ActionButton aria-label="댓글" onClick={handleCommentClick}>
              <img src="/img/message-circle.svg" alt="" />
              <span>{commentCount}</span>
            </ActionButton>
          </PostActions>
          <PostTime dateTime={dateTime}>{dateText}</PostTime>
        </PostFooter>

        {/* API 연동 준비 (추후 사용) */}
        {/* 당일 게시글 xx분전, 올해의 게시글은 MM/DD, 작년이전이면 YY/MM/DD 이런식으로 인스타처럼 만들면 좋을것 같습니다. */}
        {/* <PostTime dateTime={post.createdAt}>{formatDate(post.createdAt)}</PostTime> */}
      </PostContent>
    </PostCardContainer>
  );
}

export default PostCard;
