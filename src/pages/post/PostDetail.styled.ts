import styled from "styled-components";

export const PostDetailContainer = styled.section`
  max-width: 100%;
  margin: 0 auto;
  background: white;
  /* min-height: 100vh; */
`;

export const CommentsSection = styled.section`
  border-top: 1px solid var(--color-gray-medium);
  margin: 0 -16px;
  padding: 20px 16px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;
