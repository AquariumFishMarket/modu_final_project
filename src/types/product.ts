// 상품 타입 정의
export interface Product {
  id: string;
  itemName: string;
  price: number;
  /** 이미지가 한 장일 수도, 여러 장일 수도 있음 */
  itemImage: string | string[];
  link: string;
  description: string;

  /* 명슬 추가! */
  /** 상품 등록 시간 */
  createdAt?: string;

  /** 상호작용 통계 */
  interactions?: {
    /** 조회수 */
    views: number;
    /** 찜 수 */
    likes: number;
    /** 채팅 수 (문의 수) */
    chatCount: number;
  };
}
