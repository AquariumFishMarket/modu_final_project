import type { Product } from "../types/product";
import { getAuthHeaders } from "../utils/tokenManager";
import { ProductRequest } from "../components/common/form/types";

const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

/**
 * 상품 등록
 * @param productData 상품 등록 데이터
 * @returns product
 */
export const fetchProductUpload = async (
  productData: ProductRequest
): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      product: {
        itemName: productData.itemName,
        price: productData.price,
        link: productData.link,
        itemImage: productData.itemImage,
      },
    }),
  });

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error("필수 입력사항을 입력해주세요.");
    }
    if (response.status === 401) {
      throw new Error("유효하지 않은 토큰입니다.");
    }
    throw new Error(`상품 등록 실패: ${response.status}`);
  }

  const data = await response.json();

  console.log("📦상품 등록: ", data.product);

  return data.product;
};

/**
 * 상품 상세 정보 조회
 * @param productId 상품 ID
 * @returns product
 */
export const fetchProductDetail = async (
  productId: string
): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/product/detail/${productId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error("필수 입력사항을 입력해주세요.");
    }
    if (response.status === 401) {
      throw new Error("유효하지 않은 토큰입니다.");
    }

    throw new Error(`상품 조회 실패: ${response.status}`);
  }

  const data = await response.json();

  return data.product;
};

/**
 * 상품 수정
 * @param productId 상품 ID
 * @param productData 수정할 상품 데이터
 * @return product
 */
export const updateProduct = async (
  productId: string,
  productData: Partial<Product>
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/product/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      product: productData,
    }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("유효하지 않은 상품 ID입니다.");
    }
    if (response.status === 403) {
      throw new Error("잘못된 요청입니다. 로그인 정보를 확인하세요.");
    }
    if (response.status === 401) {
      throw new Error("유효하지 않은 토큰입니다.");
    }
    throw new Error(`상품 수정 실패: ${response.status}`);
  }

  const data = await response.json();

  console.log("✅ 상품 수정 완료: ", data.product);

  return data.product;
};

/**
 * 상품 삭제
 * @param productId 상품 ID
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/product/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("유효하지 않은 상품 ID입니다.");
    }
    if (response.status === 403) {
      throw new Error("잘못된 요청입니다. 로그인 정보를 확인하세요.");
    }
    if (response.status === 401) {
      throw new Error("유효하지 않은 토큰입니다.");
    }
    throw new Error(`상품 삭제 실패: ${response.status}`);
  }

  const data = await response.json();

  console.log("📦상품 삭제 메세지: ", data);

  // 삭제만 하면 되니까 반환 하지 않음
};

/**
 * 상품 리스트 -> 판매중인 물품
 * @param accountname 판매자 계정ID
 * @return { data: number, product: Product[] }
 */
export const fetchProductList = async (
  accountname: string
): Promise<{ data: number; product: Product[] }> => {
  const response = await fetch(`${BASE_URL}/product/${accountname}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("해당 계정이 존재하지 않습니다.");
    }
    if (response.status === 401) {
      throw new Error("유효하지 않은 토큰입니다.");
    }
    throw new Error(`상품 찜하기 실패: ${response.status}`);
  }

  const data = await response.json();

  // console.log("📦 상품 리스트: ", data); // { data, product: [] }

  return data;
};

/**
 * 상품 찜하기 토글 -> 수겸님과 구현
 * @param productId 상품 ID
 */
export const toggleProductLike = async (productId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/products/${productId}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`상품 찜하기 실패: ${response.status}`);
  }
};
