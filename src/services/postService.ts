import { getAuthHeaders } from "../utils/tokenManager";

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
}

// 댓글 타입
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  hearted: boolean;
  heartCount: number;
}

// 게시글 상세 타입
export interface PostDetail {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  hearted: boolean;
  heartCount: number;
  comments: Comment[];
  commentCount: number;
  author: Author;
}

// API 응답 래퍼 타입
interface PostDetailApiResponse {
  post: PostDetail;
}

interface CommentsApiResponse {
  comment?: Comment[];
  comments?: Comment[];
}

interface CommentApiResponse {
  comment: Comment;
}

//  게시글 상세 조회

export async function fetchPostDetail(
  postId: string
): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${BASE_URL}/post/${postId}`, {
      method: "GET",
      headers: getAuthHeaders(),
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

    const data: PostDetailApiResponse = await response.json();
    return data.post;
  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);
    return null;
  }
}

// 게시글 수정

export async function EditPost(
  postId: string,
  content: string,
  image?: string
): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${BASE_URL}/post/${postId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
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
      throw new Error("게시글 수정 실패");
    }

    const data: PostDetailApiResponse = await response.json();
    return data.post;
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
}

//  게시글 삭제

export async function deletePost(postId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/post/${postId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
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

    return true;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
}

// 게시글 신고
export async function reportPost(postId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/post/${postId}/report`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 게시글 ID입니다.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("게시글 신고 실패");
    }

    const data = await response.json();

    return true;
  } catch (error) {
    console.error("게시글 신고 실패:", error);
    throw error;
  }
}

// 게시글 좋아요

export async function likePost(postId: string): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${BASE_URL}/post/${postId}/heart`, {
      method: "POST",
      headers: getAuthHeaders(),
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

    const data: PostDetailApiResponse = await response.json();
    return data.post;
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    throw error;
  }
}

//  게시글 좋아요 취소

export async function unlikePost(postId: string): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${BASE_URL}/post/${postId}/unheart`, {
      method: "DELETE",
      headers: getAuthHeaders(),
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

    const data: PostDetailApiResponse = await response.json();
    return data.post;
  } catch (error) {
    console.error("좋아요 취소 실패:", error);
    throw error;
  }
}

//  댓글 목록 조회

export async function fetchPostComments(postId: string): Promise<Comment[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/${postId}/comments?limit=1000`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 게시글 ID입니다.");
      }
      throw new Error("댓글 조회 실패");
    }

    const data: CommentsApiResponse = await response.json();


    // comments (복수형)일 수도 있으므로 둘 다 체크
    const comments = data.comment || data.comments || [];


    return comments;
  } catch (error) {
    console.error("댓글 목록 조회 실패:", error);
    return [];
  }
}

//  댓글 작성

export async function createComment(
  postId: string,
  content: string
): Promise<Comment | null> {
  try {
    const response = await fetch(`${BASE_URL}/post/${postId}/comments`, {
      method: "POST",
      headers: getAuthHeaders(),
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

    const data: CommentApiResponse = await response.json();
    return data.comment;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return null;
  }
}

// 댓글 수정
export async function updateComment(
  postId: string,
  commentId: string,
  content: string
): Promise<Comment | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/${postId}/comments/${commentId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          comment: {
            content: content,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("유효하지 않은 댓글 ID입니다.");
      }
      if (response.status === 403) {
        throw new Error("수정 권한이 없습니다. 로그인 정보를 확인하세요.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("댓글 수정 실패");
    }

    const data: CommentApiResponse = await response.json();
    return data.comment;
  } catch (error) {
    console.error("댓글 수정 실패:", error);
    throw error;
  }
}

// 댓글 신고

export async function reportComment(
  postId: string,
  commentId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/${postId}/comments/${commentId}/report`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("유효하지 않은 게시글 또는 댓글 ID입니다.");
      }
      if (response.status === 401) {
        throw new Error("유효하지 않은 토큰입니다.");
      }
      throw new Error("댓글 신고 실패");
    }

    const data = await response.json();
    return true;
  } catch (error) {
    console.error("댓글 신고 실패:", error);
    throw error;
  }
}

// 댓글 삭제

export async function deleteComment(
  postId: string,
  commentId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
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
      throw new Error("댓글 삭제 실패");
    }

    return true;
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    throw error;
  }
}
