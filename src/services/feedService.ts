import { getAuthHeaders } from "../utils/auth";
import type { Feed } from "../types/feed";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// API 응답 타입
interface PostAuthor {
  _id: string;
  username: string;
  accountname: string;
  image: string;
}

interface PostResponse {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  author?: PostAuthor;
  hearted: boolean;
  heartCount: number;
  commentCount: number;
}

interface FeedApiResponse {
  posts: PostResponse[];
}

interface UserPostApiResponse {
  post: PostResponse[];
}

// 피드 데이터 조회 (팔로잉한 사용자의 게시글)

export const fetchFeed = async (
  page: number,
  limit: number = 5
): Promise<Feed[]> => {
  // skip 계산: 페이지는 1부터 시작하므로 (page - 1) * limit
  const skip = (page - 1) * limit;

  const response = await fetch(
    `${API_BASE_URL}/post/feed?limit=${limit}&skip=${skip}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`피드 조회 실패: ${response.status}`);
  }

  const data: FeedApiResponse = await response.json();

  return data.posts.map((post: PostResponse) => ({
    id: post.id,
    profileImg: post.author?.image,
    userName: post.author?.username,
    userId: post.author?.accountname,
    content: post.content,
    image: post.image,
    isLiked: post.hearted,
    likeCount: post.heartCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
  })) as Feed[];
};

// 특정 유저의 게시글 조회

export const fetchUserPosts = async (
  accountname: string,
  page: number,
  limit: number = 5
): Promise<Feed[]> => {
  const skip = (page - 1) * limit;

  const response = await fetch(
    `${API_BASE_URL}/post/${accountname}/userpost?limit=${limit}&skip=${skip}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`유저 게시글 조회 실패: ${response.status}`);
  }

  const data: UserPostApiResponse = await response.json();
  return data.post.map((post: PostResponse) => ({
    id: post.id,
    profileImg: post.author?.image,
    userName: post.author?.username,
    userId: post.author?.accountname,
    content: post.content,
    image: post.image,
    isLiked: post.hearted,
    likeCount: post.heartCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
  })) as Feed[];
};

// 좋아요 토글

export const toggleLike = async (
  postId: string,
  isLiked: boolean
): Promise<void> => {
  const endpoint = isLiked ? "unheart" : "heart";
  const method = isLiked ? "DELETE" : "POST";

  const response = await fetch(`${API_BASE_URL}/post/${postId}/${endpoint}`, {
    method: method,
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`좋아요 처리 실패: ${response.status}`);
  }
};
