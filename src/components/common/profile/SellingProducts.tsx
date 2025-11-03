import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProductSection,
  ProductTitle,
  ProductListContainer,
  ProductCard,
  ProductImageBox,
  ProductImage,
  ProductInfoBox,
  ProductName,
  ProductPrice,
  EmptyMessage,
  LoadingMessage,
  ErrorMessage,
} from "./SellingProducts.styled";
import type { Product } from "../../../types/product";

// 가격 포맷터 (성능 최적화 및 일관성)
const priceFormatter = new Intl.NumberFormat("ko-KR", {
  style: "decimal",
});

function SellingProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 드래그 스크롤을 위한 ref와 상태
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0); // 드래그 이동량 추적 (성능 최적화)

  // API: 판매 중인 상품 목록 가져오기
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // TODO: 실제 API 엔드포인트로 교체
        // const response = await fetch('/api/products/selling', {
        //   signal: controller.signal
        // });
        // if (!response.ok) throw new Error('상품을 불러오는데 실패했습니다');
        // const data = await response.json();
        // setProducts(data.products);

        // 임시: 테스트용 더미 데이터
        await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        setProducts([
          {
            id: "1",
            itemName: "네온테트라 10마리",
            price: 15000,
            itemImage: "https://picsum.photos/200/200?random=1",
            link: "/product/1",
          },
          {
            id: "2",
            itemName: "구피 한 쌍",
            price: 8000,
            itemImage: [
              "https://picsum.photos/200/200?random=2",
              "https://picsum.photos/200/200?random=3",
            ],
            link: "/product/2",
          },
          {
            id: "3",
            itemName: "수조 여과기 (중고)",
            price: 35000,
            itemImage: "https://picsum.photos/200/200?random=4",
            link: "/product/3",
          },
          {
            id: "4",
            itemName: "베타 물고기 (레드)",
            price: 12000,
            itemImage: [
              "https://picsum.photos/200/200?random=5",
              "https://picsum.photos/200/200?random=6",
              "https://picsum.photos/200/200?random=7",
            ],
            link: "/product/4",
          },
          {
            id: "5",
            itemName: "수초 모음 패키지",
            price: 20000,
            itemImage: "/img/empty-profile.png",
            link: "/product/5",
          },
        ]);
      } catch (error) {
        // AbortError는 정상적인 취소이므로 에러로 처리하지 않음
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("판매 상품 가져오기 실패:", error);
        setError("상품을 불러오는데 실패했습니다. 다시 시도해주세요.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // 컴포넌트 언마운트 시 비동기 요청 취소
    return () => controller.abort();
  }, []);

  // 드래그 스크롤 시작 (마우스)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    startXRef.current = e.pageX;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    dragDistanceRef.current = 0; // 드래그 거리 초기화
  };

  // 드래그 스크롤 종료 (마우스)
  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  // 공용 드래그 이동 핸들러 (마우스/터치 공통 로직)
  const handleDragMove = (clientX: number) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const walk = (clientX - startXRef.current) * 2; // 스크롤 속도 조절 (2배)
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;

    // 실제 이동 거리 계산 (ref 사용으로 리렌더링 방지)
    dragDistanceRef.current = Math.abs(clientX - startXRef.current);
  };

  // 드래그 스크롤 이동 (마우스)
  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragMove(e.pageX);
  };

  // 드래그 스크롤 시작 (터치)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].pageX;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    dragDistanceRef.current = 0;
  };

  // 드래그 스크롤 종료 (터치)
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 드래그 스크롤 이동 (터치)
  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].pageX);
  };

  // 이미지 로드 에러 핸들러
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/img/basic-img.png";
  };

  // 상품 클릭 핸들러
  const handleProductClick = (product: Product) => {
    // 실제로 드래그 했을 때만 클릭 이벤트 무시 (5px 이상 이동)
    if (dragDistanceRef.current > 5) return;

    // 상품 상세 페이지로 이동
    if (product.link) {
      navigate(product.link);
    }
  };

  // 상품 이미지 URL 가져오기 (안전하게 처리)
  const getProductImageUrl = (
    itemImage: string | string[] | undefined
  ): string => {
    // 이미지가 없거나 빈 값이면 기본 이미지 반환
    if (!itemImage) {
      return "/img/basic-img.png";
    }

    // 배열인 경우 첫 번째 이미지 사용
    if (Array.isArray(itemImage)) {
      // 배열이 비어있거나 첫 번째 값이 유효하지 않으면 기본 이미지
      if (
        itemImage.length === 0 ||
        !itemImage[0] ||
        itemImage[0].trim() === ""
      ) {
        return "/img/basic-img.png";
      }
      return itemImage[0];
    }

    // 문자열인 경우 빈 문자열 체크
    if (itemImage.trim() === "") {
      return "/img/basic-img.png";
    }

    return itemImage;
  };

  return (
    <ProductSection aria-busy={isLoading}>
      <ProductTitle>판매 중인 상품</ProductTitle>

      {isLoading ? (
        <LoadingMessage aria-live="polite">
          상품을 불러오는 중...
        </LoadingMessage>
      ) : error ? (
        <ErrorMessage aria-live="assertive">{error}</ErrorMessage>
      ) : products.length === 0 ? (
        <EmptyMessage aria-live="polite">
          판매 중인 상품이 없습니다.
        </EmptyMessage>
      ) : (
        <ProductListContainer
          ref={scrollContainerRef}
          $isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          role="list"
          aria-label="판매 중인 상품 목록"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              onClick={() => handleProductClick(product)}
              role="listitem"
            >
              <ProductImageBox>
                <ProductImage
                  src={getProductImageUrl(product.itemImage)}
                  alt={product.itemName}
                  onError={handleImageError}
                />
              </ProductImageBox>

              <ProductInfoBox>
                <ProductName>{product.itemName}</ProductName>
                <ProductPrice>
                  {priceFormatter.format(product.price)}원
                </ProductPrice>
              </ProductInfoBox>
            </ProductCard>
          ))}
        </ProductListContainer>
      )}
    </ProductSection>
  );
}

export default SellingProducts;
