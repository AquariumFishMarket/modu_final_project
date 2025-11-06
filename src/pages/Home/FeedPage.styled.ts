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
  width: calc(100% + 30px);
  margin-inline: -1.5rem;
  background-color: #ffffff;
`;

export const FeedItemWrapper = styled.div`
  width: 100%;
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
