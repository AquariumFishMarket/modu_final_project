// 사용자 프로필 타입 정의
export interface UserProfile {
  id: string; // 사용자 고유 ID
  userName: string; // 사용자 이름
  userId: string; // 사용자 ID (예: @username)
  profileImage: string; // 프로필 이미지 URL
  description: string; // 사용자 소개
  followerCount: number; // 팔로워 수
  followingCount: number; // 팔로잉 수
  isFollowing: boolean; // 현재 사용자가 팔로우 중인지 여부
}
