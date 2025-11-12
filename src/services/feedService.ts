import { getAuthHeaders } from "../utils/auth";
import { dummyPosts } from "../data/dummyPosts";
import type { Feed } from "../types/feed";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// API 연동 모드 설정 (true: 실제 API 사용, false: 더미 데이터 사용)
const USE_API = false;

/**
 * 피드 데이터 조회
 * @param page 페이지 번호 (1부터 시작)
 * @param limit 페이지당 아이템 수 (기본값: 5)
 * @returns Feed 배열
 */
export const fetchFeed = async (
  page: number,
  limit: number = 5
): Promise<Feed[]> => {
  if (USE_API) {
    const response = await fetch(
      `${API_BASE_URL}/feed?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`피드 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.feeds.map((feed: any) => ({
      id: feed.id || feed.postId,
      profileImg: feed.profileImg || feed.author?.profileImage,
      userName: feed.userName || feed.author?.userName,
      userId: feed.userId || feed.author?.userId,
      content: feed.content,
      image: feed.image || feed.imageSrc,
      isLiked: feed.isLiked,
      likeCount: feed.likeCount,
      commentCount: feed.commentCount,
      createdAt: feed.createdAt,
    })) as Feed[];
  } else {
    // 더미 데이터 반환
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const convertedPosts = dummyPosts.slice(startIndex, endIndex).map(
      (post) =>
        ({
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
        }) as Feed
    );

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));
    return convertedPosts;
  }
};

/**
 * 좋아요 토글
 * @param postId 게시글 ID
 */
export const toggleLike = async (postId: string): Promise<void> => {
  if (USE_API) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`좋아요 처리 실패: ${response.status}`);
    }
  }
  // 더미 모드에서는 실제 API 호출 없음 (낙관적 업데이트만 수행)
};
