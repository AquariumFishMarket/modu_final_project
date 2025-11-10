import styled from "styled-components"
import ProfileImg from "../../components/common/ProfileImg"
import React from "react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const ContentsWrapper = styled.section<{$translateX:number}>`
    position: relative;
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
    translate: all 0.2s;
    transform: translateX(${(props)=>props.$translateX}px)
`
const ImageContainer = styled.div`
    position: relative;
`
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
`
const TextContainer = styled.div`
    width: calc(100% - 55px);
    p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /* 표시할 최대 줄 수 */
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
const UserName = styled.p`
    font-size: var(--font-size-md);
    font-weight: 700;
    margin-bottom: 7px;
`
const ChatMessage = styled.p`
    width: 88%;
    font-size: var(--font-size-sm);
    color: var(--color-gray-dark);
`
const Date = styled.p`
    position: absolute;
    bottom: 4px;
    right: 0;
    font-size:var(--font-size-xs);
    color: var(--color-gray-medium)
`
const DeleteBtn = styled.div`
    width: 100px;
    height: 100px;
    > img {
        width: 24px;
        height: 24px;
    }
`

interface ChatData {
    id: number;
    imgSrc: string;
    username: string;
    message: string;
    date: string;
}


export default function ChatItem({id,imgSrc,username,message,date}:ChatData){
    const navigate = useNavigate();
    const startXRef = useRef(0);
    const startTransRef = useRef(0);
    const currentXRef = useRef(0);
    const isDraggingRef = useRef(true);
    const hasDraggedRef = useRef(false);
    const [boxTrans,setBoxTrans] = useState<number>(0)

    const DRAG_THRESHOLD = 5;
    const MAX_SWIPE = -100;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        startXRef.current = e.clientX;
        startTransRef.current = currentXRef.current;
        hasDraggedRef.current = false; // 초기화
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e:MouseEvent) => {
        const deltaX  = e.clientX - startXRef.current;

        if (Math.abs(deltaX) > DRAG_THRESHOLD) {
            isDraggingRef.current = true;
            hasDraggedRef.current = true; // 초기화
        }

        if (isDraggingRef.current) {
            let newTrans = startTransRef.current + deltaX;
            newTrans = Math.max(MAX_SWIPE, Math.min(0, newTrans));
            currentXRef.current = newTrans;
            setBoxTrans(newTrans);
        }
    }

    const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // 스와이프 거리에 따라 삭제 버튼 보여줄지 결정
        if (isDraggingRef.current) {
            if (currentXRef.current < -50) {
                // 절반 이상 스와이프하면 삭제 버튼 고정
                setBoxTrans(MAX_SWIPE);
                currentXRef.current = MAX_SWIPE;
            } else {
                // 아니면 원위치
                setBoxTrans(0);
                currentXRef.current = 0;
            }
        }

        isDraggingRef.current = false;
    }

    const handleClick = (e: React.MouseEvent) => {
        // 드래그가 아닐 때만 클릭 이벤트 처리
        if (hasDraggedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        navigate(`/chat-room/${id}`)
    }

    return(
        <ContentsWrapper
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        $translateX={boxTrans}
        >
            <ImageContainer>
                <ProfileImg thumbimg={false}
                    width={42}
                    imgSrc={imgSrc}
                />
                <Alert />
            </ImageContainer>
            <TextContainer>
                <UserName>{username}</UserName>
                <ChatMessage>{message}</ChatMessage>
            </TextContainer>
            <Date>{date}</Date>
        </ContentsWrapper>
    )
}