import styled from "styled-components";

export const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1.6rem;

  @media (max-width: 768px) {
    max-width: 39rem;
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
  background-color: var(--color-gray-light);
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
`;

export const EmptyGalleryMessage = styled.p`
  color: var(--color-gray-500);
  text-align: center;
  padding: 2rem 0;
  grid-column: 1 / -1;
`;

export const MultiImageIndicator = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  width: 2rem;
  height: 2rem;

  &::before {
    content: "";
    display: block;
    width: 2rem;
    height: 2rem;
    background-color: none;
    background-image: url(/img/iccon-img-layers.svg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;
