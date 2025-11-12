// 사용자 프로필 타입 정의
export interface UserProfile {
  _id: string; // 사용자 고유 ID
  username: string; // 사용자명
  accountname: string; // 사용자 ID (예: @username)
  image: string;
  intro: string;

  following: string[];
  follower: string[];
  followerCount: number; // 팔로워 수
  followingCount: number; // 팔로잉 수

  isfollow: boolean; // 현재 사용자가 팔로우 중인지 여부
}
