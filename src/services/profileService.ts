import { getAuthHeaders } from "../utils/auth";

export interface Post {
  id: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt?: string;
  hearted: boolean;
  heartCount: number;
  commentCount: number;
  author: {
    accountname: string;
    username: string;
    image: string;
  };
  // 필요에 따라 추가 필드
}

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

// 내 프로필 정보 조회
export const getMyProfile = async (
  token: string
): Promise<MyProfileResponse> => {
  const response = await fetch(`${BASE_URL}/user/myinfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("프로필 정보를 불러올 수 없습니다.");
  }

  const data = await response.json();
  console.log("📥 내 프로필 조회:", data);
  return data;
};

// 프로필 업데이트
export const updateProfile = async (
  username: string,
  accountname: string,
  intro: string,
  image: string,
  token: string
): Promise<AuthResponse> => {
  console.log("📤 프로필 업데이트 요청:", {
    username,
    accountname,
    intro,
    image,
  });

  const profileImage =
    image && image.trim() !== "" ? image : DEFAULT_PROFILE_IMG;

  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          username: username,
          accountname: accountname,
          intro: intro || "",
          image: profileImage,
        },
      }),
    });

    console.log("📡 프로필 업데이트 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 프로필 업데이트 실패:", errorText);
      throw new Error(`프로필 업데이트에 실패했습니다: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ 프로필 업데이트 성공:", data);

    return data;
  } catch (error) {
    console.error("❌ 프로필 업데이트 에러:", error);
    throw error;
  }
};

/**
 * 사용자 게시글 피드 가져오기
 */
export async function fetchUserPosts(userId: string): Promise<Post[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/posts`, {
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
    const response = await fetch(`${BASE_URL}/users/${userId}/follow`, {
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
    const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
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
