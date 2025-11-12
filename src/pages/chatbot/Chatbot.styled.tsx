import styled from "styled-components";

export const ChatbotContainer = styled.div`
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 1rem;
`;

// 퀵 메뉴 래퍼
export const QuickMenuWrapper = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

// 퀵 버튼
export const QuickButton = styled.button`
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: var(--font-size-md);
  border: none;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
  line-height: 1.6;
  text-align: center;
  color: #333;

  &:hover {
    background-color: #f8f9fb;
    box-shadow: 0 0.25rem 0.75rem var(--color-primary-900);
    transform: translateY(-0.125rem);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: var(--font-size-sm);
  }
`;

// FAQ 패널
export const FaqPanel = styled.div`
  margin-bottom: 1rem;
  border-radius: 1rem;
  padding: 1.25rem;
  background-color: white;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.08);
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 0.75rem;
  }
`;

export const FaqHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 0.0625rem solid var(--color-gray-light);
`;

export const FaqTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin: 0;
  color: var(--color-primary-600);
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: var(--font-size-md);
  }
`;

export const CloseButton = styled.button`
  font-size: var(--font-size-sm);
  padding: 0.375rem 0.75rem;
  background: var(--color-gray-light);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: var(--color-gray-dark);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primary-500);
    color: white;
  }
`;

// FAQ 그리드
export const FaqGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

// 카테고리 카드
export const CategoryCard = styled.div`
  border: 0.0625rem solid var(--color-gray-light);
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: #fafafa;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    box-shadow: 0 0.125rem 0.5rem var(--color-primary-900);
    border-color: var(--color-primary-600);
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const CategoryTitle = styled.div`
  font-size: var(--font-size-md);
  margin-bottom: 0.75rem;
  color: var(--color-primary-600);
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: var(--font-size-sm);
  }
`;

export const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const CategoryItem = styled.li``;

// 카테고리 버튼
export const CategoryButton = styled.button`
  text-align: left;
  font-size: var(--font-size-sm);
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  padding: 0.25rem 0;
  width: 100%;
  transition: all 0.2s ease;
  line-height: 1.6;

  &:hover {
    color: var(--color-primary-600);
    padding-left: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
  }
`;

export const PhoneNumber = styled.span`
  color: var(--color-primary-600);
`;

export const FaqFooter = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 0.0625rem solid var(--color-gray-light);
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
  text-align: center;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
  }
`;

// 채팅 박스 래퍼
export const ChatboxWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    border-radius: 0.75rem;
  }
`;

// 메시지 영역
export const MessagesArea = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: #fafafa;

  &::-webkit-scrollbar {
    width: 0.375rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-primary-800);
    border-radius: 0.25rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary-800);
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.5rem;
  }
`;

// 메시지 래퍼
export const MessageWrapper = styled.div<{ $isBot: boolean }>`
  max-width: 80%;
  align-self: ${(props) => (props.$isBot ? "flex-start" : "flex-end")};
  display: flex;
  flex-direction: column;
  animation: messageSlideIn 0.3s ease-out;

  @keyframes messageSlideIn {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    max-width: 85%;
  }
`;

// 메시지 말풍선
export const MessageBubble = styled.div<{ $isBot: boolean }>`
  padding: 0.875rem 1rem;
  border-radius: ${(props) =>
    props.$isBot ? "0.125rem 1rem 1rem 1rem" : "1rem 0.125rem 1rem 1rem"};
  font-size: var(--font-size-md);
  white-space: pre-wrap;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
  background-color: ${(props) => (props.$isBot ? "white" : "#e9f0ff")};
  color: #333;
  line-height: 1.6;
  word-break: keep-all;

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: var(--font-size-sm);
  }
`;

// 메시지 액션 (자세히 보기 등)
export const MessageActions = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
`;

// 자세히 보기 버튼
export const DetailButton = styled.button`
  font-size: var(--font-size-sm);
  color: var(--color-primary-600);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f4ff;
  }

  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
  }
`;

// 퀵 답변 래퍼
export const QuickRepliesWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// 퀵 답변 버튼
export const QuickReplyButton = styled.button`
  font-size: var(--font-size-sm);
  padding: 0.375rem 0.75rem;
  border: 0.0625rem solid var(--color-primary-600);
  border-radius: 9999px;
  background-color: white;
  color: var(--color-primary-600);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-primary-600);
    color: white;
  }

  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
    padding: 0.25rem 0.5rem;
  }
`;

// 입력 영역
export const InputArea = styled.div`
  padding: 1rem;
  border-top: 0.0625rem solid var(--color-gray-light);
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.5rem;
  }
`;

// 입력 필드
export const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border-radius: 1.5rem;
  background-color: #f8f9fb;
  border: 0.0625rem solid transparent;
  outline: none;
  font-size: var(--font-size-md);
  transition: all 0.2s ease;
  line-height: 1.6;

  &::placeholder {
    color: var(--color-gray-semi-dark);
  }

  &:focus {
    background-color: white;
    border-color: var(--color-primary-600);
    box-shadow: 0 0 0 0.1875rem var(--color-primary-900);
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: var(--font-size-sm);
  }
`;

// 전송 버튼
export const SendButton = styled.button`
  padding: 0.875rem 1.25rem;
  border-radius: 1.5rem;
  background-color: var(--color-primary-600);
  color: white;
  font-size: var(--font-size-md);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0.25rem 0.75rem var(--color-primary-800);

  &:hover {
    background-color: var(--color-primary-700);
    box-shadow: 0 0.375rem 1rem var(--color-primary-900);
    transform: translateY(-0.0625rem);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: var(--color-primary-400);
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: var(--font-size-sm);
  }
`;

// 가이드 섹션
export const GuideSection = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: var(--font-size-md);
  padding: 1.25rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.08);

  @media (max-width: 480px) {
    padding: 1rem;
    margin-top: 1rem;
  }
`;

export const GuideTitle = styled.h2`
  font-size: var(--font-size-lg);
  margin: 0;
  color: var(--color-primary-600);
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: var(--font-size-md);
  }
`;

export const GuideHighlight = styled.span`
  color: var(--color-primary-600);
`;

export const GuideList = styled.ol`
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #555;

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding-left: 1.25rem;
  }
`;

export const GuideItem = styled.li`
  line-height: 1.7;
  font-size: var(--font-size-sm);

  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
    line-height: 1.6;
  }
`;
