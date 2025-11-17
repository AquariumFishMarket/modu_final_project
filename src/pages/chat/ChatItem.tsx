import styled from "styled-components";
import ProfileImg from "../../components/common/ProfileImg";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ContentsWrapper = styled.section`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  user-select: none;
`;

const Contents = styled.div<{ $boxTrans: number }>`
  position: relative;
  width: 100%;
  transform: translateX(${(props) => props.$boxTrans}px);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: 0.1s ease-in;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Alert = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: var(--color-primary-600);
  border-radius: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
`;

const CheckCircle = styled.button<{ $checked: boolean }>`
  width: 26px;
  height: 26px;
  margin-right: 14px;

  border-radius: 50%;
  border: 2.5px solid var(--color-primary-600);
  background-color: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  outline: none;
  padding: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: 0.15s ease all;

  &::after {
    content: "";
    width: ${(props) => (props.$checked ? "16px" : "0px")};
    height: ${(props) => (props.$checked ? "16px" : "0px")};
    border-radius: 50%;
    background-color: var(--color-primary-600);

    transition: 0.15s ease all;
  }

  &:active {
    transform: scale(0.92);
  }
`;

const TextContainer = styled.div`
  width: calc(100% - 55px);
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }
`;

const UserName = styled.p`
  font-size: var(--font-size-md);
  font-weight: 700;
  margin-bottom: 7px;
`;

const ChatMessage = styled.p`
  width: 88%;
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
`;

const Date = styled.p`
  position: absolute;
  bottom: 4px;
  right: 10px;
  font-size: var(--font-size-xs);
  color: var(--color-gray-medium);
`;

const DeleteBtn = styled.button<{ $boxTrans: number }>`
  transition: 0.1s ease-in;
  width: calc(${(props) => props.$boxTrans}px * -1);
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-error);
  border: none;
  > img {
    width: 24px;
    height: 24px;
  }
`;

interface ChatData {
  id: number;
  imgSrc: string;
  username: string;
  message: string;
  date: string;
  onClick: (id: number) => void;

  showCheck?: boolean;
  checked?: boolean;
  onCheck?: (id: number) => void;
}

export default function ChatItem({
  id,
  imgSrc,
  username,
  message,
  date,
  onClick,
  showCheck = false,
  checked = false,
  onCheck,
}: ChatData) {
  const navigate = useNavigate();
  const startXRef = useRef(0);
  const startTransRef = useRef(0);
  const currentXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const [boxTrans, setBoxTrans] = useState<number>(0);

  const DRAG_THRESHOLD = 5;
  const MAX_SWIPE = -80;

  /* 스와이프 비활성화: 체크모드일 때 return */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showCheck) return;

    startXRef.current = e.clientX;
    startTransRef.current = currentXRef.current;
    hasDraggedRef.current = false;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (showCheck) return;

    const deltaX = e.clientX - startXRef.current;

    if (Math.abs(deltaX) > DRAG_THRESHOLD) {
      isDraggingRef.current = true;
      hasDraggedRef.current = true;
    }

    if (isDraggingRef.current) {
      let newTrans = startTransRef.current + deltaX;
      newTrans = Math.max(MAX_SWIPE, Math.min(0, newTrans));
      currentXRef.current = newTrans;
      setBoxTrans(newTrans);
    }
  };

  const handleMouseUp = () => {
    if (showCheck) return;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (isDraggingRef.current) {
      if (currentXRef.current < -50) {
        setBoxTrans(MAX_SWIPE);
        currentXRef.current = MAX_SWIPE;
      } else {
        setBoxTrans(0);
        currentXRef.current = 0;
      }
    }

    isDraggingRef.current = false;
  };

  /* 편집모드일 때 전체 클릭 → 체크 toggle */
  const handleRowClick = () => {
    if (showCheck) {
      onCheck?.(id);
      return;
    }

    navigate(`/chat-room/${id}`);
  };

  /* 체크모드 진입 시 스와이프 초기화 */
  useEffect(() => {
    if (showCheck) {
      setBoxTrans(0);
      currentXRef.current = 0;
      isDraggingRef.current = false;
      hasDraggedRef.current = false;
    }
  }, [showCheck]);

  return (
    <ContentsWrapper>
      {showCheck && (
        <CheckCircle $checked={checked} onClick={() => onCheck?.(id)} />
      )}

      <Contents
        $boxTrans={boxTrans}
        onMouseDown={showCheck ? undefined : handleMouseDown}
        onClick={handleRowClick}
      >
        <ImageContainer>
          <ProfileImg thumbimg={false} width={42} imgSrc={imgSrc} />
          <Alert />
        </ImageContainer>

        <TextContainer>
          <UserName>{username}</UserName>
          <ChatMessage>{message}</ChatMessage>
        </TextContainer>

        <Date>{date}</Date>
      </Contents>

      {!showCheck && hasDraggedRef.current && (
        <DeleteBtn $boxTrans={boxTrans} onClick={() => onClick(id)}>
          <img src="/img/icon-delete.svg" />
        </DeleteBtn>
      )}
    </ContentsWrapper>
  );
}
