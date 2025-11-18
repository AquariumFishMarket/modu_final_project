import React from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type:
    | "delete"
    | "deleteComment"
    | "logout"
    | "block"
    | "report"
    | "reportPost"
    | "sold"
    | "chatReport"
    | "chatLeave"
    | null;
  onConfirm?: {
    delete?: () => void;
    deleteComment?: () => void;
    logout?: () => void;
    block?: () => void;
    report?: () => void;
    reportPost?: () => void;
    sold?: () => void;
    chatReport?: () => void;
    chatLeave?: () => void;
  };
}

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
  min-height: 110px;
  text-align: center;
  animation: ${modalSlideIn} 0.25s ease-out;
  overflow: hidden;
`;

const Message = styled.p`
  margin: 22px auto;
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1.4;
  white-space: pre-line;
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
        `;
    }
  }}
`;

type AlertConfig = {
  message: React.ReactNode;
  confirmText: string;
  singleButton?: boolean;
};

export default function AlertModal({
  isOpen,
  onClose,
  type,
  onConfirm,
}: AlertModalProps) {
  if (!type || !isOpen) return null;

  const getAlertConfig = (alertType: AlertModalProps["type"]): AlertConfig => {
    switch (alertType) {
      case "delete":
        return {
          message: "게시글을 삭제할까요?",
          confirmText: "삭제",
        };
      case "deleteComment":
        return {
          message: "댓글을 삭제하시겠습니까?",
          confirmText: "삭제",
        };
      case "logout":
        return {
          message: "로그아웃 하시겠어요?",
          confirmText: "로그아웃",
        };
      case "block":
        return {
          message: "이 사용자를 차단할까요?",
          confirmText: "차단",
        };
      case "report":
        return {
          message: "이 게시글을 신고할까요?",
          confirmText: "신고",
        };
      case "reportPost":
        return {
          message: "게시글을 신고하시겠습니까?",
          confirmText: "신고",
        };
      case "sold":
        return {
          message: "판매완료 처리할까요?",
          confirmText: "판매완료",
        };
      case "chatReport":
        return {
          message: (
            <>
              신고가 완료되었습니다.
              <br />
              신속하게 처리하겠습니다.
            </>
          ),
          confirmText: "확인",
          singleButton: true,
        };
      case "chatLeave":
        return {
          message: (
            <>
              채팅방을 나가시겠어요?
              <br />
              나갈 수 없는 채팅방은 제외됩니다.
            </>
          ),
          confirmText: "나가기",
          singleButton: false,
        };
      default:
        return {
          message: "확인하시겠어요?",
          confirmText: "확인",
        };
    }
  };

  const config = getAlertConfig(type);

  const handleConfirm = () => {
    onConfirm?.[type]?.();
    onClose();
  };

  return createPortal(
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Message>{config.message}</Message>
        <ButtonContainer>
          {!config.singleButton && (
            <Button $variant="cancel" onClick={onClose}>
              취소
            </Button>
          )}
          <Button $variant="confirm" onClick={handleConfirm}>
            {config.confirmText}
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
}
