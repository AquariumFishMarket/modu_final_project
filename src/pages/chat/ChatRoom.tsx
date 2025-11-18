import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileImg from "../../components/common/ProfileImg";
import TextField from "../../components/common/TextField";
import ImageUpButton from "../../components/common/imageUpload/UploadButton";
import ImageContainer from "../../components/common/imageUpload/ImageContainer";
import DefaultButton from "../../components/common/buttons/Button";
import MoreMenu from "../../components/common/modal/MoreMenu";
import { useHeader } from "../../contexts/HeaderContext";
import { mockResponsesByRoom } from "./mockChatData";
import styled from "styled-components";
import { pusher } from "../../App";
import AlertModal from "../../components/common/modal/AlertModal";

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  type: "text" | "image" | "system";
  timestamp: number;
  isRead?: boolean;
}

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
  z-index: 101;
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  max-height: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
const ChatNotice = styled.div`
  width: fit-content;
  margin: 0 auto;
  font-size: var(--font-size-md);
  background-color: #eeeeee;
  padding: 10px 40px;
  border-radius: 500px;
`;

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzzPfbfdpUEbR5QPIfDS0Z8Yl5a_keypTw-HvCnK1CnUYOUbd2f4wdhkglQxMXsZvTDAA/exec";

export default function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();

  const [imgArr, setImgArr] = useState<File[]>([]);
  const [deleteIndex, setDeleteIdx] = useState<number | undefined>();
  const [imgModalState, setImgModalState] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messageRef = useRef<ChatMessage[]>([]);
  const scenarioRef = useRef<number>(0);

  // 미니 얼럿 상태
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"chatReport" | "chatLeave" | null>(
    null
  );

  if (!roomId || !mockResponsesByRoom[roomId])
    return <p>잘못된 채팅방입니다.</p>;

  const chatUsername = mockResponsesByRoom[roomId][0][0].username;

  const openAlert = (type: "chatReport" | "chatLeave") => {
    setAlertType(type);
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
    setAlertType(null);
  };

  /* header 세팅 */
  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "chat",
      userName: chatUsername,
      pageTitle: `${chatUsername}님과의 채팅방`,
      onBackClick: () => navigate(-1),
      rightElement: (
        <MoreMenu
          type="chat"
          size="lg"
          onLeave={() => {
            openAlert("chatLeave");
          }}
          onReport={() => {
            openAlert("chatReport");
          }}
        />
      ),
    });
  }, []);

  /* 메시지 수신 */
  useEffect(() => {
    const channel = pusher.subscribe(`chat-${roomId}`);

    channel.bind("message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe(`chat-${roomId}`);
    };
  }, [roomId]);

  useEffect(() => {
    messageRef.current = messages;
  }, [messages]);

  const handleIncomingMessage = (incoming: ChatMessage) => {
    const updated = messageRef.current.map((msg) =>
      msg.userId === "me" ? { ...msg, isRead: true } : msg
    );
    setMessages([...updated, incoming]);
  };

  /* 자동 응답 시나리오 */
  const sendMockResponse = (roomId: string, step: number) => {
    const scenario = mockResponsesByRoom[roomId][step];
    if (!scenario) return;

    scenario.forEach((ele, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, ele]);
        handleIncomingMessage(ele);
      }, i * 1200 + 1000);
    });

    scenarioRef.current += 1;
  };

  /* 이미지 삭제 */
  useEffect(() => {
    if (deleteIndex !== undefined) {
      setImgArr((prev) => prev.filter((_, i) => i !== deleteIndex));
      setDeleteIdx(undefined);
    }
  }, [deleteIndex]);

  /* 이미지 모달 상태 */
  useEffect(() => {
    setImgModalState(imgArr.length > 0);
  }, [imgArr]);

  /* 이미지 전송 */
  const handleSubmitImage = () => {
    if (imgArr.length === 0) return;

    const newMessages = imgArr.map((img) => ({
      id: (Date.now() + Math.random()).toString(),
      userId: "me",
      username: "나",
      type: "image",
      content: URL.createObjectURL(img),
      timestamp: Date.now(),
      isRead: false,
    }));

    setMessages((prev) => [...prev, ...(newMessages as ChatMessage[])]);
    handleClose();

    newMessages.forEach((msg) => {
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, message: msg }),
      });
    });
  };

  /* 텍스트 전송 */
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
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    if (refObj.current) refObj.current.value = "";

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, message: newMessage }),
    });

    sendMockResponse(roomId, scenarioRef.current);
  };

  /* 이미지 모달 닫기 */
  const handleClose = () => {
    setImgModalState(false);
    setImgArr([]);
  };

  /* 렌더링 */
  return (
    <>
      <ChatContainer>
        <h2 className="sr-only">{chatUsername}님과의 채팅방</h2>

        {messages.length === 0 && (
          <ChatNotice>{chatUsername}님과 대화를 시작해볼까요? 😎</ChatNotice>
        )}

        {messages.map((msg) =>
          msg.userId === "me" ? (
            <MyChat key={msg.id}>
              <MyTime>
                {!msg.isRead && (
                  <p
                    style={{ color: "var(--color-error)", marginBottom: "4px" }}
                  >
                    안읽음
                  </p>
                )}
                <p>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </MyTime>

              <MyChatMessage>
                {msg.type === "text" ? (
                  <p>{msg.content}</p>
                ) : (
                  <img src={msg.content} alt="" style={{ maxWidth: "100%" }} />
                )}
              </MyChatMessage>
            </MyChat>
          ) : (
            <YourChat key={msg.id}>
              <ProfileImg thumbimg={false} width={42} />
              <YourChatMessage>
                {msg.type === "text" ? (
                  <p>{msg.content}</p>
                ) : (
                  <img src={msg.content} style={{ maxWidth: "100%" }} />
                )}
              </YourChatMessage>
              <YourTime>
                <p>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </YourTime>
            </YourChat>
          )
        )}
      </ChatContainer>

      {/* 이미지 모달 */}
      {imgModalState && (
        <>
          <Background />
          <ImageContainerWRapper>
            <ImageContainer imgArr={imgArr} setDeleteIdx={setDeleteIdx} />
            <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
              <div style={{ flexBasis: "50%" }}>
                <DefaultButton
                  text="전송하기"
                  height="medium"
                  onClick={handleSubmitImage}
                />
              </div>
              <div style={{ flexBasis: "50%" }}>
                <DefaultButton
                  text="닫기"
                  height="medium"
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
            multiple
            colortype="gray"
            size="small"
            imgArr={imgArr}
            setImgArr={setImgArr}
          />
        }
        placeholder="메시지 입력하기.."
        onClick={handleSendText}
      />

      {/* 미니 얼럿 */}
      <AlertModal
        isOpen={alertOpen}
        type={alertType}
        onClose={closeAlert}
        onConfirm={{
          chatReport: () => {
            // 신고 완료 후 채팅 리스트로 이동
            navigate("/chat-list");
          },
          chatLeave: () => {
            // 채팅방 나가기 후 채팅 리스트로 이동
            navigate("/chat-list");
          },
        }}
      />
    </>
  );
}
