import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../types/product";
import { useHeader } from "../../contexts/HeaderContext";
import { useAuthStore } from "../../contexts/useAuthStore";
import {
  deleteProduct,
  fetchProductDetail,
} from "../../services/productService";
import {
  ProductContainer,
  ProductImage,
  ProductInfo,
  ProductTitle, Price, SoldTag,
  ProductStats, TimeStamp,
  StatsGroup,
  StatItem,
  BottomActionBar,
  ActionButton,
  LikeButton,
  ContentWrapper
} from './ProductDetail.styled'
import MoreMenu from "../../components/common/modal/MoreMenu";
import { formatPostDate } from "../../utils/formatter/dateFormatter";
import "react-toastify/dist/ReactToastify.css";
import SkeletonWrapper from "../../components/common/SkeletonWrapper";
import { useToastStore } from "../../contexts/useToastStore";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [detailLoading,setDetailLoading] = useState(true);
  const [detailerror,setDetailError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const currentUser = useAuthStore((s) => s.user);
  const {setToast} = useToastStore()

  // 헤더 설정
  useEffect(() => {
    if (!product) return;

    setHeaderConfig({
      show: true,
      type: "productDetail",
      pageTitle: "상품 상세",
      onBackClick: () => navigate(`/profile`),
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
  }, [product]);

  useEffect(()=>{
    if(!product) return;
    setDetailLoading(false)
  },[product])

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        return;
      }

      try {
        const productData = await fetchProductDetail(id);

        if (
          !productData.itemImage ||
          productData.itemImage.includes("undefined")
        ) {
          console.warn("유효하지 않은 이미지 URL");
          productData.itemImage = "/img/basic-img.png"; // 기본 이미지
        }

        setProduct(productData);

      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
        setDetailError(true)
        if (error instanceof Error) {
          alert(error.message);
        }

        setProduct(null);
      }
    };

    loadProduct();
  }, [id]);


  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!product) return;

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
    setToast("준비중입니다!😇")
  };

  // 구매하기
  const handlePurchase = () => {

    if(!product) return
    if (!product.link) return;
    window.open(product.link, "_blank");
  };

  // 상품 삭제
  const handleDelete = async () => {
    if (!product || !id) return;

    try {
      await deleteProduct(id);
      setToast("상품이 삭제되었습니다😎",()=>{navigate("/profile")})
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

  if(product) {
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
          {product.author.accountname === currentUser?.accountname ? (
            // 내 상품
            <>
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
              <ActionButton
                $variant="chatting"
                onClick={handleChatStart}
                disabled={product.status === "sold"}
              >
                대화 중인 채팅 <span>{0}</span>
              </ActionButton>
            </>
          ) : (
            // 다른 사용자의 상품
            <>
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
            </>
          )}
        </BottomActionBar>
      </>
    )
  }
  if(!product) {
    return (
      <>
      {detailLoading && (
        <>
          <ContentWrapper>
            <ProductContainer>
              <SkeletonWrapper height={300}/>
            </ProductContainer>
            <div style={{ marginTop: '15px' }}>
              <SkeletonWrapper width={200} height={18} />
              <SkeletonWrapper width={350} height={18} marginTop={12}/>
            </div>

            <SkeletonWrapper width={100} height={18} marginTop={20}/>
          </ContentWrapper>
        </>
        )}
      {detailerror && (
        '상품을 찾을 수 없어요!'
      )}
      </>
    )
  }
}
