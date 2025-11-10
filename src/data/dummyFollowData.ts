export interface FollowUser {
  userId: string;
  userName: string;
  userImage: string;
  userIntro: string;
  isFollowing: boolean;
}

// 더미 팔로워 목록
export const dummyFollowers: FollowUser[] = [
  {
    userId: "@fishmarket1",
    userName: "애월읍 한라봉 맛집",
    userImage: "/img/fish_profile.png",
    userIntro: "정성을 다해 농사짓는 한라봉입니다",
    isFollowing: true,
  },
  {
    userId: "@fishking",
    userName: "단골의 증거 - 애월읍",
    userImage: "/img/fish_profile.png",
    userIntro: "네? 오지마? 네네! 가겠습니다...",
    isFollowing: true,
  },
  {
    userId: "@mandarin_sin",
    userName: "한라봉의 신",
    userImage: "/img/fish_profile.png",
    userIntro: "30년 노하우 정통 농사꾼 채널입니다",
    isFollowing: false,
  },
  {
    userId: "@randomnick",
    userName: "나 감귤 좋아하네!",
    userImage: "/img/fish_profile.png",
    userIntro: "감귤로 만드는 라떼, 청, 잼! 마농만담",
    isFollowing: false,
  },
  {
    userId: "@fishmarket2",
    userName: "애월읍 한라봉 맛집",
    userImage: "/img/fish_profile.png",
    userIntro: "커피 한잔",
    isFollowing: true,
  },
  {
    userId: "@coffee_giver",
    userName: "제주 커피, 한라본 편백",
    userImage: "/img/fish_profile.png",
    userIntro: "커피 한잔",
    isFollowing: false,
  },
  {
    userId: "@shinsilmi",
    userName: "신실의 차츰 한라봉",
    userImage: "/img/fish_profile.png",
    userIntro: "30년 노하우 정통 농사꾼 채널입니다",
    isFollowing: true,
  },
];

// 더미 팔로잉 목록
export const dummyFollowing: FollowUser[] = [
  {
    userId: "@jejufarmer",
    userName: "제주 감귤 농부",
    userImage: "/img/fish_profile.png",
    userIntro: "제주에서 감귤 농사를 짓고 있습니다",
    isFollowing: true,
  },
  {
    userId: "@hallabong_love",
    userName: "한라봉 사랑",
    userImage: "/img/fish_profile.png",
    userIntro: "한라봉으로 다양한 요리를 만듭니다",
    isFollowing: true,
  },
  {
    userId: "@citrus_master",
    userName: "감귤 마스터",
    userImage: "/img/fish_profile.png",
    userIntro: "감귤 재배 노하우를 공유합니다",
    isFollowing: true,
  },
];
