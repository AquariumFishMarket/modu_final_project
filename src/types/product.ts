// 상품 타입 정의
export interface Product {
  id: string;
  itemName: string;
  price: number;
  /** 이미지가 한 장일 수도, 여러 장일 수도 있음 */
  itemImage?: string | string[];
  link?: string;
}
