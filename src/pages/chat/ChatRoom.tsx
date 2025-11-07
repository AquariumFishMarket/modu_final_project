import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProfileImg from "../../components/common/ProfileImg";
import TextField from "../../components/common/TextField";
import ImageUpButton from "../../components/common/imageUpload/UploadButton";
import ImageContainer from "../../components/common/imageUpload/ImageContainer";
import DefaultButton from "../../components/common/Button";

import styled from "styled-components";

const ChatContainer = styled.section`
    position: relative;
    max-height: calc(100% - 20px);
    overflow-y: auto;
`
const DefaultChat = styled.div`
    display: flex;
    margin-bottom: 9px;
`
const DefaultChatMessage = styled.div`
    max-width: calc(100% - 90px);
    width: fit-content;
    margin: 0 6px 0 12px;
    padding: 12px;
    border-radius: 10px;
    border-top-left-radius: 0;
`
const YourChat = styled(DefaultChat)``

const YourChatMessage = styled(DefaultChatMessage)`
    background: #fff;
    border: 1px solid var(--color-gray-semi-dark);
    > p {
        font-size: var(--font-size-md);
        line-height: 1.4
    }
    > img {
        max-width: 100%;
    }
`
const YourTime = styled.div`
    font-size: 1rem;
    align-self: end;
    color: var(--color-gray-dark);
`
const MyChat = styled(DefaultChat)`
    justify-content: end;
`
const MyChatMessage = styled(DefaultChatMessage)`
    background: var(--color-primary-600);
    border-top-left-radius: 10px;
    border-top-right-radius: 0;
    > p {
        color: #fff;
    }
`
const MyTime = styled.div`
    font-size: 1rem;
    align-self: end;
    color: var(--color-gray-dark);
`
const ImageContainerWRapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 99;
    background-color: #fff;
    border-radius: 15px;
    padding: 20px;
    width: 300px;
    max-height: 250px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 101;
`
const Background = styled.div`
    position: fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    background-color: rgba(0,0,0,0.2);
    z-index: 100;
`

interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    content: string;
    type: 'text' | 'image' | 'system';
    timestamp: number;
}

export default function ChatRoom() {
    //채팅 방 번호
    const { roomId } = useParams();
    //소켓 저장
    const socketRef = useRef<WebSocket | null>(null)
    // 이미지 파일 저장 공간
    const [imgArr, setImgArr] = useState<File[]>([])
    // 텍스트 메시지 저장 공간
    const [deleteIndex, setDeleteIdx] = useState<number|undefined>()
    const [imgModalState, setImgModalState] = useState<boolean>(false)

    //soket공간
    const [message, setMessage] = useState<ChatMessage[]>([])
    // useEffect(()=>{
    //     socketRef.current = new WebSocket("ws://example.com/websocket");

    //     socketRef.current.onopen = () => console.log("연결됨");
    //     socketRef.current.onmessage = (event) => {
    //         // const newMessage = JSON.parse(event.data);
    //         // setMessages((prev) => [...prev, newMessage])
    //     }
    //     socketRef.current.onerror = (err) => console.error("오류:", err);
    //     socketRef.current.onclose = () => console.log("연결 종료");

    //     // 컴포넌트 언마운트 시 연결 종료
    //     return () => socketRef.current.close();
    // },[])

    useEffect(()=>{
        setImgArr(prev => prev.filter((_, i) => i !== deleteIndex));
        //초기화
        setDeleteIdx(undefined);
    },[deleteIndex])

    useEffect(()=>{
        if(imgArr.length > 0) {
            setImgModalState(true)
        } else {
            setImgModalState(false)
        }
    },[imgArr])

    //이미지 전송 함수
    const handleSubmitImage = () => {
        //이미지 파일 전송 코드 삽입 위치
        // if(imgArr.length > 0) {
        //     const imageMessages = imgArr.map((img)=>({
        //         type: "image",
        //         fileName: img.name,
        //         timestamp: new Date().toISOString()
        //     }))

        //     socketRef.current?.send(JSON.stringify(imageMessages))

        //     socketRef.current?.onmessage = (event) => {
        //         const data = JSON.parse(event.data);
        //         if (data.type === "ack") {
        //             handleClose(); // 전송 성공 시에만 닫기
        //         }
        //     };
        // }
    }

    //텍스트 전송 함수
    const handleSendText = (text: string, refObj:React.RefObject<HTMLTextAreaElement | null>) => {
        //text 자료 전송 코드 삽입 위치
        console.log(text)
        //전송 후 입력필드 초기화 함수
        if(refObj.current) {
            refObj.current.value = ''
        }
    }

    const handleClose = () => {
        setImgModalState(false)
        setImgArr([])
    }

    return (
        <>
        <ChatContainer>
            <h2 className="sr-only">ooo님의 채팅룸</h2>
            <YourChat>
                <ProfileImg
                    thumbimg={false}
                    width={42}
                />
                <YourChatMessage>
                    <p>
                        어쩌구저쩌구...어쩌구저쩌구..
                        어쩌구저쩌구...어쩌구저쩌구..
                        어쩌구저쩌구...어쩌구저쩌구..
                        어쩌구저쩌구...어쩌구저쩌구..
                        어쩌구저쩌구...어쩌구저쩌구..
                    </p>
                </YourChatMessage>
                <YourTime>
                    <p>12:20</p>
                </YourTime>
            </YourChat>
            <YourChat>
                <ProfileImg
                    thumbimg={false}
                    width={42}
                />
                <YourChatMessage>
                    <p>
                        잉어킹 갸라도스
                    </p>
                </YourChatMessage>
                <YourTime>
                    <p>12:23</p>
                </YourTime>
            </YourChat>
            <YourChat>
                <ProfileImg
                    thumbimg={false}
                    width={42}
                />
                <YourChatMessage>
                    <img src="/img/fishking.png" alt="" />
                </YourChatMessage>
                <YourTime>
                    <p>12:24</p>
                </YourTime>
            </YourChat>
            <MyChat>
                <MyTime>
                    <p style={{ marginBottom: '4px' }}>안읽음</p>
                    <p>12:40</p>
                </MyTime>
                <MyChatMessage>
                    <p>말씀하시라고요</p>
                </MyChatMessage>
            </MyChat>
        </ChatContainer>

        {imgModalState && (
            <>
            <Background></Background>
            <ImageContainerWRapper>
                <ImageContainer
                imgArr={imgArr}
                setDeleteIdx={setDeleteIdx}
                />
                <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                    <div style={{ flexBasis: '50%' }}>
                        <DefaultButton height="medium" text="전송하기" onClick={handleSubmitImage} />
                    </div>
                    <div style={{ flexBasis : '50%' }}>
                        <DefaultButton height="medium" text="닫기" variant="secondary" onClick={handleClose} />
                    </div>
                </div>
            </ImageContainerWRapper>
            </>
        )}

        <TextField
        left={<ImageUpButton
            multiple={true}
            colortype="gray"
            size="small"
            imgArr={imgArr}
            setImgArr={setImgArr}
        />}
        placeholder="메시지 입력하기.."
        onClick={handleSendText}
        ></TextField>
        </>
    )
}