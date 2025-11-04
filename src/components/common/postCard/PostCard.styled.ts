import styled from "styled-components";

export const PostCardContainer = styled.article`
  max-width: 35.8rem;
  margin: 0 auto;
  margin-bottom: 2.4rem;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  overflow: hidden;
`;

export const PostContent = styled.div`
  padding-left: 0;
`;

export const PostMain = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin: 0;
  border: none;
  padding-left: 5.4rem;

  figcaption {
    padding-right: 1.6rem;
  }

  img {
    max-width: 100%;
    width: 30.4rem;
    height: auto;
    aspect-ratio: 304 / 228;
    object-fit: cover;
    border: 0.5px solid #dbdbdb;
    border-radius: 1rem;
  }
`;

export const PostFooter = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding-top: 1.2rem;
  padding-left: 5.4rem;
  padding-right: 1.6rem;
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