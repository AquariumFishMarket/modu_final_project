import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Product } from "../../types/product";
import { useHeader } from "../../contexts/HeaderContext";
import {
  deleteProduct,
  fetchProductDetail,
  toggleProductLike,
} from "../../services/productService";
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

// const SoldTag = styled.span`
//   display: inline-block;
//   color: var(--color-gray-semi-dark);
//   font-size: var(--font-size-lg);
//   font-weight: 700;
//   margin-right: 5px;
// `;

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
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const location = useLocation();

  // 헤더 설정
  useEffect(() => {
    if (!product) return;

    setHeaderConfig({
      show: true,
      type: "productDetail",
      onBackClick: () => {
        // edit에서 돌아온 경우(명시적 상태 확인) 항상 상세로 라우트
        if (location.state && location.state.cameFromEdit) {
          navigate(`/product/${id}`);
        } else {
          navigate(-1);
        }
      },
      rightElement: (
        <MoreMenu
          type="product"
          authorAccountname={product.author.accountname}
          onEdit={() =>
            navigate(`/product/${id}/edit`, {
              state: { from: `/product/${id}` },
            })
          }
          onDelete={handleDelete}
        />
      ),
    });
  }, [product, location.state]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        console.log("상품 ID 없음");
        return;
      }

      try {
        const productData = await fetchProductDetail(id);

        // ✅ itemImage가 유효한지 확인
        if (
          !productData.itemImage ||
          productData.itemImage.includes("undefined")
        ) {
          console.warn("⚠️ 유효하지 않은 이미지 URL");
          productData.itemImage = "/img/basic-img.jpg"; // 기본 이미지
        }

        setProduct(productData);
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
    console.log("채팅 시작:", product.id);
    // navigate(`/chat-room/${product.seller.id}`);
  };

  // 구매하기
  const handlePurchase = () => {
    if (!product.link) return;

    window.open(product.link, "_blank");
    console.log("구매 링크로 이동:", product.link);
  };

  // 상품 삭제
  const handleDelete = async () => {
    if (!product || !id) return;

    try {
      await deleteProduct(id);
      alert("상품이 삭제되었습니다.");
      navigate("/profile"); // 프로필 페이지로 이동
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert(
        error instanceof Error ? error.message : "상품 삭제에 실패했습니다."
      );
    }
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

          {/* 판매자 부분 */}
          {/* <SellerSection>
            <img
              src={product.author.image}
              alt={`${product.author}의 프로필 이미지`}
            />
            <p>{product.author.accountname}</p>
          </SellerSection> */}

          {/* 판매 완료 태그 */}
          {/* <SoldTag>거래완료</SoldTag> */}

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
              </StatItem>
              <StatItem>
                <img src="/img/icon-heart-filled.svg" alt="" /> {likeCount}
              </StatItem>
              <StatItem>
                <img src="/img/icon-chat.svg" alt="" />{" "}
              </StatItem>
            </StatsGroup>
          </ProductStats>
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
          <ActionButton $variant="buy" onClick={handlePurchase}>
            구매하기
          </ActionButton>
        )}

        <ActionButton $variant="chat" onClick={handleChatStart}>
          채팅하기
        </ActionButton>
      </BottomActionBar>
    </>
  );
}
