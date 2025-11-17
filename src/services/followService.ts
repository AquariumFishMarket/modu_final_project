import { FollowUser } from "../types/follow";
import { getAuthHeaders } from "../utils/tokenManager";

const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

// API 응답 타입

interface FollowApiResponse {
  _id: string;
  username: string;
  accountname: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: string[];
  follower: string[];
  followerCount: number;
  followingCount: number;
}

//  API 응답을 UI 타입으로 변환

function mapToFollowUser(apiUser: FollowApiResponse): FollowUser {
  return {
    userId: apiUser.accountname,
    userName: apiUser.username,
    userImage: apiUser.image || "/img/empty-profile.png",
    userIntro: apiUser.intro || "",
    isFollowing: apiUser.isfollow,
  };
}

//  팔로워 목록 조회

export async function fetchFollowers(
  accountname: string
): Promise<FollowUser[]> {
  try {
    const res = await fetch(`${BASE_URL}/profile/${accountname}/follower`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error("팔로워 목록 조회 실패");
    }

    const data: FollowApiResponse[] = await res.json();
    return Array.isArray(data) ? data.map(mapToFollowUser) : [];
  } catch (error) {
    throw error;
  }
}

//  팔로잉 목록 조회

export async function fetchFollowing(
  accountname: string
): Promise<FollowUser[]> {
  try {
    const res = await fetch(`${BASE_URL}/profile/${accountname}/following`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error("팔로잉 목록 조회 실패");
    }

    const data: FollowApiResponse[] = await res.json();
    return Array.isArray(data) ? data.map(mapToFollowUser) : [];
  } catch (error) {
    throw error;
  }
}

//  팔로우 / 언팔로우 토글

export async function toggleFollow(
  targetAccountname: string,
  isFollowing: boolean
): Promise<void> {
  try {
    const url = isFollowing
      ? `${BASE_URL}/profile/${targetAccountname}/unfollow`
      : `${BASE_URL}/profile/${targetAccountname}/follow`;

    const method = isFollowing ? "DELETE" : "POST";

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(
        data.message || `${isFollowing ? "언팔로우" : "팔로우"} 실패`
      );
    }
  } catch (error) {
    throw error;
  }
}
