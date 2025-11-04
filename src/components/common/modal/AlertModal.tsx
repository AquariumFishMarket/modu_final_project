import React from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "delete" | "logout" | "block" | "report" | null;
  onConfirm?: {
    delete?: () => void;
    logout?: () => void;
    block?: () => void;
    report?: () => void;
  };
}

const ALERT_CONFIGS = {
  delete: {
    message: "게시글을 삭제할까요?",
    confirmText: "삭제",
    variant: "danger" as const,
  },
  logout: {
    message: "로그아웃 하시겠어요?",
    confirmText: "로그아웃",
    variant: "primary" as const,
  },
  block: {
    message: "이 사용자를 차단할까요?",
    confirmText: "차단",
    variant: "danger" as const,
  },
  report: {
    title: "이 게시글을 신고할까요?",
    message: "부적절한 내용으로 신고됩니다.",
    confirmText: "신고",
    variant: "danger" as const,
  },
  // ... 다른 타입들
};

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const modalSlideIn = keyframes`
  from { 
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 10001; /* BottomSheet(10000)보다 높게 */
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  width: 252px;
  height: 110px;
  text-align: center;
  animation: ${modalSlideIn} 0.25s ease-out;
  overflow: hidden;
`;

const Message = styled.p`
  margin: 22px auto;
  font-size: var(--font-size-lg);
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  border-top: 0.5px solid var(--color-gray-medium);
`;

const Button = styled.button<{ $variant: "confirm" | "cancel" }>`
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 0;
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  background: none;

  /* 취소 버튼 오른쪽 구분선 */
  ${(props) =>
    props.$variant === "cancel" &&
    `
    border-right: 0.5px solid var(--color-gray-medium);
  `}

  ${(props) => {
    switch (props.$variant) {
      case "confirm":
        return `
          color: var(--color-primary-600);
          &:hover {
          background-color: rgba(var(--color-primary-600-rgb), 0.1); 
        }
        `;
      case "cancel":
        return `
          color: black;
          &:hover {  }
        `;
    }
  }}
`;

export default function AlertModal({
  isOpen,
  onClose,
  type,
  onConfirm,
}: AlertModalProps) {
  if (!type || !isOpen) return null;

  const config = ALERT_CONFIGS[type];

  const handleConfirm = () => {
    onConfirm?.[type]?.();
    onClose();
  };

  // Portal을 사용해서 document.body에 직접 렌더링
  return createPortal(
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Message>{config.message}</Message>
        <ButtonContainer>
          <Button $variant="cancel" onClick={onClose}>
            취소
          </Button>
          <Button $variant="confirm" onClick={handleConfirm}>
            {config.confirmText}
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
}
