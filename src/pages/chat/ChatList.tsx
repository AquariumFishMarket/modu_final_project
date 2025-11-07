import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import ChatContent from "./ChatContent"

export default function ChatList() {
    const navigate = useNavigate();
    const chatRoom = [
        {id: 1, imgSrc:'..', username: '잉어킹', message: '살려주세요 잡아먹지마세요', date: '2025.12.02'},
        {id: 2, imgSrc:'..', username: '갸라도스', message: '매운탕입니다', date: '2025.08.19'},
    ]
    return(
        <>
            {chatRoom.map((room)=>(
                <ChatContent id={room.id} key={room.id}
                imgSrc={room.imgSrc}
                username={room.username}
                message={room.message}
                date={room.date}
                onClick={() => navigate(`/chat-room/${room.id}`)}
                />
            ))}
        </>
    )
}