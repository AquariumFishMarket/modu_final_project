import { getAuthHeaders } from "../utils/auth";

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface Comment {
  commentId: string;
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  content: string;
  dateTime: string;
  dateText: string;
}

export interface PostDetail {
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
}

/**
 * 게시글 상세 조회
 */
export async function fetchPostDetail(postId: string): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("게시글 조회 실패");

    const data = await response.json();
    return data.post as PostDetail;
  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);
    return null;
  }
}

/**
 * 게시글 댓글 목록 조회
 */
export async function fetchPostComments(postId: string): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("댓글 조회 실패");

    const data = await response.json();
    return data.comments as Comment[];
  } catch (error) {
    console.error("댓글 목록 조회 실패:", error);
    return [];
  }
}

/**
 * 댓글 작성
 */
export async function createComment(
  postId: string,
  content: string
): Promise<Comment | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error("댓글 작성 실패");

    const data = await response.json();
    return data.comment as Comment;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return null;
  }
}

/**
 * 게시글 좋아요 토글
 */
export async function togglePostLike(postId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("좋아요 처리 실패");

    return true;
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    throw error;
  }
}
