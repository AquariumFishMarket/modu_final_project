import { getAuthHeaders } from "../utils/auth";
import type { Feed } from "../types/feed";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

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
};

/**
 * 특정 유저의 게시글 조회
 * @param userId 사용자 ID
 * @param page 페이지 번호 (1부터 시작)
 * @param limit 페이지당 아이템 수 (기본값: 5)
 * @returns Feed 배열
 */
export const fetchUserPosts = async (
  userId: string,
  page: number,
  limit: number = 5
): Promise<Feed[]> => {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/posts?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`유저 게시글 조회 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.posts.map((post: any) => ({
    id: post.id || post.postId,
    profileImg: post.profileImg || post.author?.profileImage,
    userName: post.userName || post.author?.userName,
    userId: post.userId || post.author?.userId,
    content: post.content,
    image: post.image || post.imageSrc,
    isLiked: post.isLiked,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
  })) as Feed[];
};

/**
 * 좋아요 토글
 * @param postId 게시글 ID
 */
export const toggleLike = async (postId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`좋아요 처리 실패: ${response.status}`);
  }
};
