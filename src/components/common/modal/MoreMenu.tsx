import React, { useState } from "react";
import styled from "styled-components";
import BottomSheet, { SheetItem } from "./BottomSheet";
import AlertModal from "./AlertModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

interface MoreMenuProps {
  type: "profile" | "post" | "comment" | "chat" | "chatList" | "product";
  size?: "sm" | "md" | "lg";
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  onLeave?: () => void;
  onLogout?: () => void;
  onSettings?: () => void;
  onMarkAsSold?: () => void; // 상품 판매완료 함수 추가!
}

const getIconSrc = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "/img/s-icon-more-vertical.svg";
    case "md":
    case "lg":
      return "/img/icon-more-vertical.svg";
  }
};

const getIconSize = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "18px"; // 게시글 더보기
    case "md":
      return "20px"; // 댓글 더보기
    case "lg":
      return "24px"; // 앱 더보기
    default:
      return "24px";
  }
};

const MoreButton = styled.button<{ $size: "sm" | "md" | "lg" }>`
  background: none;
  border: none;
  outline: none;
  /* padding: 8px; */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: ${(props) => getIconSize(props.$size)};
    height: ${(props) => getIconSize(props.$size)};
  }
`;

export default function MoreMenu({
  type,
  size = "lg",
  onEdit,
  onDelete,
  onReport,
  onLeave,
  onLogout: onLogoutProp,
  onSettings,
  onMarkAsSold,
}: MoreMenuProps) {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [alertType, setAlertType] = useState<
    "delete" | "logout" | "sold" | null
  >(null);
  const { logout } = useAuth();

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
    console.log("삭제 버튼 클릭, 모달 오픈");
  };

  const handleLogout = () => {
    closeSheet();
    setAlertType("logout");
    console.log("로그아웃?");
  };

  const handleMarkAsSold = () => {
    closeSheet();
    setAlertType("sold");
    console.log("판매완료?");
  };

  // 실제 로그아웃 처리 함수
  const performLogout = () => {
    logout();
    onLogoutProp?.();

    // (replace: true로 뒤로가기 방지)
    navigate("/login/email", { replace: true });
  };

  return (
    <>
      <MoreButton $size={size} onClick={openSheet}>
        <img src={getIconSrc(size)} alt="더보기" />
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
            <SheetItem onClick={handleLogout}>로그아웃</SheetItem>
          </>
        )}

        {type === "product" && (
          <>
            <SheetItem
              onClick={() => {
                onEdit?.();
                closeSheet();
              }}
            >
              수정
            </SheetItem>
            <SheetItem onClick={handleDelete}>삭제</SheetItem>
            <SheetItem onClick={handleMarkAsSold}>판매 완료</SheetItem>
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
            <SheetItem onClick={handleDelete}>삭제</SheetItem>
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
          logout: performLogout,
          sold: onMarkAsSold,
        }}
      />
    </>
  );
}
