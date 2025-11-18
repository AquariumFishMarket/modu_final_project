// 사용자 프로필 타입 정의
export interface UserProfile {
  _id: string;
  username: string;
  accountname: string;
  image: string;
  intro: string;

  following: string[];
  follower: string[];
  followerCount: number;
  followingCount: number;

  isfollow: boolean;
}
