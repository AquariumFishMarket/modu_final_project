import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProductSection,
  ProductTitle,
  ProductListContainer,
  ProductCard,
  ProductInfoBox,
  ProductName,
  ProductPrice,
} from "./SellingProducts.styled";
import ProductImageContainer from "./ProductImageContainer";
import { Product } from "../../../types/product";

interface SellingProductsProps {
  products: Product[];
  isLastSection?: boolean;
}

const priceFormatter = new Intl.NumberFormat("ko-KR", {
  style: "decimal",
});

function SellingProducts({
  products,
  isLastSection = false,
}: SellingProductsProps) {
  const navigate = useNavigate();

  // 드래그 스크롤을 위한 ref와 상태
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0); // 드래그 이동량 추적 (성능 최적화)

  if (!products || products.length === 0) {
    return null;
  }

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

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const walk = (clientX - startXRef.current) * 2; // 스크롤 속도 조절 (2배)
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;

    dragDistanceRef.current = Math.abs(clientX - startXRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragMove(e.pageX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].pageX;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    dragDistanceRef.current = 0;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].pageX);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/img/basic-img.png";
  };

  const handleProductClick = (product: Product) => {
    if (dragDistanceRef.current > 5) return;
    navigate(`/product/${product.id}`);
  };

  const getProductImageUrl = (
    itemImage: string | string[] | undefined
  ): string => {
    if (!itemImage) {
      return "/img/basic-img.png";
    }

    if (Array.isArray(itemImage)) {
      if (
        itemImage.length === 0 ||
        !itemImage[0] ||
        itemImage[0].trim() === ""
      ) {
        return "/img/basic-img.png";
      }
      return itemImage[0];
    }

    if (itemImage.trim() === "") {
      return "/img/basic-img.png";
    }

    return itemImage;
  };

  return (
    <ProductSection $isLastSection={isLastSection}>
      <ProductTitle>판매 중인 상품</ProductTitle>
      {
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
              <ProductImageContainer
                src={getProductImageUrl(product.itemImage)}
                alt={product.itemName}
                onError={(e) => handleImageError(e)}
              />

              <ProductInfoBox>
                <ProductName>{product.itemName}</ProductName>
                <ProductPrice>
                  {priceFormatter.format(product.price)}원
                </ProductPrice>
              </ProductInfoBox>
            </ProductCard>
          ))}
        </ProductListContainer>
      }
    </ProductSection>
  );
}

export default SellingProducts;
