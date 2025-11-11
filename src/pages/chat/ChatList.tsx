import { useState } from "react";
import ChatItems from "./ChatItem";

interface ChatDataType {
    id: number;
    imgSrc: string;
    username: string;
    message: string;
    date: string;
}

const chatRoom:ChatDataType[] = [
    {
        id: 1,
        imgSrc:'..',
        username: '철갑상어',
        message: '붉은색 베타 분양받고싶어요. 가능한가요?',
        date: '2025.12.02'
    },
    {
        id: 2,
        imgSrc:'..',
        username: 'ggamjang12',
        message: '그럼 저녁 7시에 버드내도서관 앞에서 기다릴게요(_ _)',
        date: '2025.08.19'
    },
    {
        id: 3,
        imgSrc:'..',
        username: '붕어빵',
        message: '물고기 잘보는 동물병원 어딘가요?',
        date: '2025.08.19'
    },
]

export default function ChatList() {
    const [chats, setChats] = useState<ChatDataType[]>(chatRoom);
    const [deleteIdx, setDeleteIdx] = useState<number[]>([]);

    const handleDelete = (id:number) => {
        setDeleteIdx((prev)=>[...prev,id])
        setChats(prev=>prev.filter(c=> ![...deleteIdx,id].includes(c.id)))
    }

    return(
        <>
        {chats.length > 0 &&
            chats.map((room)=>(
                <ChatItems key={room.id} id={room.id}
                imgSrc={room.imgSrc}
                username={room.username}
                message={room.message}
                date={room.date}
                onClick={handleDelete}
                />
            ))
        }
        {chats.length == 0 &&
            (
                <>
                <div style={{
                    width: '100%',
                    height: '300px',
                    backgroundImage: 'url(/img/fish_logo.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                    }}>
                </div>
                <p style={{ textAlign: 'center' }}>대화중인 목록이 없습니다.</p>
                </>
            )
        }
        </>
    )
}