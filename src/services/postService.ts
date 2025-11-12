// import { getAuthHeaders } from "../utils/auth";
import { getToken } from "../utils/tokenManager";

// API Base URL
const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

export interface Author {
  _id: string;
  username: string;
  accountname: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: [];
  follower: [];
  followerCount: number;
  followingCount: number;
}

export interface PostDetail {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  hearted: boolean;
  heartCount: number;
  comments: [];
  commentCount: number;
  author: Author;
}

export interface CommentAuthor {
  _id: string;
  username: string;
  accountname: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: [];
  follower: [];
  followerCount: number;
  followingCount: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
}

/**
 * 게시글 상세 조회
 */
export async function fetchPostDetail(
  postId: string
): Promise<PostDetail | null> {
  try {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/post/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (!response.ok) throw new Error("게시글 조회 실패");

    const data = await response.json();

    console.log("게시글 상세 조회: ", data.post); // ☑️

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
    const token = getToken();

    const response = await fetch(`${BASE_URL}/post/${postId}/comments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (!response.ok) throw new Error("댓글 조회 실패");

    const data = await response.json();

    console.log("댓글 목록 조회: ", data.comment); // ☑️

    return (data.comment || []) as Comment[];
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
    const token = getToken();

    const response = await fetch(`${BASE_URL}/post/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        comment: {
          content: content,
        },
      }),
    });

    if (!response.ok) throw new Error("댓글 작성 실패");

    const data = await response.json();

    console.log("댓글 작성: ", data.comment); // ☑️

    return data.comment as Comment;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return null;
  }
}

/**
 * 게시글 좋아요
 */
export async function likePost(postId: string): Promise<PostDetail | null> {
  try {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/post/${postId}/heart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (!response.ok) throw new Error("좋아요 처리 실패");

    const data = await response.json();
    return data.post as PostDetail;
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    throw error;
  }
}

/**
 * 게시글 좋아요 취소
 */
export async function unlikePost(postId: string): Promise<PostDetail | null> {
  try {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/post/${postId}/unheart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (!response.ok) throw new Error("좋아요 취소 실패");

    const data = await response.json();
    return data.post as PostDetail;
  } catch (error) {
    console.error("좋아요 취소 실패:", error);
    throw error;
  }
}

/**
 * 게시글 좋아요 토글
 */
export async function togglePostLike(
  postId: string,
  isCurrentlyLiked: boolean
): Promise<PostDetail | null> {
  return isCurrentlyLiked ? unlikePost(postId) : likePost(postId);
}
