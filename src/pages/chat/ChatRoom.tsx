import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProfileImg from "../../components/common/ProfileImg";
import TextField from "../../components/common/TextField";
import ImageUpButton from "../../components/common/imageUpload/UploadButton";
import ImageContainer from "../../components/common/imageUpload/ImageContainer";
import DefaultButton from "../../components/common/buttons/Button";

import styled from "styled-components";
import { pusher } from "../../App";

const ChatContainer = styled.section`
  position: relative;
  max-height: calc(100% - 20px);
  overflow-y: auto;
`;
const DefaultChat = styled.div`
  display: flex;
  margin-bottom: 9px;
`;
const DefaultChatMessage = styled.div`
  max-width: calc(100% - 90px);
  width: fit-content;
  margin: 0 6px 0 12px;
  padding: 12px;
  border-radius: 10px;
  border-top-left-radius: 0;
`;
const YourChat = styled(DefaultChat)``;

const YourChatMessage = styled(DefaultChatMessage)`
  background: #fff;
  border: 1px solid var(--color-gray-semi-dark);
  > p {
    font-size: var(--font-size-md);
    line-height: 1.4;
  }
  > img {
    max-width: 100%;
  }
`;
const YourTime = styled.div`
  font-size: 1rem;
  align-self: end;
  color: var(--color-gray-dark);
`;
const MyChat = styled(DefaultChat)`
  justify-content: end;
`;
const MyChatMessage = styled(DefaultChatMessage)`
  background: var(--color-primary-600);
  border-top-left-radius: 10px;
  border-top-right-radius: 0;
  > p {
    color: #fff;
  }
`;
const MyTime = styled.div`
  font-size: 1rem;
  align-self: end;
  color: var(--color-gray-dark);
`;
const ImageContainerWRapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  max-height: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 101;
`;
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 100;
`;

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  type: "text" | "image" | "system";
  timestamp: number;
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzzPfbfdpUEbR5QPIfDS0Z8Yl5a_keypTw-HvCnK1CnUYOUbd2f4wdhkglQxMXsZvTDAA/exec";


export default function ChatRoom() {
  const { roomId } = useParams();
  const [imgArr, setImgArr] = useState<File[]>([]);
  const [deleteIndex, setDeleteIdx] = useState<number | undefined>();
  const [imgModalState, setImgModalState] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const channel = pusher.subscribe(`chat-${roomId}`);

    channel.bind('message', (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe(`chat-${roomId}`);
    };
  }, [roomId]);


  // 이미지 삭제 처리
  useEffect(() => {
    setImgArr((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIdx(undefined);
  }, [deleteIndex]);

  // 이미지 모달 상태
  useEffect(() => {
    if (imgArr.length > 0) {
      setImgModalState(true);
    } else {
      setImgModalState(false);
    }
  }, [imgArr]);

  //이미지 전송 함수
  const handleSubmitImage = () => {
    if (imgArr.length === 0) return;

    const newMessages = imgArr.map(img => ({
      id: (Date.now() + Math.random()).toString(),
      userId: "me",
      username: "나",
      type: "image",
      content: URL.createObjectURL(img),
      timestamp: Date.now(),
    }));

    // 로컬 state에 추가
    setMessages(prev => [...prev, ...newMessages as ChatMessage[]]);
    handleClose();

    // Apps Script 호출 (Pusher로 브로드캐스트)
    newMessages.forEach(msg => {
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, message: msg }),
      }).catch(err => console.error("이미지 전송 실패", err));
    });
  };

  //텍스트 전송 함수
  const handleSendText = (
    text: string,
    refObj: React.RefObject<HTMLTextAreaElement | null>
  ) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: "me",
      username: "나",
      content: text,
      type: "text",
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);

    if (refObj.current) refObj.current.value = "";

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, message: newMessage }),
    }).catch(err => console.error("텍스트 전송 실패", err));
  };

  const handleClose = () => {
    setImgModalState(false);
    setImgArr([]);
  };

  return (
    <>
      <ChatContainer>
        <h2 className="sr-only">ooo님의 채팅룸</h2>
        {messages.map(msg => (
          msg.userId === "me" ? (
            <MyChat key={msg.id}>
              <MyTime>
                <p style={{ marginBottom: "4px" }}>안읽음</p>
                <p>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </MyTime>
              <MyChatMessage>
                {msg.type === "text" ? <p>{msg.content}</p> : <img src={msg.content} alt="" style={{ maxWidth: '100%' }} />}
              </MyChatMessage>
            </MyChat>
          ) : (
            <YourChat key={msg.id}>
              <ProfileImg thumbimg={false} width={42} />
              <YourChatMessage>
                {msg.type === "text" ? <p>{msg.content}</p> : <img src={msg.content} style={{ maxWidth: '100%' }} />}
              </YourChatMessage>
              <YourTime>
                <p>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </YourTime>
            </YourChat>
          )
        ))}
      </ChatContainer>

      {imgModalState && (
        <>
          <Background></Background>
          <ImageContainerWRapper>
            <ImageContainer imgArr={imgArr} setDeleteIdx={setDeleteIdx} />
            <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
              <div style={{ flexBasis: "50%" }}>
                <DefaultButton
                  height="medium"
                  text="전송하기"
                  onClick={handleSubmitImage}
                />
              </div>
              <div style={{ flexBasis: "50%" }}>
                <DefaultButton
                  height="medium"
                  text="닫기"
                  variant="secondary"
                  onClick={handleClose}
                />
              </div>
            </div>
          </ImageContainerWRapper>
        </>
      )}

      <TextField
        left={
          <ImageUpButton
            multiple={true}
            colortype="gray"
            size="small"
            imgArr={imgArr}
            setImgArr={setImgArr}
          />
        }
        placeholder="메시지 입력하기.."
        onClick={handleSendText}
      ></TextField>
    </>
  );
}
