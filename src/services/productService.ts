import { getAuthHeaders } from "../utils/auth";
import type { Product } from "../types/product";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * 상품 상세 정보 조회
 * @param productId 상품 ID
 * @returns Product
 */
export const fetchProductDetail = async (
  productId: string
): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`상품 조회 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.product;
};

/**
 * 상품 수정
 * @param productId 상품 ID
 * @param productData 수정할 상품 데이터
 */
export const updateProduct = async (
  productId: string,
  productData: Partial<Product>
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(`상품 수정 실패: ${response.status}`);
  }
};

/**
 * 상품 삭제
 * @param productId 상품 ID
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`상품 삭제 실패: ${response.status}`);
  }
};

/**
 * 상품 찜하기 토글
 * @param productId 상품 ID
 */
export const toggleProductLike = async (productId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`상품 찜하기 실패: ${response.status}`);
  }
};
