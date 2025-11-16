/**
 * 게시글 작성자 정보
 */
export interface PostAuthor {
  _id: string;
  username: string;
  accountname: string;
  email: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: string[];
  follower: string[];
  followerCount: number;
  followingCount: number;
}

/**
 * 댓글 작성자 정보
 */
export interface CommentAuthor {
  _id: string;
  username: string;
  accountname: string;
  email: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: string[];
  follower: string[];
  followerCount: number;
  followingCount: number;
}

/**
 * 댓글 데이터
 */
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  hearted: boolean;
  heartCount: number;
}

/**
 * 게시글 데이터
 */
export interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  hearted: boolean;
  heartCount: number;
  comments: Comment[];
  commentCount: number;
  author: PostAuthor;
}

/**
 * 유저 게시글 목록 조회 API 응답
 */
export interface UserPostsResponse {
  post: Post[];
}
