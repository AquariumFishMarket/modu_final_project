// 챗봇 타입 정의

export type IntentCategory =
  | "거래·결제 안내"
  | "환불·교환·수수료"
  | "배송·픽업 가이드"
  | "게시물 등록 규칙"
  | "금지 품목·채팅 규정"
  | "회원가입·계정·인증"
  | "리뷰·신뢰도"
  | "신고·분쟁 처리"
  | "기타 문의";

export interface Intent {
  id: string;
  category: IntentCategory;
  title: string;
  utterances: string[];
  tags: string[];
  answer: string;
  details?: string;
  quickReplies?: string[];
  imageUrl?: string;
  linkUrl?: string;
}

export interface Message {
  role: "user" | "bot";
  text: string;
  meta?: {
    intentId?: string;
    details?: string;
  };
  timestamp?: number;
  quickReplyUsed?: boolean;
}
