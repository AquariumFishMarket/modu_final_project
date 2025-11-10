import { useState } from "react";
import { Link } from "react-router-dom"
import ChatItems from "./ChatItem";

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
  const [chats, setChats] = useState(chatRoom);
    const [draggingId,setDraggingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    setChats((s) => s.filter((c) => c.id !== id));
  };

    return(
        <>
            {chats.map((room)=>(
                    <ChatItems key={room.id} id={room.id}
                    imgSrc={room.imgSrc}
                    username={room.username}
                    message={room.message}
                    date={room.date}
                    />
            ))}
            {/* {chats.map((room)=>(
                <Link key={room.id}
                to={`/chat-room/${room.id}`}
                style={{ color: '#000' }}
                onClick={(e) => {
                    if (draggingId === room.id) e.preventDefault()
                }}
                >
                    <ChatItems id={room.id}
                    imgSrc={room.imgSrc}
                    username={room.username}
                    message={room.message}
                    date={room.date}
                    />
                </Link>
            ))} */}
        </>
    )
}