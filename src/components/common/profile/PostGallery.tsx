import { useEffect, useRef } from "react";
import {
  GalleryContainer,
  GalleryItem,
  GalleryImage,
  EmptyGalleryMessage,
} from "./PostGallery.styled";

interface Post {
  postId: string;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  dateTime: string;
  dateText: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

interface PostGalleryProps {
  posts: Post[];
  onPostClick?: (postId: string) => void;
}

function PostGallery({ posts, onPostClick }: PostGalleryProps) {
  const scrollPositionRef = useRef<number>(0);

  // 스크롤 위치 복원
  useEffect(() => {
    const savedScrollPosition = scrollPositionRef.current;
    if (savedScrollPosition > 0) {
      window.scrollTo(0, savedScrollPosition);
    }

    return () => {
      scrollPositionRef.current = window.scrollY;
    };
  }, []);

  const handlePostClick = (postId: string) => {
    if (onPostClick) {
      onPostClick(postId);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/img/fish_profile.png";
  };

  // 이미지가 있는 게시글만 필터링
  const postsWithImages = posts.filter((post) => post.imageSrc);

  if (postsWithImages.length === 0) {
    return (
      <GalleryContainer>
        <EmptyGalleryMessage>이미지가 있는 게시글이 없습니다.</EmptyGalleryMessage>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      {postsWithImages.map((post) => (
        <GalleryItem key={post.postId} onClick={() => handlePostClick(post.postId)}>
          <GalleryImage
            src={post.imageSrc}
            alt={post.imageAlt || post.content}
            onError={handleImageError}
          />
        </GalleryItem>
      ))}
    </GalleryContainer>
  );
}

export default PostGallery;
