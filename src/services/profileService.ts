import { getAuthHeaders } from "../utils/tokenManager";
import { Post, UserPostsResponse } from "../types/post";
import { UserProfile } from "../types/user";

const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

// 기본 이미지
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
 * 통합 프로필 조회
 * @param accountname 계정ID
 * @param currentUserAccountname 현재 사용자의 계정 ID
 * @retun  UserProfile(data.user, data.profile)
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
    console.error(error);
    return null;
  }
};

/**
 * 프로필 업데이트
 * @param user(username, accountname, intro, image)
 * @return user
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
      throw new Error(`프로필 업데이트에 실패했습니다: ${errorText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw null;
  }
};

/**
 * 사용자 게시글 피드
 * @param accountname 계정ID
 * @return post
 */
export const fetchUserPosts = async (
  accountname: string
): Promise<Post[] | null> => {
  try {
    const limit = 20; // maximum: 1000

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
    console.error(error);
    return null;
  }
};

/**
 * 팔로우/언팔로우
 * @param accountname 계정ID
 * @param isFollowing 팔로잉 여부
 * @return boolean
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
    console.error(error);
    return false;
  }
}

/**
 * 게시글 좋아요
 * @param postId 게시글 고유번호
 * @return boolean
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
    console.error(error);
    return false;
  }
}
