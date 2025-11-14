import { FollowUser } from "../types/follow";
import { getAuthHeaders } from "../utils/auth";

// API Base URL (환경변수로 관리)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// 팔로워 목록 조회

export async function fetchFollowers(userId: string): Promise<FollowUser[]> {
  const res = await fetch(`${API_BASE_URL}/user/${userId}/followers`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("팔로워 목록 조회 실패");
  }

  const data = await res.json();
  return data.followers as FollowUser[];
}

// 팔로잉 목록 조회

export async function fetchFollowing(userId: string): Promise<FollowUser[]> {
  const res = await fetch(`${API_BASE_URL}/user/${userId}/following`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("팔로잉 목록 조회 실패");
  }

  const data = await res.json();
  return data.following as FollowUser[];
}

//  팔로우 / 언팔로우 토글

export async function toggleFollow(
  targetUserId: string,
  isFollowing: boolean
): Promise<void> {
  const endpoint = isFollowing ? "unfollow" : "follow";
  const method = isFollowing ? "DELETE" : "POST";

  const res = await fetch(`${API_BASE_URL}/user/${targetUserId}/${endpoint}`, {
    method,
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`${isFollowing ? "언팔로우" : "팔로우"} 실패`);
  }
}
