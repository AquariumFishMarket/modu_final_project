import { getAuthHeaders } from "../utils/tokenManager";
import { Post, UserPostsResponse } from "../types/post";
import { UserProfile } from "../types/user";

const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

// 임시 기본 이미지
const DEFAULT_PROFILE_IMG = "/img/empty-profile.png";

export interface AuthResponse {
  message: string;
  user?: {
    accountname: string;
    email: string;
    image: string;
    intro: string;
    username: string;
    _id: string;
  };
}

export interface MyProfileResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    accountname: string;
    intro: string;
    image: string;
    isfollow: boolean;
    followers: [];
    followings: [];
  };
}

/**
 * 👤 통합 프로필 조회 함수
 * 내 프로필: accountname 미지정 또는 내 계정명과 동일
 * 타인 프로필: accountname 지정 & 내 계정명과 다름
 * 반환: UserProfile | null
 */
export const fetchProfile = async (
  accountname?: string,
  currentUserAccountname?: string
): Promise<UserProfile | null> => {
  try {
    let url = `${BASE_URL}/user/myinfo`;

    if (accountname && accountname !== currentUserAccountname) {
      url = `${BASE_URL}/profile/${accountname}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("프로필을 불러올 수 없습니다");

    const data = await response.json();

    // 내 프로필: data.user, 타인 프로필: data.profile
    return accountname && accountname !== currentUserAccountname
      ? data.profile
      : data.user;
  } catch (error) {
    return null;
  }
};

/**
 * 👤🆕 프로필 업데이트
 */
export const updateProfile = async (
  username: string,
  accountname: string,
  intro: string,
  image: string
): Promise<AuthResponse> => {
  const profileImage =
    image && image.trim() !== "" ? image : DEFAULT_PROFILE_IMG;

  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        user: {
          username: username,
          accountname: accountname,
          intro: intro || "",
          image: profileImage,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`프로필 업데이트에 실패했습니다: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * 📜 사용자 게시글 피드 가져오기
 */
export const fetchUserPosts = async (
  accountname: string
): Promise<Post[] | null> => {
  try {
    const limit = 1000; // ☑️ 무한 스크롤 되면 개수 20개로 줄이기

    const response = await fetch(
      `${BASE_URL}/post/${accountname}/userpost?limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) throw new Error("내 게시글 데이터 가져오기 실패");

    const data: UserPostsResponse = await response.json();

    // 최신순
    const posts = Array.isArray(data.post) ? data.post : [];
    return posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    return null;
  }
};

/**
 * 🔄 팔로우/언팔로우 처리
 * POST /profile/:accountname/follow - 팔로우
 * DELETE /profile/:accountname/unfollow - 언팔로우
 */
export async function toggleProfileFollow(
  accountname: string,
  isFollowing: boolean
): Promise<boolean> {
  try {
    const url = isFollowing
      ? `${BASE_URL}/profile/${accountname}/unfollow`
      : `${BASE_URL}/profile/${accountname}/follow`;

    const method = isFollowing ? "DELETE" : "POST";

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.message || `${isFollowing ? "언팔로우" : "팔로우"} 실패`
      );
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * 게시글 좋아요 토글
 */
export async function togglePostLike(postId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("좋아요 처리 실패");

    return true;
  } catch (error) {
    throw error;
  }
}
