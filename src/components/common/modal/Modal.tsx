import React from "react";
import styled from "styled-components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  min-width: 300px;
  max-width: 90vw;
`;

export const ModalItem = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: none;
  text-align: left;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }

  &.danger {
    color: #e53e3e;
  }
`;

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>{children}</ModalContent>
    </ModalOverlay>
  );
}
