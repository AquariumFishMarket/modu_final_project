import { useState, useEffect } from "react";
import { fetchProductList } from "../services/productService";
import type { Product } from "../types/product";

export function useUserProducts(accountname?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 판매 중인 상품 불러오기
  useEffect(() => {
    if (!accountname) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchProductList(accountname);
        setProducts(result.product);
      } catch (error) {
        console.error("판매 상품 가져오기 실패:", error);
        setError("상품을 불러오는데 실패했습니다. 다시 시도해주세요.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accountname]);

  return {
    products,
    loading,
    error,
  };
}
