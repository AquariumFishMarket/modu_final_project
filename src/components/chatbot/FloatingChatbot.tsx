import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { INTENTS, CATEGORIES } from "../../pages/chatbot/data/intents";
import { findIntent } from "../../pages/chatbot/utils";
import type { Message, Intent } from "../../pages/chatbot/types";
import {
  FloatingButton,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "./FloatingChatbot.styled";
import {
  QuickMenuWrapper,
  QuickButton,
  FaqPanel,
  FaqHeader,
  FaqTitle,
  CloseButton as FaqCloseButton,
  FaqGrid,
  CategoryCard,
  CategoryTitle,
  CategoryList,
  CategoryItem,
  CategoryButton,
  FaqFooter,
  PhoneNumber,
  ChatboxWrapper,
  MessagesArea,
  MessageWrapper,
  MessageBubble,
  MessageActions,
  DetailButton,
  QuickRepliesWrapper,
  QuickReplyButton,
  InputArea,
  Input,
  SendButton,
} from "../../pages/chatbot/Chatbot.styled";

//  플로팅 챗봇 컴포넌트
//  - 우측 하단에 플로팅 버튼
//  - 클릭 시 우측에서 슬라이드되는 모달

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "안녕하세요! 물고기봇입니다. 무엇을 도와드릴까요?",
    },
  ]);
  const [input, setInput] = useState("");
  const [activeIntent, setActiveIntent] = useState<Intent | null>(null);
  const [showFaq, setShowFaq] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isProcessingRef = useRef<boolean>(false);
  const isComposingRef = useRef<boolean>(false);

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 모달 오픈 시 인풋 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const quickMenu = useMemo(
    () => [
      "결제 방식",
      "환불·교환 규정",
      "배송/픽업",
      "사진/해시태그/영상 규칙",
      "거래 금지 품목",
      "신고·분쟁 처리",
      "FAQ 전체보기",
    ],
    []
  );

  const pushBot = useCallback((text: string, intent?: Intent) => {
    setMessages((prev) => {
      // 중복 메시지 방지: 마지막 메시지가 동일한 봇 메시지면 추가하지 않음
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.role === "bot" && lastMsg?.text === text) {
        return prev;
      }

      return [
        ...prev,
        {
          role: "bot",
          text,
          meta: intent
            ? { intentId: intent.id, details: intent.details }
            : undefined,
        },
      ];
    });
  }, []);

  const openFaq = useCallback(() => {
    setShowFaq(true);
    pushBot(
      "자주 묻는 질문(FAQ) 목록을 열었어요. 카테고리를 선택해 주세요!",
      undefined
    );
  }, [pushBot]);

  const handleSend = useCallback(
    (value?: string) => {
      // value가 없으면 현재 input 사용
      const q = (value ?? input).trim();
      if (!q) return;

      // 중복 실행 방지
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      // input 필드 즉시 초기화 (value가 없을 때만)
      if (!value) {
        setInput("");
      }

      // 사용자 메시지 추가 (중복 방지)
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === "user" && lastMsg?.text === q) {
          isProcessingRef.current = false;
          return prev; // 중복 사용자 메시지 방지
        }
        return [...prev, { role: "user", text: q }];
      });

      // FAQ 전체보기 버튼 또는 입력인 경우
      if (q === "FAQ 전체보기" || /faq|전체보기/i.test(q)) {
        setTimeout(() => {
          openFaq();
          isProcessingRef.current = false;
        }, 300);
        return;
      }

      // 인텐트 검색
      const intent = findIntent(q);
      if (!intent) {
        setTimeout(() => {
          setShowFaq(true);
          pushBot(
            "앗, 제가 그 단어는 잘 모르겠어요. 아래 FAQ 목록을 확인하시거나 1544-0000으로 전화해 주세요.",
            undefined
          );
          isProcessingRef.current = false;
        }, 300);
        return;
      }

      // 인텐트 찾았을 때
      setTimeout(() => {
        setActiveIntent(intent);
        pushBot(intent.answer, intent);
        isProcessingRef.current = false;
      }, 300);
    },
    [input, openFaq, pushBot]
  );

  const handleShowDetails = useCallback(
    (intentId?: string) => {
      const intent =
        INTENTS.find((i) => i.id === intentId) ?? activeIntent ?? undefined;
      if (!intent?.details) return;
      pushBot(intent.details, intent);
    },
    [activeIntent, pushBot]
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <FloatingButton onClick={() => setIsOpen(true)} aria-label="챗봇 열기">
        <img src="/img/chatbotai.png" alt="챗봇" />
      </FloatingButton>

      {/* 모달 오버레이 */}
      <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick} />

      {/* 모달 컨테이너 */}
      <ModalContainer $isOpen={isOpen} role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
        <ModalHeader as="header">
          <ModalTitle as="h1" id="chatbot-title">
            물고기봇
          </ModalTitle>
          <CloseButton onClick={handleClose} aria-label="챗봇 닫기">
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody as="main">
          {/* 스크롤 가능한 콘텐츠 영역 */}
          <ModalContent>
            {/* 퀵 메뉴 */}
            <QuickMenuWrapper as="nav" aria-label="자주 묻는 질문 메뉴">
              {quickMenu.map((q) => (
                <QuickButton key={q} onClick={() => handleSend(q)}>
                  {q}
                </QuickButton>
              ))}
            </QuickMenuWrapper>

            {/* 채팅 메시지 영역 */}
            <ChatboxWrapper as="section" aria-label="채팅 대화 영역">
              <MessagesArea role="log" aria-live="polite" aria-atomic="false">
                {messages.map((m, idx) => (
                  <MessageWrapper key={idx} $isBot={m.role === "bot"} role="article">
                    <MessageBubble $isBot={m.role === "bot"}>
                      {m.text}
                    </MessageBubble>
                    {m.role === "bot" && m.meta?.intentId && (
                      <MessageActions>
                        <DetailButton
                          onClick={() => handleShowDetails(m.meta?.intentId)}
                        >
                          자세히 보기
                        </DetailButton>
                        {INTENTS.find((i) => i.id === m.meta?.intentId)
                          ?.quickReplies && (
                          <QuickRepliesWrapper>
                            {INTENTS.find(
                              (i) => i.id === m.meta?.intentId
                            )?.quickReplies?.map((q) => (
                              <QuickReplyButton
                                key={q}
                                onClick={() => handleSend(q)}
                              >
                                {q}
                              </QuickReplyButton>
                            ))}
                          </QuickRepliesWrapper>
                        )}
                      </MessageActions>
                    )}
                  </MessageWrapper>
                ))}

                {/* 스크롤 앵커 - 메시지 끝 */}
                <div ref={messagesEndRef} />
              </MessagesArea>
            </ChatboxWrapper>

            {/* FAQ 전체보기 패널 - 채팅박스 아래에 표시 */}
            {showFaq && (
              <FaqPanel as="section" aria-label="자주 묻는 질문">
                <FaqHeader>
                  <FaqTitle as="h2">자주 묻는 질문</FaqTitle>
                  <FaqCloseButton onClick={() => setShowFaq(false)} aria-label="자주 묻는 질문 패널 닫기">
                    닫기
                  </FaqCloseButton>
                </FaqHeader>
                <FaqGrid as="div" role="list">
                  {CATEGORIES.map((cat) => (
                    <CategoryCard key={cat} role="listitem">
                      <CategoryTitle as="h3">{cat}</CategoryTitle>
                      <CategoryList as="ul">
                        {INTENTS.filter((i) => i.category === cat).map((i) => (
                          <CategoryItem key={i.id} as="li">
                            <CategoryButton
                              onClick={() => {
                                handleSend(i.title);
                                setShowFaq(false);
                              }}
                              aria-label={`${i.title} 질문 선택`}
                            >
                              • {i.title}
                            </CategoryButton>
                          </CategoryItem>
                        ))}
                      </CategoryList>
                    </CategoryCard>
                  ))}
                </FaqGrid>
                <FaqFooter>
                  찾으시는 답이 없으면 고객센터{" "}
                  <PhoneNumber>1544-0000</PhoneNumber>으로 연락주세요.
                </FaqFooter>
              </FaqPanel>
            )}
          </ModalContent>

          {/* 하단 고정 입력 필드 */}
          <ModalFooter as="footer">
            <InputArea as="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} role="search">
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onCompositionStart={() => {
                  isComposingRef.current = true;
                }}
                onCompositionEnd={() => {
                  isComposingRef.current = false;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isComposingRef.current) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="메시지를 입력하세요…"
                aria-label="챗봇 메시지 입력"
              />
              <SendButton type="submit" onClick={() => handleSend()} aria-label="메시지 전송">전송</SendButton>
            </InputArea>
          </ModalFooter>
        </ModalBody>
      </ModalContainer>
    </>
  );
}
