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
  status?: "selling" | "sold"; // 판매 상태
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
