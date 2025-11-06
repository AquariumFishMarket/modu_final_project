/**
 * 게시글 더미 데이터
 * 프로필 페이지 및 피드 페이지에서 사용
 */

export interface Post {
  postId: string;
  userName: string;
  userId: string;
  avatarSrc: string;
  avatarAlt: string;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  imageCount?: number; // 이미지가 여러 장일 경우 총 개수
  dateTime: string; // ISO 8601 형식
  dateText: string; // 사용자에게 표시될 날짜 텍스트
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export const dummyPosts: Post[] = [
  {
    postId: "post-001",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "오늘 잡은 신선한 니모입니다! 회로 드시면 안돼요",
    imageSrc: "/img/basic-img.png",
    imageAlt: "신선한 광어",
    imageCount: 3,
    dateTime: "2025-11-04T10:30:00",
    dateText: "30분 전",
    likeCount: 42,
    commentCount: 8,
    isLiked: false,
  },
  {
    postId: "post-002",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "",
    imageSrc: "/img/basic-img.png",
    imageAlt: "제주 갈치",
    dateTime: "2025-11-03T15:20:00",
    dateText: "어제",
    likeCount: 67,
    commentCount: 15,
    isLiked: true,
  },
  {
    postId: "post-003",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "",
    imageSrc: "/img/basic-img.png",
    imageAlt: "활 전복",
    dateTime: "2025-11-02T09:15:00",
    dateText: "11/02",
    likeCount: 53,
    commentCount: 12,
    isLiked: false,
  },
  {
    postId: "post-004",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "",
    imageSrc: "/img/basic-img.png",
    imageAlt: "오징어 손질",
    imageCount: 5,
    dateTime: "2025-11-01T14:45:00",
    dateText: "11/01",
    likeCount: 128,
    commentCount: 34,
    isLiked: true,
  },
  {
    postId: "post-005",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "",
    imageSrc: "/img/basic-img.png",
    imageAlt: "자연산 농어",
    dateTime: "2025-10-31T11:00:00",
    dateText: "10/31",
    likeCount: 91,
    commentCount: 20,
    isLiked: false,
  },
  {
    postId: "post-006",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "킹크랩 들어왔습니다!🦀",
    imageSrc: "/img/basic-img.png",
    imageAlt: "킹크랩",
    imageCount: 2,
    dateTime: "2025-10-30T16:30:00",
    dateText: "10/30",
    likeCount: 205,
    commentCount: 56,
    isLiked: true,
  },
  {
    postId: "post-007",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "",
    dateTime: "2025-10-29T13:20:00",
    dateText: "10/29",
    likeCount: 74,
    commentCount: 18,
    isLiked: false,
  },
  {
    postId: "post-008",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "",
    imageSrc: "/img/basic-img.png",
    imageAlt: "고등어",
    dateTime: "2025-10-28T10:10:00",
    dateText: "10/28",
    likeCount: 112,
    commentCount: 27,
    isLiked: true,
  },
  {
    postId: "post-009",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "",
    imageSrc: "/img/basic-img.png",
    imageAlt: "문어",
    dateTime: "2025-10-27T15:40:00",
    dateText: "10/27",
    likeCount: 86,
    commentCount: 22,
    isLiked: false,
  },
  {
    postId: "post-010",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "",
    imageSrc: "/img/basic-img.png",
    imageAlt: "갈치조림",
    imageCount: 4,
    dateTime: "2025-10-26T12:25:00",
    dateText: "10/26",
    likeCount: 178,
    commentCount: 45,
    isLiked: true,
  },
  {
    postId: "post-011",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "새로운 상품 준비 중이에요! 기대해주세요 🎣",
    imageSrc: "/img/basic-img.png",
    imageAlt: "수산시장",
    dateTime: "2025-10-25T09:50:00",
    dateText: "10/25",
    likeCount: 95,
    commentCount: 31,
    isLiked: false,
  },
  {
    postId: "post-012",
    userName: "김수산",
    userId: "@kim_fish",
    avatarSrc: "/img/fish_profile.png",
    avatarAlt: "김수산 프로필",
    content: "오늘도 신선한 해산물과 함께! 감사합니다 🙏",
    imageSrc: "/img/basic-img.png",
    imageAlt: "해산물",
    dateTime: "2025-10-24T17:15:00",
    dateText: "10/24",
    likeCount: 124,
    commentCount: 19,
    isLiked: true,
  },
];

/**
 * 특정 사용자의 게시글만 필터링하는 함수
 */
export const getPostsByUserId = (userId: string): Post[] => {
  return dummyPosts.filter((post) => post.userId === userId);
};

/**
 * 이미지가 있는 게시글만 필터링하는 함수
 */
export const getPostsWithImages = (posts: Post[]): Post[] => {
  return posts.filter((post) => post.imageSrc);
};
