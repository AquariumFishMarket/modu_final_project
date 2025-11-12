import { useState, useMemo, useRef, useEffect } from "react";
import { useHeader } from "../../contexts/HeaderContext";
import { useNavigate } from "react-router-dom";
import { INTENTS, CATEGORIES } from "./data/intents";
import { findIntent } from "./utils";
import type { Message, Intent } from "./types";
import {
  ChatbotContainer,
  QuickMenuWrapper,
  QuickButton,
  FaqPanel,
  FaqHeader,
  FaqTitle,
  CloseButton,
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
  QuickReplyButton,
  InputArea,
  Input,
  SendButton,
  GuideSection,
  GuideTitle,
  GuideHighlight,
  GuideList,
  GuideItem,
} from "./Chatbot.styled";

// 물고기마켓 챗봇
//  - 거래: 사용자 간 '계좌이체' (안전결제 제공 X)
//  - 외부 판매사이트 안내 시: 환불/수수료는 해당 판매처 정책 우선
//  - 업로드: 영상 불가, 사진 최대 10장, 해시태그 최대 10개
//  - 도메인: 관상어·수족관 용품 마켓
//  - 미매칭: "FAQ 전체보기" + "1544-0000" 안내

export default function Chatbot() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();

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

  // 헤더 설정
  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "feed",
      title: "물고기봇",
      onBackClick: () => navigate(-1),
    });
  }, [setHeaderConfig, navigate]);

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickMenu = useMemo(
    () => [
      "결제 방식",
      "환불/교환 규정",
      "배송/픽업",
      "사진/해시태그/영상 규칙",
      "거래 금지 품목",
      "신고/분쟁 처리",
      "FAQ 전체보기",
    ],
    []
  );

  const pushBot = (text: string, intent?: Intent) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text,
        meta: intent
          ? { intentId: intent.id, details: intent.details }
          : undefined,
      },
    ]);
  };

  const openFaq = () => {
    setShowFaq(true);
    pushBot(
      "자주 묻는 질문(FAQ) 목록을 열었어요. 카테고리를 선택해 주세요!",
      undefined
    );
  };

  const handleSend = (value?: string) => {
    const q = (value ?? input).trim();
    if (!q) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");

    // FAQ 열기 트리거
    if (/faq|FAQ|전체보기/.test(q)) {
      return openFaq();
    }

    const intent = findIntent(q);
    if (!intent) {
      setShowFaq(true);
      pushBot(
        "앗, 제가 그 단어는 잘 모르겠어요. 아래 FAQ 목록을 확인하시거나 1544-0000으로 전화해 주세요.",
        undefined
      );
      return;
    }
    setActiveIntent(intent);
    setShowFaq(false);
    pushBot(intent.answer, intent);
  };

  const handleShowDetails = (intentId?: string) => {
    const intent =
      INTENTS.find((i) => i.id === intentId) ?? activeIntent ?? undefined;
    if (!intent?.details) return;
    pushBot(intent.details, intent);
  };

  return (
    <ChatbotContainer as="main">
      {/* 퀵 메뉴 */}
      <QuickMenuWrapper as="nav" aria-label="자주 묻는 질문 메뉴">
        {quickMenu.map((q) => (
          <QuickButton key={q} onClick={() => handleSend(q)}>
            {q}
          </QuickButton>
        ))}
      </QuickMenuWrapper>

      {/* FAQ 전체보기 패널 */}
      {showFaq && (
        <FaqPanel as="section" aria-label="자주 묻는 질문">
          <FaqHeader>
            <FaqTitle as="h2">자주 묻는 질문</FaqTitle>
            <CloseButton onClick={() => setShowFaq(false)} aria-label="자주 묻는 질문 패널 닫기">닫기</CloseButton>
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
            찾으시는 답이 없으면 고객센터 <PhoneNumber>1544-0000</PhoneNumber>으로 연락주세요.
          </FaqFooter>
        </FaqPanel>
      )}

      {/* 채팅 박스 */}
      <ChatboxWrapper as="section" aria-label="채팅 대화 영역">
        <MessagesArea role="log" aria-live="polite" aria-atomic="false">
          {messages.map((m, idx) => (
            <MessageWrapper key={idx} $isBot={m.role === "bot"} role="article">
              <MessageBubble $isBot={m.role === "bot"}>{m.text}</MessageBubble>
              {m.role === "bot" && m.meta?.intentId && (
                <MessageActions>
                  <DetailButton
                    onClick={() => handleShowDetails(m.meta?.intentId)}
                  >
                    자세히 보기
                  </DetailButton>
                  {INTENTS.find(
                    (i) => i.id === m.meta?.intentId
                  )?.quickReplies?.map((q) => (
                    <QuickReplyButton key={q} onClick={() => handleSend(q)}>
                      {q}
                    </QuickReplyButton>
                  ))}
                </MessageActions>
              )}
            </MessageWrapper>
          ))}
          <div ref={messagesEndRef} />
        </MessagesArea>

        <InputArea as="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} role="search">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요… (예: 환불/교환 규정, 사진/해시태그/영상 규칙)"
            aria-label="챗봇 메시지 입력"
          />
          <SendButton type="submit" onClick={() => handleSend()} aria-label="메시지 전송">전송</SendButton>
        </InputArea>
      </ChatboxWrapper>

      {/* 구현 가이드 */}
      <GuideSection as="aside" aria-label="챗봇 구현 가이드">
        <GuideTitle as="h2">구현 가이드</GuideTitle>
        <GuideList>
          <GuideItem>
            <GuideHighlight>거래 정책:</GuideHighlight> 안전결제 없음, 계좌이체 기준. 외부 판매사이트 안내
            시 해당 판매처 정책 우선.
          </GuideItem>
          <GuideItem>
            <GuideHighlight>콘텐츠 규칙:</GuideHighlight> 영상 불가, 사진 10장, 해시태그 10개.
          </GuideItem>
          <GuideItem>
            <GuideHighlight>미매칭 Fallback:</GuideHighlight> FAQ 자동 오픈 + <PhoneNumber>1544-0000</PhoneNumber> 안내.
          </GuideItem>
          <GuideItem>
            <GuideHighlight>확장 포인트:</GuideHighlight> 카테고리/인텐트 추가, 라우터로 정책 상세 페이지
            연결, 금칙어 가드.
          </GuideItem>
          <GuideItem>
            <GuideHighlight>브랜드 톤:</GuideHighlight> 물고기봇 말투/이모지 유지.
          </GuideItem>
        </GuideList>
      </GuideSection>
    </ChatbotContainer>
  );
}
