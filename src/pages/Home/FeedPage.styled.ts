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
  width: 10rem;
  height: 10rem;
`;

export const FeedSection = styled.section`
  width: calc(100% + 3rem);
  margin-inline: -1.5rem;
  background-color: #ffffff;

  // scroll btn
  height: 100vh;
  overflow-y: auto;
`;

export const FeedItemWrapper = styled.div`
  width: 100%;
  padding: 0 1.5rem;
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
