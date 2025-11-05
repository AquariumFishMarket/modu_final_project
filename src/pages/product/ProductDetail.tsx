import React, { useEffect, useState } from "react";
import { Product } from "../../types/product";
import { getProductById } from "../../data/mockProducts";
import { useParams } from "react-router-dom";
import styled from "styled-components";

// 🆕 시간 표시 유틸리티 함수 추가
const getRelativeTime = (createdAt: string): string => {
  const created = new Date(createdAt);

  return created.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
};

const ProductContainer = styled.section`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
`;

const ProductImages = styled.img<{ $hasThumbnails: boolean }>`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: ${(props) => (props.$hasThumbnails ? "16px" : "30px")};
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
`;

const Thumbnail = styled.img<{ $isSelected: boolean }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: ${(props) =>
    props.$isSelected ? "1px solid var(--color-primary-600)" : "none"};
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const ProductTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: 500;
  margin-bottom: 12px;
  color: black;
`;

const Price = styled.p`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 30px;
`;

// 🆕 추가 스타일 컴포넌트
const ProductStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 30px;
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  border-bottom: 1px solid var(--color-gray-medium);
`;

// 🆕 시간 표시용 컴포넌트
const TimeStamp = styled.span`
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
`;

// 🆕 통계 정보 그룹
const StatsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Description = styled.p`
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--color-gray-dark);
  font-size: var(--font-size-md);
  font-weight: 500;
`;

const BottomActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-top: 1px solid var(--color-gray-medium);
  padding: 8px 23px;
  display: flex;
  align-items: center;
  gap: 22px;
  z-index: 100;

  /* 안전 영역 고려 (iPhone 하단 여백) */
  /* padding-bottom: calc(12px + env(safe-area-inset-bottom)); */
`;

const ActionButton = styled.button<{ $variant: "chat" | "buy" }>`
  flex: 1;
  height: 48px;
  border-radius: 8px;
  background-color: var(--color-gray-light);
  font-size: var(--font-size-md);
  font-weight: 600;
  transition: all 0.2s ease;

  ${(props) =>
    props.$variant === "chat"
      ? `
      color: black;
    `
      : `
      background: var(--color-primary-600);
      color: white;
    `}
`;

const LikeButton = styled.button<{ $isLiked: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid var(--color-gray-medium);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.$isLiked &&
    `
    color: var(--color-primary-600);
  `}

  &:hover {
    transform: scale(1.05);
  }
`;

const ContentWrapper = styled.div`
  padding-bottom: 80px; /* 하단 바 높이만큼 여백 */
`;

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false); // 🆕 찜 상태
  const [likeCount, setLikeCount] = useState(0); // 🆕 찜 개수

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct || null);
    }
  }, [id]);

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  // 이미지 배열로 변환
  const images = Array.isArray(product.itemImage)
    ? product.itemImage
    : [product.itemImage];

  const mainImage = images[selectedImageIdx] || images[0];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/img/default-fish.jpg"; // 물고기 마켓 기본 이미지
  };

  // 🆕 찜하기 토글
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // 🆕 채팅하기
  const handleChatStart = () => {
    console.log("채팅 시작:", product.id);
    // navigate(`/chat-room/${product.seller.id}`);
  };

  // 🆕 구매하기
  const handlePurchase = () => {
    console.log("구매하기:", product.id);
    // 구매 플로우 실행
  };

  return (
    <>
      <ContentWrapper>
        <ProductContainer>
          {/* 메인 이미지 */}
          <ProductImages
            src={mainImage}
            alt={product.itemName}
            onError={handleImageError}
            $hasThumbnails={images.length > 1}
          />

          {/* 썸네일 이미지들 */}
          {images.length > 1 && (
            <ThumbnailContainer>
              {images.map((image, index) => (
                <Thumbnail
                  key={index}
                  src={image}
                  alt={`${product.itemName} ${index + 1}`}
                  $isSelected={selectedImageIdx === index}
                  onClick={() => setSelectedImageIdx(index)}
                  onError={handleImageError}
                />
              ))}
            </ThumbnailContainer>
          )}

          {/* 상품 정보 */}
          <ProductTitle>{product.itemName}</ProductTitle>
          <Price>{product.price.toLocaleString()}원</Price>

          {/* 🆕 상품 통계 */}
          <ProductStats>
            <TimeStamp>
              {product.createdAt && getRelativeTime(product.createdAt)}
            </TimeStamp>
            <StatsGroup>
              <StatItem>
                <img src="/img/icon-eye.svg" alt="" />{" "}
                {product.interactions?.views || 0}
              </StatItem>
              <StatItem>
                <img src="/img/icon-heart-filled.svg" alt="" /> {likeCount}
              </StatItem>
              <StatItem>
                <img src="/img/icon-chat.svg" alt="" />{" "}
                {product.interactions?.chatCount || 0}
              </StatItem>
            </StatsGroup>
          </ProductStats>

          <Description>{product.description}</Description>
        </ProductContainer>
      </ContentWrapper>

      {/* 🆕 하단 액션 바 */}
      <BottomActionBar>
        <LikeButton $isLiked={isLiked} onClick={handleLikeToggle}>
          {isLiked ? (
            <img src="/img/icon-like-empty.svg" alt="" />
          ) : (
            <img src="/img/icon-like-full.svg" alt="" />
          )}
        </LikeButton>

        <ActionButton $variant="chat" onClick={handleChatStart}>
          채팅하기
        </ActionButton>

        <ActionButton $variant="buy" onClick={handlePurchase}>
          구매하기
        </ActionButton>
      </BottomActionBar>
    </>
  );
}
