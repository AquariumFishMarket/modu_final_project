import { getAuthHeaders } from "../utils/auth";
import type { UserProfile } from "../types/user";

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * 프로필 데이터 가져오기
 */
export async function fetchProfileData(
  accountname: string
): Promise<UserProfile | null> {
  try {
    if (!accountname || accountname.trim() === "") {
      throw new Error("유효하지 않은 사용자 ID입니다");
    }

    const response = await fetch(`${API_BASE_URL}/profile/${accountname}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("프로필을 불러올 수 없습니다");

    const data = await response.json();
    return data.profile as UserProfile;
  } catch (error) {
    console.error("프로필 데이터 가져오기 실패:", error);
    return null;
  }
}

/**
 * 사용자 게시글 피드 가져오기
 */
export async function fetchUserPosts(userId: string): Promise<Post[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("게시글 데이터 가져오기 실패");

    const data = await response.json();
    return data.posts as Post[];
  } catch (error) {
    console.error("게시글 데이터 가져오기 실패:", error);
    return null;
  }
}

/**
 * 팔로우/언팔로우 처리
 */
export async function toggleProfileFollow(
  userId: string,
  isFollowing: boolean
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
      method: isFollowing ? "DELETE" : "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("팔로우 처리 실패");

    return true;
  } catch (error) {
    console.error("팔로우 처리 실패:", error);
    throw error;
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
