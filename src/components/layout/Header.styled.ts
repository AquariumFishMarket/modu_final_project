import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 600px;
  width: 100%;
  background-color: #fff;
  z-index: 99;
`;

export const Section = styled.section`
  width: 100%;
  height: 4.8rem;
  padding: 1.2rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dbdbdb;
`;

export const SectionCombine = styled.section`
  width: 100%;
  height: 4.8rem;
  padding: 1.2rem 1.6rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-bottom: 1px solid #dbdbdb;
`;

export const Title = styled.h2`
  font-size: var(--font-size-xl);
`;

export const SubTitle = styled.h2``;

export const AllyHiddenTitle = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const IconButton = styled.button`
  margin-inline: 0.1rem;
  border: none;
  background: #fff;
  height: 22px;
`;

export const SearchForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
`;

export const BackButton = styled.button`
  border: none;
  background: #fff;
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  border-radius: 3.2rem;
  padding: 0.7rem 1.6rem;
  background: #f2f2f2;
  color: #000;
`;

export const ChatUserContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
