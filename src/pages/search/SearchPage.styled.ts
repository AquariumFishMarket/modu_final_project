import styled from "styled-components";

export const SearchSection = styled.section`
  max-height: calc(100vh - 60px); /* 헤더 높이 제외 */
  overflow-y: auto;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const EmptyResultSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const LoadingSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SearchText = styled.p`
  font-size: var(--font-size-md);
  color: var(--color-gray-dark);
`;
