import { Link } from "react-router-dom"
import ChatContent from "./ChatContent"

const chatRoom = [
    {
        id: 1,
        imgSrc:'..',
        username: '잉어킹',
        message: '살려주세요 잡아먹지마세요',
        date: '2025.12.02'
    },
    {
        id: 2,
        imgSrc:'..',
        username: '갸라도스',
        message: '매운탕입니다',
        date: '2025.08.19'
    },
]

export default function ChatList() {

    return(
        <>
            {chatRoom.map((room)=>(
                <Link key={room.id} to={`/chat-room/${room.id}`} style={{ color: '#000' }}>
                    <ChatContent id={room.id}
                    imgSrc={room.imgSrc}
                    username={room.username}
                    message={room.message}
                    date={room.date}
                    />
                </Link>
            ))}
        </>
    )
}