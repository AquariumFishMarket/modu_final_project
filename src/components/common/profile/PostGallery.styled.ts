import styled from "styled-components";

export const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  width: 100%;
  max-width: 39rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const GalleryItem = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: var(--color-gray-light, #f5f5f5);
  cursor: pointer;
  overflow: hidden;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.97);
    transition: transform 0.1s ease;
  }
`;

export const GalleryImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const GalleryPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-light, #f5f5f5);
  color: var(--color-gray-500, #999);
  font-size: var(--font-size-sm);
`;

export const EmptyGalleryMessage = styled.p`
  color: var(--color-gray-500, #999);
  text-align: center;
  padding: 2rem 0;
  grid-column: 1 / -1;
`;
