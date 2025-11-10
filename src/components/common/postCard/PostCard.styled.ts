import styled from "styled-components";

export const PostCardContainer = styled.article`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 24px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  overflow: hidden;
`;

export const PostContent = styled.div`
  padding-left: 54px;

  /* @media (min-width: 768px) {
    padding-left: 5.4rem;
    padding-right: 0;
  } */
`;

export const PostMain = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin: 0;
  border: none;
  padding: 0 1.6rem 0 0;

  figcaption {
    line-height: 1.8rem;
    font-size: 1.4rem;
  }

  img {
    width: 30.4rem;
    height: 22.8rem;
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
      width: 100%;
      max-width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
    }
  }
`;

export const PostFooter = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1.2rem 1.6rem 0 0;

  @media (min-width: 768px) {
    padding: 1.2rem 0 0 0;
  }
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
  font-size: var(--font-size-md);
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary-600);
  }

  &:first-child:hover {
    color: var(--color-error);
  }

  img {
    width: 2rem;
    height: 2rem;
  }
`;

export const PostTime = styled.time`
  font-size: var(--font-size-md);
  color: var(--color-gray-dark);
`;
