// 상품 타입 정의
export interface Product {
  id: string;
  itemName: string;
  price: number;
  /** 이미지가 한 장일 수도, 여러 장일 수도 있음 */
  itemImage: string | string[];
  description: string;
  status: "selling" | "sold" /* 추가 */;
  link?: string;

  /* 추가 필요한 필드들 */
  createdAt?: string;
  interactions?: {
    views: number;
    likes: number;
    chatCount: number;
  };
}
