// 사용자 프로필 타입 정의
export interface UserProfile {
  _id: string; // 사용자 고유 ID
  username: string; // 사용자 이름
  accountname: string; // 사용자 ID (예: @username)
  image: string; // 프로필 이미지 URL
  intro: string; // 사용자 소개

  // SNS
  followerCount: number; // 팔로워 수
  followingCount: number; // 팔로잉 수
  isfollow: boolean; // 현재 사용자가 팔로우 중인지 여부

  // 🆕 기본 회원 정보
  email?: string; // 이메일 주소

  // 🆕 계정 상태
  accountStatus?: "active" | "deleted"; // 계정 상태
  createdAt?: string; // 가입일
  lastActiveAt?: string; // 마지막 활동일
}
