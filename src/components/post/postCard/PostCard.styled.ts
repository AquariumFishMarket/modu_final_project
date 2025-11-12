import { color } from "framer-motion";
import styled from "styled-components";

export const PostCardContainer = styled.article`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  overflow: hidden;
  margin-bottom: 20px;

  @media (max-width: 389px) {
    gap: 1.2rem;
  }
`;

export const PostContent = styled.div`
  padding-left: 5.4rem;

  @media (max-width: 320px) {
    padding-left: 0;
  }

  @media (min-width: 768px) {
    padding-left: 5.4rem;
    padding-right: 0;
  }
`;

export const PostMain = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin: 0;
  border: none;
  /* padding: 0 1.6rem 0 0; */
  cursor: pointer; // 상세 보기

  figcaption {
    line-height: 1.8rem;
    font-size: 1.4rem;
  }

  img {
    /* width: 30.4rem;
    height: 22.8rem; */
    width: 100%;
    height: auto;
    min-height: 180px;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border: 1px solid var(--color-gray-medium);
    border-radius: 1rem;
  }

  @media (min-width: 390px) {
    padding: 0;

    /* figcaption {
      font-size: 1.6rem;
      line-height: 2.4rem;
    } */

    img {
      /* width: 100%;
      max-width: 100%;
      height: auto;
      aspect-ratio: 16 / 9; */
      min-height: 220px;
    }
  }
`;

export const PostFooter = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  /* padding: 1.2rem 1.6rem 0 0; */
  padding-top: 12px;

  /* @media (min-width: 768px) {
    padding: 1.2rem 0 0 0;
  } */
`;

export const PostActions = styled.div`
  display: flex;
  gap: 1.6rem;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem;
  margin: -0.4rem;
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  transition: color 0.2s;

  /* &:hover {
    color: var(--color-primary-600);
  }

  &:first-child:hover {
    color: var(--color-error);
  } */

  img {
    width: 2rem;
    height: 2rem;
  }
`;

export const PostTime = styled.time`
  font-size: var(--font-size-xs);
  color: var(--color-gray-dark);
`;

export const HeartLabel = styled.div<{ $liked: boolean }>`
  position: relative;
  font-size: 1rem;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$liked ? "#e2264d" : "transparent")};
  stroke: ${(props) => (props.$liked ? "#e2264d" : "var(--color-gray-dark)")};
  stroke-width: 2px;
  filter: ${(props) => (props.$liked ? "none" : "grayscale(1)")};
  transition: filter 0.5s;

  svg {
    transition: transform 0.3s;
    animation: ${(props) =>
      props.$liked ? "heart 1s cubic-bezier(0.17, 0.89, 0.32, 1.49)" : "none"};
  }

  &::before,
  &::after {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    content: "";
  }

  /* 버블 효과 제거 */
  &::before {
    display: none;
  }

  /* 스파클(막대기) 효과 */
  &::after {
    margin: -0.1875rem;
    width: 0.375rem;
    height: 0.375rem;
    opacity: ${(props) => (props.$liked ? 1 : 0)};
    animation: ${(props) => (props.$liked ? "sparkles 1s ease-out" : "none")};
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

  &:hover {
    filter: ${(props) => (props.$liked ? "none" : "grayscale(0.5)")};
  }
`;
