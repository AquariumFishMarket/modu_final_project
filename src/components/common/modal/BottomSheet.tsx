import React, { useEffect } from "react";
import { createPortal } from "react-dom"; // LayoutContainer -> overflow-y: hidden 피하기 위해
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import styled from "styled-components";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 10000;
`;

const SheetContainer = styled(motion.div)`
  background: white;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 600px;
  min-height: 92px;
  max-height: 70vh;
  overflow: hidden;
  touch-action: pan-y;
  position: relative;
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background-color: #ddd;
  border-radius: 2px;
  margin: 12px auto 8px;
  cursor: grab;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }
`;

const Content = styled.div`
  overflow-y: auto;
  max-height: calc(70vh - 32px);
`;

export const SheetItem = styled.button`
  width: 100%;
  padding: 20px;
  border: none;
  background: none;
  text-align: left;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  &:first-child {
    border-radius: 20px 20px 0 0;
  }

  &:last-child {
    border-bottom: none;
  }

  &.danger {
    color: var(--color-error);
  }
`;

// 애니메이션 variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sheetVariants = {
  hidden: {
    y: "100%",
    transition: { duration: 0.3 },
  },
  visible: {
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function BottomSheet({
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  // 배경 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 드래그로 닫기
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100; // 100px 이상 드래그하면 닫기
    const velocity = info.velocity.y; // 드래그 속도

    if (info.offset.y > threshold || velocity > 500) {
      onClose();
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // 배경 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Portal을 사용해서 document.body에 직접 렌더링
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          <SheetContainer
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag="y"
            dragConstraints={{ top: 0 }} // 위로는 드래그 불가
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
          >
            <DragHandle />
            <Content>{children}</Content>
          </SheetContainer>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body // document.body에 직접 렌더링
  );
}
