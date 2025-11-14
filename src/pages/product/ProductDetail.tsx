import React, { useEffect, useState } from "react";
import { Product } from "../../types/product";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  fetchProductDetail,
  toggleProductLike,
} from "../../services/productService";
import { useHeader } from "../../contexts/HeaderContext";
import MoreMenu from "../../components/common/modal/MoreMenu";

// 시간 표시 유틸리티 함수 추가
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

const ProductImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
`;

// const ThumbnailContainer = styled.div`
//   display: flex;
//   gap: 8px;
//   margin-bottom: 20px;
//   overflow-x: auto;
// `;

// const Thumbnail = styled.img<{ $isSelected: boolean }>`
//   width: 60px;
//   height: 60px;
//   object-fit: cover;
//   border-radius: 6px;
//   cursor: pointer;
//   border: ${(props) =>
//     props.$isSelected ? "2px solid var(--color-primary-600)" : "none"};
//   flex-shrink: 0;

//   &:hover {
//     opacity: 0.8;
//   }
// `;

// const SellerSection = styled.div`
//   display: flex;
//   padding-bottom: 10px;
//   border-bottom: 1px solid var(--color-gray-medium);

//   img {
//     width: 40px;
//     height: 40px;
//     margin-right: 15px;
//   }

//   p {
//     font-size: var(--font-size-lg);
//     font-weight: 500;
//     display: flex;
//     align-items: center;
//   }
// `;

const SoldTag = styled.span`
  display: inline-block;
  color: var(--color-gray-semi-dark);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-right: 5px;
`;

const ProductTitle = styled.h2`
  display: inline-block;
  font-size: var(--font-size-lg);
  font-weight: 500;
  margin-bottom: 12px;
  color: black;
`;

const Price = styled.p`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 30px;
`;

const ProductStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 30px;
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  border-bottom: 1px solid var(--color-gray-medium);
`;

const TimeStamp = styled.span`
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// const Description = styled.p`
//   line-height: 1.6;
//   white-space: pre-wrap;
//   color: var(--color-gray-dark);
//   font-size: var(--font-size-md);
//   font-weight: 500;
// `;

const BottomActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-top: 1px solid var(--color-gray-medium);
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;

  /* 안전 영역 고려 (iPhone 하단 여백) */
  /* padding-bottom: calc(12px + env(safe-area-inset-bottom)); */
`;

const ActionButton = styled.button<{
  $variant: "chat" | "buy";
  $disabled?: boolean;
}>`
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
      background: var(--color-primary-600);
      color: white;
      `
      : `
      background-color: var(--color-gray-light);
      color: black;
    `}

  &:disabled {
    ${(props) =>
      props.$variant === "chat"
        ? `
        background-color: var(--color-primary-400);
        color: white;
        `
        : `
        background-color: #f3f4f6;
        color: #9ca3af;
    `}
    cursor: not-allowed;
  }

  &:not(:disabled) {
    cursor: pointer;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
`;

const LikeButton = styled.button<{ $isLiked: boolean }>`
  height: 48px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  img {
    width: 20px;
    aspect-ratio: 1;
    object-fit: contain;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const ContentWrapper = styled.div`
  padding-bottom: 80px; /* 하단 바 높이만큼 여백 */
`;

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const [product, setProduct] = useState<Product | null>(null);
  // const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isSold = product?.status === "sold";

  const canPurchase = !isSold && product?.link;

  // 상품 삭제 핸들러
  const handleDelete = async () => {
    console.log("상품 삭제:", id);
    // 상품 삭제 API 호출
    navigate(-1);
  };

  // 판매완료 처리 핸들러
  const handleMarkAsSold = async () => {
    console.log("판매완료 처리:", id);
    // 상품 상태 업데이트 API 호출
    if (product) {
      setProduct({ ...product, status: "sold" });
    }
  };

  // 상품 신고 핸들러
  const handleReport = () => {
    console.log("상품 신고:", id);
    // 상품 신고 API 호출
    alert("상품이 신고되었습니다.");
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        console.log("상품 ID 없음");
        return;
      }

      try {
        const productData = await fetchProductDetail(id);
        console.log("📦 상품 데이터:", productData);
        console.log("이미지 URL:", productData.itemImage);

        // ✅ itemImage가 유효한지 확인
        if (
          !productData.itemImage ||
          productData.itemImage.includes("undefined")
        ) {
          console.warn("⚠️ 유효하지 않은 이미지 URL");
          productData.itemImage = "/img/basic-img.jpg"; // 기본 이미지
        }

        setProduct(productData);
        setLikeCount(productData.interactions?.likes || 0);
        // TODO: 사용자의 찜 상태 가져오기 (API 추가 필요)
        // setIsLiked(productData.isLiked);
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);

        // ✅ 에러 메시지 표시
        if (error instanceof Error) {
          alert(error.message);
        }

        setProduct(null);
      }
    };

    loadProduct();
  }, [id]);

  // 헤더 설정 (product 로드 후)
  useEffect(() => {
    if (!product) return;

    setHeaderConfig({
      show: true,
      type: "productDetail",
      onBackClick: () => navigate(-1),
      rightElement: (
        <MoreMenu
          type="product"
          authorAccountname={product.author.accountname}
          onEdit={() => navigate(`/product/${id}/edit`)}
          onDelete={handleDelete}
          onMarkAsSold={handleMarkAsSold}
          onReport={handleReport}
        />
      ),
    });
  }, [product, id, setHeaderConfig, navigate]);

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  const handleImageError = () => {
    console.error("이미지 로드 실패:", product.itemImage);
  };

  // 찜하기 토글
  const handleLikeToggle = async () => {
    if (!product) return;

    const prevLikedState = isLiked;
    const prevLikeCount = likeCount;

    try {
      // 낙관적 업데이트 (UI 먼저 업데이트)
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

      await toggleProductLike(product.id);
    } catch (error) {
      // 실패시 원래 상태로 롤백
      setIsLiked(prevLikedState);
      setLikeCount(prevLikeCount);
      console.error("찜하기 실패:", error);
    }
  };

  // 채팅하기
  const handleChatStart = () => {
    if (isSold) return;

    console.log("채팅 시작:", product.id);
    // navigate(`/chat-room/${product.seller.id}`);
  };

  // 구매하기
  const handlePurchase = () => {
    if (!canPurchase || !product.link) return;

    window.open(product.link, "_blank");
    console.log("구매 링크로 이동:", product.link);
  };

  return (
    <>
      <ContentWrapper>
        <ProductContainer>
          <h2 className="sr-only">판매상품 상세 페이지</h2>

          {/* 메인 이미지 */}
          <ProductImage
            src={product.itemImage}
            alt={product.itemName}
            onError={handleImageError}
          />

          {/* 썸네일 이미지들 */}
          {/* {images.length > 1 && (
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
          )} */}

          {/* 판매자 부분 */}
          {/* <SellerSection>
            <img
              src={product.author.image}
              alt={`${product.author}의 프로필 이미지`}
            />
            <p>{product.author.accountname}</p>
          </SellerSection> */}

          {/* 판매 완료 태그 */}
          {isSold && <SoldTag>거래완료</SoldTag>}

          {/* 상품 정보 */}
          <ProductTitle>{product.itemName}</ProductTitle>
          <Price>{product.price.toLocaleString()}원</Price>

          {/* 상품 통계 */}
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

          {/* <Description>{product.description}</Description> */}
        </ProductContainer>
      </ContentWrapper>

      {/* 하단 액션 바 */}
      <BottomActionBar>
        <LikeButton $isLiked={isLiked} onClick={handleLikeToggle}>
          {isLiked ? (
            <img src="/img/icon-like-empty.svg" alt="" />
          ) : (
            <img src="/img/icon-like-full.svg" alt="" />
          )}
        </LikeButton>

        {product.link && (
          <ActionButton
            $variant="buy"
            disabled={isSold}
            onClick={handlePurchase}
          >
            {isSold ? "거래완료" : "구매하기"}
          </ActionButton>
        )}

        <ActionButton
          $variant="chat"
          disabled={isSold}
          onClick={handleChatStart}
        >
          채팅하기
        </ActionButton>
      </BottomActionBar>
    </>
  );
}
