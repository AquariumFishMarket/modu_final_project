import styled from "styled-components";

export const EmptyFeedSection = styled.section`
  margin-top: 22rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  text-align: center;
`;

export const LogoImage = styled.img`
  width: 100px;
  height: 100px;
`;

export const FeedSection = styled.section`
  /* 추가 스타일 */
`;

export const FeedItemWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const LoadingText = styled.p`
  text-align: center;
`;

export const EndMessageText = styled.p`
  text-align: center;
  color: var(--color-gray-dark);
`;

export const InitialLoadingSection = styled.section`
  text-align: center;
  margin-top: 22rem;
`;
