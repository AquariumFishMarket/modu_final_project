import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import ChatContent from "./ChatContent"

export default function ChatList() {
    const navigate = useNavigate();
    const chatRoom = [
        {id: 1, name: ''},
        {id: 2, name: ''}
    ]
    return(
        <>
            {chatRoom.map((room)=>(
                <ChatContent id={room.id} key={room.id}
                onClick={() => navigate(`/chat-room/${room.id}`)}
                />
            ))}
        </>
    )
}