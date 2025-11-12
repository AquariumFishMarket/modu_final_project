import styled from "styled-components";

// 플로팅 버튼
export const FloatingButton = styled.button`
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  width: 7rem;
  height: 7rem;
  border: none;
  background: #ffffff;
  padding: 0;
  cursor: pointer;
  z-index: 1000;
  border-radius: 50%;
  box-shadow: 0 4px 12px var(--color-primary-700);
  transition: box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 85%;
    height: 85%;
    object-fit: contain;
    animation: swimFloat 2.5s infinite ease-in-out;
  }

  @keyframes swimFloat {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    25% {
      transform: translateY(-0.6rem) scale(1.02);
    }
    50% {
      transform: translateY(0) scale(1);
    }
    75% {
      transform: translateY(0.4rem) scale(0.98);
    }
  }

  &:hover {
    box-shadow: 0 8px 16px var(--color-primary-900);

    img {
      animation: swimHover 1.5s infinite ease-in-out;
    }
  }

  @keyframes swimHover {
    0%,
    100% {
      transform: translateY(0) scale(1.05);
    }
    50% {
      transform: translateY(-0.8rem) scale(1.08);
    }
  }

  &:active img {
    animation: none;
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    bottom: 8rem;
    right: 2.5rem;
    width: 6rem;
    height: 6rem;
  }

  @media (max-width: 480px) {
    bottom: 7rem;
    right: 1.5rem;
    width: 5rem;
    height: 5rem;
  }
`;

// 모달 오버레이
export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// 모달 컨테이너 (우측 슬라이드)
export const ModalContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 35rem;
  max-width: 90vw;
  height: 100vh;
  background-color: #fafafa;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  z-index: 1002;
  display: flex;
  flex-direction: column;
  transform: ${(props) =>
    props.$isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    width: 100vw;
    max-width: 100vw;
  }

  @media (max-width: 480px) {
    width: 100vw;
  }
`;

// 모달 헤더
export const ModalHeader = styled.div`
  padding: 2rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-primary-600);
  color: #ffffff;
  box-shadow: 0 2px 8px var(--color-primary-900);

  @media (max-width: 480px) {
    padding: 1.5rem 2rem;
  }
`;

export const ModalTitle = styled.h2`
  font-size: var(--font-size-xl);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: var(--font-size-lg);
  }
`;

export const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #ffffff;
  font-size: var(--font-size-2xl);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
  width: 2rem;
  height: 2rem;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1.3);
  }
`;

// 모달 바디
export const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fafafa;
`;

export const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-primary-600);
    border-radius: 0.25rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary-900);
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const ModalFooter = styled.div`
  border-top: 0.0625rem solid var(--color-gray-medium);
  background-color: #ffffff;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 1rem 1.5rem;
  }
`;
