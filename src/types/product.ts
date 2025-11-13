// 상품 타입 정의
export interface Product {
  id: string;
  itemName: string;
  price: number;
  itemImage: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  /* 나중에 구현할 필드들 */
  // itemImage: string | string[];
  // status: "selling" | "sold" /* 추가 */;
  // description: string;
  // interactions?: {
  //   views: number;
  //   likes: number;
  //   chatCount: number;
  // };
}

// 작성자 타입 정의
export interface Author {
  id: string;
  username: string;
  accountname: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: string[];
  follower: string[];
  followerCount: number;
  followingCount: number;
}
