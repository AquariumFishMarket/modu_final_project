import styled from "styled-components"
import ProfileImg from "../../components/common/ProfileImg"
import React from "react"
import { useRef, useState } from "react"

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
    const startXRef = useRef(0);
    const currentXRef = useRef(0);
    const isDraggingRef = useRef(true);
    const [boxTrans,setBoxTrans] = useState<number>(0)

    const DRAG_THRESHOLD = 3;
    const MAX_SWIPE = -100;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        startXRef.current = e.clientX;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e:MouseEvent) => {
        const deltaX  = e.clientX - startXRef.current;

        if (Math.abs(deltaX) > DRAG_THRESHOLD) {
            isDraggingRef.current = true;
        }

        if (isDraggingRef.current && deltaX < 0) {
            // 왼쪽 드래그만 허용, MAX_SWIPE 이상 안 넘어가도록
            const newTrans = Math.max(deltaX, MAX_SWIPE);
            setBoxTrans(newTrans);
            currentXRef.current = newTrans;
        }
    }

    const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);


        // 스와이프 거리에 따라 삭제 버튼 보여줄지 결정
        if (isDraggingRef.current) {
            if (currentXRef.current < -30) {
                // 절반 이상 스와이프하면 삭제 버튼 고정
                setBoxTrans(MAX_SWIPE);
            } else {
                // 아니면 원위치
                setBoxTrans(0);
            }
        }

        isDraggingRef.current = false;
    }

    const handleClick = () => {
        // 드래그가 아닐 때만 클릭 이벤트 처리
        if (!isDraggingRef.current) {
            console.log('채팅방 클릭');
            // 채팅방 입장 로직
        }
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