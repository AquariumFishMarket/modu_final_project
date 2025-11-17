import { useState, useEffect } from "react";
import ChatItems from "./ChatItem";
import MoreMenu from "../../components/common/modal/MoreMenu";
import { useHeader } from "../../contexts/HeaderContext";
import AlertModal from "../../components/common/modal/AlertModal";

interface ChatDataType {
  id: number;
  imgSrc: string;
  username: string;
  message: string;
  date: string;
}

const mockChats: ChatDataType[] = [
  {
    id: 1,
    imgSrc: "..",
    username: "철갑상어",
    message: "채팅을 시작해보세요 :)",
    date: "2025.12.02",
  },
  {
    id: 2,
    imgSrc: "..",
    username: "ggamjang12",
    message: "채팅을 시작해보세요 :)",
    date: "2025.08.19",
  },
  {
    id: 3,
    imgSrc: "..",
    username: "붕어빵",
    message: "채팅을 시작해보세요 :)",
    date: "2025.08.19",
  },
];

export default function ChatList() {
  const [chats, setChats] = useState(mockChats);

  const [editMode, setEditMode] = useState(false);
  const [editType, setEditType] = useState<"report" | "leave" | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"chatReport" | "chatLeave" | null>(
    null
  );

  const { setHeaderConfig } = useHeader();

  const openAlert = (type: "chatReport" | "chatLeave") => {
    setAlertType(type);
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
    setAlertType(null);
  };

  const resetEdit = () => {
    setEditMode(false);
    setEditType(null);
    setSelected([]);
  };

  const updateHeader = () => {
    if (!editMode) {
      setHeaderConfig({
        show: true,
        type: "chatList",
        pageTitle: "채팅 목록", 
        onBackClick: () => history.back(),
        rightElement: (
          <MoreMenu
            type="chat"
            size="lg"
            onReport={() => {
              setEditMode(true);
              setEditType("report");
            }}
            onLeave={() => {
              setEditMode(true);
              setEditType("leave");
            }}
          />
        ),
      });
    } else {
      setHeaderConfig({
        show: true,
        type: "chatList",
        onBackClick: resetEdit,
        rightElement: (
          <button
            disabled={selected.length === 0}
            onClick={() => {
              if (!selected.length) return;
              if (editType === "report") openAlert("chatReport");
              else openAlert("chatLeave");
            }}
            style={{
              padding: "6px 14px",
              borderRadius: "18px",
              border: "none",
              fontSize: "14px",
              color: "#fff",
              background:
                selected.length === 0
                  ? "var(--color-gray-medium)"
                  : "var(--color-error)",
            }}
          >
            {editType === "report" ? "신고하기" : "나가기"}
          </button>
        ),
      });
    }
  };

  useEffect(updateHeader, [editMode, selected, editType]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleLeaveChats = () => {
    setChats((prev) => prev.filter((c) => !selected.includes(c.id)));
    resetEdit();
  };

  const handleReportChats = () => {
    resetEdit();
  };

  return (
    <>
      {chats.map((room) => (
        <ChatItems
          key={room.id}
          id={room.id}
          imgSrc={room.imgSrc}
          username={room.username}
          message={room.message}
          date={room.date}
          showCheck={editMode}
          checked={selected.includes(room.id)}
          onCheck={toggleSelect}
          onClick={(id) => setChats((prev) => prev.filter((c) => c.id !== id))}
        />
      ))}

      {chats.length === 0 && (
        <>
          <div
            style={{
              width: "100%",
              height: "300px",
              backgroundImage: "url(/img/fish_logo.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
          <p style={{ textAlign: "center" }}>대화중인 목록이 없습니다.</p>
        </>
      )}

      <AlertModal
        isOpen={alertOpen}
        type={alertType}
        onClose={closeAlert}
        onConfirm={{
          chatReport: handleReportChats,
          chatLeave: handleLeaveChats,
        }}
      />
    </>
  );
}
