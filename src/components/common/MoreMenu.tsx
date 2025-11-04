import React, { useState } from "react";
import styled from "styled-components";
import BottomSheet, { SheetItem } from "./modal/BottomSheet";
import AlertModal from "./modal/AlertModal";

interface MoreMenuProps {
  // productDetail 추가
  type: "profile" | "post" | "comment" | "chat" | "chatList";
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  onLeave?: () => void;
  onLogout?: () => void;
  onSettings?: () => void;
  className?: string;
}

const MoreButton = styled.button`
  background: none;
  border: none;
  outline: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function MoreMenu({
  type,
  onEdit,
  onDelete,
  onReport,
  onLeave,
  onLogout,
  onSettings,
}: MoreMenuProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [alertType, setAlertType] = useState<"delete" | "logout" | null>(null);

  const openSheet = () => {
    setIsSheetOpen(true);
  };
  const closeSheet = () => {
    setIsSheetOpen(false);
  };
  const closeAlert = () => {
    setAlertType(null);
  };

  const handleDelete = () => {
    closeSheet();
    setAlertType("delete");
    console.log("삭제?");
  };

  const handleLogout = () => {
    closeSheet();
    setAlertType("logout");
    console.log("로그아웃?");
  };

  return (
    <>
      <MoreButton onClick={openSheet}>
        <img src="/img/icon-more-vertical.svg" alt="더보기" />
      </MoreButton>

      <BottomSheet isOpen={isSheetOpen} onClose={closeSheet}>
        {/* 프로필 */}
        {type === "profile" && (
          <>
            <SheetItem
              onClick={() => {
                onSettings?.();
                closeSheet();
              }}
            >
              설정 및 개인정보
            </SheetItem>
            <SheetItem className="danger" onClick={handleLogout}>
              로그아웃
            </SheetItem>
          </>
        )}

        {/* 게시글 */}
        {type === "post" && (
          <>
            <SheetItem
              onClick={() => {
                onEdit?.();
                closeSheet();
              }}
            >
              수정
            </SheetItem>
            <SheetItem className="danger" onClick={handleDelete}>
              삭제
            </SheetItem>
          </>
        )}

        {/* 댓글 */}
        {type === "comment" && (
          <>
            {onEdit && (
              <SheetItem
                onClick={() => {
                  onEdit();
                  closeSheet();
                }}
              >
                수정
              </SheetItem>
            )}
            {onDelete && (
              <SheetItem className="danger" onClick={handleDelete}>
                삭제
              </SheetItem>
            )}
            {onReport && (
              <SheetItem
                onClick={() => {
                  onReport();
                  closeSheet();
                }}
              >
                신고
              </SheetItem>
            )}
          </>
        )}

        {/* 채팅 */}
        {type === "chat" && (
          <>
            <SheetItem
              onClick={() => {
                onLeave?.();
                closeSheet();
              }}
            >
              채팅방 나가기
            </SheetItem>
            <SheetItem
              onClick={() => {
                onReport?.();
                closeSheet();
              }}
            >
              신고
            </SheetItem>
          </>
        )}

        {/* 채팅 목록 */}
        {type === "chatList" && (
          <>
            <SheetItem className="danger" onClick={handleDelete}>
              삭제
            </SheetItem>
          </>
        )}
      </BottomSheet>

      {/* AlertModal이 스스로 내용 관리 */}
      <AlertModal
        isOpen={alertType !== null}
        onClose={closeAlert}
        type={alertType}
        onConfirm={{
          delete: onDelete,
          logout: onLogout,
        }}
      />
    </>
  );
}
