import styled from "styled-components";

export const ProductContainer = styled.section`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

export const ProductTitle = styled.h3`
  display: inline-block;
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: black;
`;

export const Price = styled.p`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
`;

export const SoldTag = styled.span`
  display: inline-block;
  color: var(--color-gray-semi-dark);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-right: 5px;
`;

export const ProductStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 30px;
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  border-bottom: 1px solid var(--color-gray-medium);
`;

export const TimeStamp = styled.span`
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
`;

export const StatsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const BottomActionBar = styled.div`
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

export const ActionButton = styled.button<{
  $variant: "chat" | "buy" | "chatting";
  $disabled?: boolean;
}>`
  flex: 1;
  height: 48px;
  border-radius: 8px;
  background-color: var(--color-gray-light);
  font-size: var(--font-size-md);
  font-weight: 500;
  transition: all 0.2s ease;

  ${(props) =>
    props.$variant === "chat"
      ? `
      background: var(--color-primary-600);
      color: white;
      `
      : props.$variant === "chatting"
      ? `
        background: rgba(41, 48, 56, 1);
        color: white;

        span {
            font-weight: 700;
          }
      `
      : `
        background: var(--color-gray-light);
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

export const LikeButton = styled.button<{ $isLiked: boolean }>`
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

export const ContentWrapper = styled.div`
  padding-bottom: 80px; /* 하단 바 높이만큼 여백 */
`;