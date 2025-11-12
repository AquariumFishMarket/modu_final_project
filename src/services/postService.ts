import { getAuthHeaders } from "../utils/auth";

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// 작성자 타입
interface Author {
  _id: string;
  username: string;
  accountname: string;
  image: string;
}

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

//  게시글 상세 조회

export async function fetchPostDetail(
  postId: string
): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("게시글 조회 실패");

    const data: PostDetailApiResponse = await response.json();
    const post = data.post;

    return {
      postId: post.id,
      userName: post.author?.username || "알 수 없음",
      userId: post.author?.accountname || "",
      avatarSrc: post.author?.image || "",
      avatarAlt: `${post.author?.username || "사용자"} 프로필`,
      content: post.content,
      imageSrc: post.image,
      imageAlt: "게시글 이미지",
      dateTime: post.createdAt,
      dateText: post.createdAt,
      likeCount: post.heartCount,
      commentCount: post.commentCount,
      isLiked: post.hearted,
    };
  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);
    return null;
  }
}

//  게시글 댓글 목록 조회

export async function fetchPostComments(postId: string): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/post/${postId}/comments`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("댓글 조회 실패");

    const data: CommentsApiResponse = await response.json();

    return data.comment.map((comment: CommentResponse) => ({
      commentId: comment.id,
      userName: comment.author?.username ?? "알 수 없음",
      userId: comment.author?.accountname ?? "",
      avatarSrc: comment.author?.image ?? "",
      avatarAlt: `${comment.author?.username ?? "사용자"} 프로필`,
      content: comment.content,
      dateTime: comment.createdAt,
      dateText: comment.createdAt,
    }));
  } catch (error) {
    console.error("댓글 목록 조회 실패:", error);
    return [];
  }
}

// 댓글 작성

export async function createComment(
  postId: string,
  content: string
): Promise<Comment | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/post/${postId}/comments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        comment: {
          content,
        },
      }),
    });

    if (!response.ok) throw new Error("댓글 작성 실패");

    const data: CreateCommentApiResponse = await response.json();
    const comment = data.comment;

    return {
      commentId: comment.id,
      userName: comment.author?.username ?? "알 수 없음",
      userId: comment.author?.accountname ?? "",
      avatarSrc: comment.author?.image ?? "",
      avatarAlt: `${comment.author?.username ?? "사용자"} 프로필`,
      content: comment.content,
      dateTime: comment.createdAt,
      dateText: comment.createdAt,
    };
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return null;
  }
}

// 게시글 작성

export async function createPost(
  content: string,
  image?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/post`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        post: {
          content,
          image: image || "",
        },
      }),
    });

    if (!response.ok) throw new Error("게시글 작성 실패");

    return true;
  } catch (error) {
    console.error("게시글 작성 실패:", error);
    throw error;
  }
}

// 게시글 좋아요 토글

export async function togglePostLike(
  postId: string,
  isLiked: boolean
): Promise<boolean> {
  try {
    const endpoint = isLiked ? "unheart" : "heart";
    const method = isLiked ? "DELETE" : "POST";

    const response = await fetch(`${API_BASE_URL}/post/${postId}/${endpoint}`, {
      method: method,
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("좋아요 처리 실패");

    return true;
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    throw error;
  }
}
