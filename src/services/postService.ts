// import { getAuthHeaders } from "../utils/auth";
import { getToken } from "../utils/tokenManager";

// API Base URL
const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

// 작성자 타입
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

// 댓글 응답 타입
interface CommentResponse {
  id: string;
  content: string;
  createdAt: string;
  author?: Author;
}

// 게시글 응답 타입
interface PostApiResponse {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  author?: Author;
  heartCount: number;
  commentCount: number;
  hearted: boolean;
}

// 게시글 상세 응답 타입
interface PostDetailApiResponse {
  post: PostApiResponse;
}

// 댓글 목록 응답 타입
interface CommentsApiResponse {
  comment: CommentResponse[];
}

// 댓글 작성 응답 타입
interface CreateCommentApiResponse {
  comment: CommentResponse;
}

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


//  게시글 상세 조회
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

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 게시글 ID입니다.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("게시글 조회 실패");
    }


    const data = await response.json();

    return data.post as PostDetail;

  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);
    return null;
  }
}


//  게시글 수정

export async function EditPost(
  postId: string,
  content: string,
  image?: string
): Promise<PostDetail | null> {
  try {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/post/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        post: {
          content: content,
          image: image || "",
        },
      }),

    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("유효하지 않은 게시글 ID입니다.");
      }
      if (response.status === 403) {
        throw new Error("잘못된 요청입니다. 로그인 정보를 확인하세요");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
    }


    const data = await response.json();

    console.log("수정된 게시글: ", data.post);

    return data.post as PostDetail;

  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
}

//  게시글 삭제

export async function deletePost(postId: string): Promise<boolean> {
  try {
    const token = getToken();

    console.log("deletePost API 요청:", postId);

    const response = await fetch(`${BASE_URL}/post/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 게시글 ID입니다.");
      }
      if (response.status === 403) {
        throw new Error("삭제 권한이 없습니다. 로그인 정보를 확인하세요.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("게시글 삭제 실패");
    }

    console.log("deletePost API 응답:", response.status);

    return true;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
}

//  게시글 좋아요

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

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 게시글 ID입니다.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("좋아요 처리 실패");
    }

    const data = await response.json();

    return data.post as PostDetail;
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    throw error;
  }
}

// 게시글 좋아요 취소

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

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 게시글 ID입니다.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("좋아요 취소 실패");
    }

    const data = await response.json();

    return data.post as PostDetail;
  } catch (error) {
    console.error("좋아요 취소 실패:", error);
    throw error;
  }
}

//  게시글 좋아요 토글

// export async function togglePostLike(
//   postId: string,
//   isCurrentlyLiked: boolean
// ): Promise<PostDetail | null> {
//   return isCurrentlyLiked ? unlikePost(postId) : likePost(postId);
// }

//  댓글 작성


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

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 게시글 ID입니다.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("댓글 작성 실패");
    }


    const data = await response.json();

    return data.comment as Comment;

  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return null;
  }
}

//  댓글 리스트 조회

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

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 게시글 ID입니다.");
      }
      throw new Error("댓글 조회 실패");
    }

    const data = await response.json();

    return (data.comment || []) as Comment[];
  } catch (error) {
    console.error("댓글 목록 조회 실패:", error);
    return [];
  }
}

//  댓글 수정


// 댓글 삭제

export async function deleteComment(
  postId: string,
  commentId: string
): Promise<boolean> {
  try {
    const token = getToken();

    console.log("deleteComment API 요청:", postId);

    const response = await fetch(
      `${BASE_URL}/post/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("유효하지 않은 게시글 ID입니다.");
      }
      if (response.status === 403) {
        throw new Error("삭제 권한이 없습니다. 로그인 정보를 확인하세요.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("게시글 삭제 실패");
    }

    console.log("deleteComment API 응답:", response.status);

    return true;
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    throw error;
  }
}
