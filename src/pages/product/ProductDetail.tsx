import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Product } from "../../types/product";
import { useHeader } from "../../contexts/HeaderContext";
import {
  deleteProduct,
  fetchProductDetail,
} from "../../services/productService";
import MoreMenu from "../../components/common/modal/MoreMenu";
import { formatPostDate } from "../../utils/formatter/dateFormatter";

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

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const ProductTitle = styled.h3`
  display: inline-block;
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: black;
`;

const Price = styled.p`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
`;

const SoldTag = styled.span`
  display: inline-block;
  color: var(--color-gray-semi-dark);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-right: 5px;
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
  position: relative;
  transition: all 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  img {
    width: 20px;
    aspect-ratio: 1;
    object-fit: contain;
    transition: transform 0.3s;
    animation: ${(props) =>
      props.$isLiked
        ? "heart 1s cubic-bezier(0.17, 0.89, 0.32, 1.49)"
        : "none"};
  }

  /* 스파클 효과 */
  &::after {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    content: "";
    margin: -0.1875rem;
    width: 0.375rem;
    height: 0.375rem;
    opacity: ${(props) => (props.$isLiked ? 1 : 0)};
    animation: ${(props) => (props.$isLiked ? "sparkles 1s ease-out" : "none")};
    box-shadow: 0 -2.8125rem 0 -0.1875rem hsl(0, 100%, 75%),
      1.6875rem -2.8125rem 0 -0.1875rem hsl(0, 100%, 75%),
      2.4375rem -1.125rem 0 -0.1875rem hsl(51.43, 100%, 75%),
      2.4375rem 1.125rem 0 -0.1875rem hsl(102.86, 100%, 75%),
      1.6875rem 2.8125rem 0 -0.1875rem hsl(102.86, 100%, 75%),
      0 3.375rem 0 -0.1875rem hsl(154.29, 100%, 75%),
      -1.6875rem 2.8125rem 0 -0.1875rem hsl(154.29, 100%, 75%),
      -2.4375rem 1.125rem 0 -0.1875rem hsl(205.71, 100%, 75%),
      -2.4375rem -1.125rem 0 -0.1875rem hsl(257.14, 100%, 75%),
      -1.6875rem -2.8125rem 0 -0.1875rem hsl(257.14, 100%, 75%),
      0 -3.375rem 0 -0.1875rem hsl(308.57, 100%, 75%),
      1.6875rem -2.8125rem 0 -0.1875rem hsl(308.57, 100%, 75%);
  }

  @keyframes heart {
    0%,
    17.5% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes sparkles {
    0%,
    20% {
      opacity: 0;
    }
    25% {
      opacity: 1;
      box-shadow: 0 -2.25rem 0 0 hsl(0, 100%, 75%),
        1.125rem -2.25rem 0 0 hsl(0, 100%, 75%),
        1.6875rem -0.75rem 0 0 hsl(51.43, 100%, 75%),
        1.6875rem 0.75rem 0 0 hsl(102.86, 100%, 75%),
        1.125rem 2.25rem 0 0 hsl(102.86, 100%, 75%),
        0 2.8125rem 0 0 hsl(154.29, 100%, 75%),
        -1.125rem 2.25rem 0 0 hsl(154.29, 100%, 75%),
        -1.6875rem 0.75rem 0 0 hsl(205.71, 100%, 75%),
        -1.6875rem -0.75rem 0 0 hsl(257.14, 100%, 75%),
        -1.125rem -2.25rem 0 0 hsl(257.14, 100%, 75%),
        0 -2.8125rem 0 0 hsl(308.57, 100%, 75%),
        1.125rem -2.25rem 0 0 hsl(308.57, 100%, 75%);
    }
    100% {
      opacity: 0;
    }
  }

  &:not(:disabled):hover img {
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
          onMarkAsSold={handleMarkAsSold}
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

        if (
          !productData.itemImage ||
          productData.itemImage.includes("undefined")
        ) {
          console.warn("⚠️ 유효하지 않은 이미지 URL");
          productData.itemImage = "/img/basic-img.png"; // 기본 이미지
        }

        setProduct(productData);
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    // 무한 onError 방지: 이미 기본 이미지로 변경된 경우 중단
    if (target.src.includes("/img/basic-img.png")) return;

    console.error("이미지 로드 실패:", product.itemImage);
    target.src = "/img/basic-img.png";
  };

  // 찜하기
  const handleLikeToggle = () => {
    if (!product) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));
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

  // 판매 완료 처리 (UI만)
  const handleMarkAsSold = () => {
    if (!product) return;

    // API 호출 없이 로컬 상태만 업데이트
    setProduct({ ...product, status: "sold" });
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

          {/* 상품 정보 */}
          <ProductInfo>
            <div>
              {/* 판매 완료 태그 */}
              {product.status === "sold" && <SoldTag>거래완료</SoldTag>}
              <ProductTitle>{product.itemName}</ProductTitle>
            </div>
            <Price>{product.price.toLocaleString()}원</Price>
          </ProductInfo>

          {/* 상품 통계 */}
          <ProductStats>
            <TimeStamp>
              {product.createdAt && formatPostDate(product.createdAt)}
            </TimeStamp>
            <StatsGroup>
              <StatItem>
                <img src="/img/icon-eye.svg" alt="" /> 0
              </StatItem>
              <StatItem>
                <img src="/img/icon-heart-filled.svg" alt="" /> {likeCount}
              </StatItem>
              <StatItem>
                <img src="/img/icon-chat.svg" alt="" /> 0
              </StatItem>
            </StatsGroup>
          </ProductStats>
        </ProductContainer>
      </ContentWrapper>

      {/* 하단 액션 바 */}
      <BottomActionBar>
        <LikeButton
          $isLiked={isLiked}
          onClick={handleLikeToggle}
          disabled={product.status === "sold"}
        >
          {isLiked ? (
            <img src="/img/icon-like-full.svg" alt="" />
          ) : (
            <img src="/img/icon-like-empty.svg" alt="" />
          )}
        </LikeButton>

        {product.link && (
          <ActionButton
            $variant="buy"
            onClick={handlePurchase}
            disabled={product.status === "sold"}
          >
            구매하기
          </ActionButton>
        )}

        <ActionButton
          $variant="chat"
          onClick={handleChatStart}
          disabled={product.status === "sold"}
        >
          채팅하기
        </ActionButton>
      </BottomActionBar>
    </>
  );
}
