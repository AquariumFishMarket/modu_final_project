import styled from "styled-components";

export const ProductSection = styled.section<{ $isLastSection?: boolean }>`
  width: calc(100% + 3rem);
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  background-color: #ffffff;
  /* margin-bottom: ${(props) => (props.$isLastSection ? "0" : "0.6rem")}; */
  border-bottom: ${(props) =>
    props.$isLastSection ? "none" : "6px solid var(--color-gray-light)"};
  padding: 2rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

export const ProductTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: bold;
`;

export const ProductListContainer = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  user-select: none;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 숨김 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

export const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-0.2rem);
  }
`;

export const ProductImageBox = styled.div`
  width: 14rem;
  height: 9rem;
  border-radius: 0.8rem;
  box-shadow: inset 0 0 0 0.5px var(--color-gray-medium);
  overflow: hidden;
  background-color: var(--color-gray-light);
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const ProductInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const ProductName = styled.h3`
  font-size: var(--font-size-md);
  font-weight: 500;
`;

export const ProductPrice = styled.p`
  color: var(--color-primary-600);
  font-weight: bold;
`;

export const EmptyMessage = styled.p`
  color: var(--color-gray-500);
  text-align: center;
  padding: 2rem 0;
`;

export const LoadingMessage = styled.p`
  color: var(--color-gray-500);
  text-align: center;
  padding: 2rem 0;
`;

export const ErrorMessage = styled.p`
  color: var(--color-error);
  text-align: center;
  padding: 2rem 0;
`;
