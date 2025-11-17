# 물고기마켓 (Aquarium Fish Market)

React + Vite 기반으로 구현된 **관상어 커뮤니티 플랫폼**입니다.  
사용자는 피드 업로드, 팔로우/좋아요, 댓글, 프로필 조회, 검색, 채팅 UI 등을 통해  
관상어 판매 및 관련 정보뿐만 아니라 일상도 공유하며, 당근과 같은 거래/커뮤니티 서비스를 목표로 합니다.

> **현재 백엔드 부분은 위니브에서 제공한 감귤마켓 API를 사용하여 연동한 상태이며,  
> 추후 자체 백엔드 서버를 구축하여 실서비스 수준으로 확장할 계획입니다.**

<br>

## 목차 (Table of Contents)

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [폴더 구조](#폴더-구조)
- [주요 구현 포인트](#주요-구현-포인트)
- [트러블슈팅](#트러블슈팅-trouble-shooting)
- [향후 개선 계획](#향후-개선-계획-roadmap)
- [기여 방법](#기여-방법-contribution-guide)
- [팀원 기여도](#팀원-기여도)
- [설치--실행-방법](#설치--실행-방법)
- [라이선스](#라이선스)

---

## 프로젝트 개요

### 프로젝트 목적

- 관상어/어항등 분양/용품에 특화된 **커뮤니티 + 거래 플랫폼** 구축
- 모바일 우선(UI/레이아웃)으로, 가볍고 직관적인 사용 경험 제공
- 기존 SNS(인스타, 당근, 오늘의집)의 **피드/좋아요/팔로우/댓글 패턴**을 적용
- **챗봇, 채팅, 팔로워/팔로잉 관리** 등 고도화 기능까지 고려한 프론트 설계
- 현재는 제공 API 연동, 이후 **자체 백엔드 구현**으로 기능 확장 예정

<br>

### 팀 구성

#### Frontend (3명)

| 이름    | 역할            | 비고                     |
| ------- | --------------- | ------------------------ |
| 이상민  | 프론트엔드 개발 | ???????????????????????? |
| 김예슬1 | 프론트엔드 개발 | ???????????????????????? |
| 김예슬2 | 프론트엔드 개발 | ???????????????????????? |

#### Backend (1명)

| 이름   | 역할        | 비고                                          |
| ------ | ----------- | --------------------------------------------- |
| 천수겸 | 백엔드 개발 | 단독 담당 / 인원 런 이슈로 이번에는 별도 발표 |

> 백엔드 인원 변경으로 인해 현재는 **위니브 제공 API 기준으로만 연동**되어 있으며,  
> 자체 백엔드 구축 및 연동은 부트캠프 종료 후 이어서 진행될 예정입니다.

<br>

---

## 기술 스택

### Frontend

- **React 19**
- **Vite**
- **TypeScript**
- **Zustand** – 전역 상태 관리 (`useFeedStore`, `useAuthStore`, `useToastStore`, `followStore` 등)
- **Styled-Components** – 컴포넌트 단위 스타일링
- **React Router v6**
- **Framer Motion** – 간단한 모션 및 전환 효과
- **Axios** – API 통신
- **ESLint / Prettier** – 코드 컨벤션 및 정적 검사

### Backend (향후 계획)

> 현재는 **위니브 제공 감귤마켓 API**만 사용하며, 직접 서버 코드/DB는 이 레포지토리에 포함되지 않습니다.  
> 추후 목표하는 백엔드 스택은 수겸님께서 발표하실때 같이 보겠습니다.

---

## 주요 기능

| 기능              | 설명                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| 회원가입 / 로그인 | 위니브 제공 Auth API 연동, 토큰 기반 인증/인가                                                    |
| 피드 조회         | 무한 스크롤 기반 피드 목록, Skeleton 로딩 UI                                                        |
| 게시글 작성/삭제  | 이미지 업로드 + 텍스트 기반 게시글 작성/수정/삭제/신고                                              |
| 좋아요            | 낙관적 업데이트(Optimistic UI), 실시간 상태 반영                                                    |
| 댓글              | 게시글별 댓글 CRUD 및 카운트 동기화                                                                 |
| 프로필            | 내 프로필/타 유저 프로필, 팔로워/팔로잉, 프로필 편집                                                |
| 팔로우            | 팔로우/언팔로우, 카운트 및 버튼 상태 동기화                                                         |
| 사용자 검색       | 계정명/닉네임 기반 검색, 결과 리스트 UI                                                             |
| 채팅 UI           | 채팅 리스트/채팅방 UI 구현 (API 명세 없음(목데이터로 실시간 채팅하듯 구현) → 추후 백엔드 구현 대상) |
| 챗봇              | 간단한 FAQ/의도 기반 챗봇 페이지 + 플로팅 챗봇 버튼                                                 |
| 예외/에러 페이지  | 공통 에러 페이지 및 특정 예외 상황 처리 페이지 구현                                                 |
| 모바일 최적화     | 전반적인 레이아웃과 타이포그래피를 모바일 기준으로 설계                                             |

---

## 폴더 구조 (주요 디렉터리)

> `node_modules` 및 외부 라이브러리 디렉터리는 생략하고, 실제 구현에 직접 관련된 경로만 정리했습니다.

```bash
.
├── public
│   ├── font/                 # 웹폰트 (Spoqa Han Sans Neo)
│   ├── icons/                # 공통 SVG 아이콘 (홈/메시지/유저/검색 등)
│   └── img/                  # 로고, 404, 프로필, 물고기 이미지, GIF 등
│
├── src
│   ├── App.tsx               # 라우팅 및 최상위 레이아웃 진입점
│   ├── main.tsx              # React DOM 렌더링 진입점
│   ├── index.css             # 전역 CSS (reset + 기본 스타일 일부)
│   │
│   ├── assets
│   │   └── styles
│   │       └── reset.css     # CSS 리셋 스타일
│   │
│   ├── components
│   │   ├── chatbot           # 플로팅 챗봇 UI 컴포넌트
│   │   ├── common            # 버튼, 인풋, 모달, 팔로우 카드, 스켈레톤, 텍스트필드 등 공통 컴포넌트
│   │   ├── layout            # Header, FooterNav, 글로벌 레이아웃 컴포넌트
│   │   └── post              # 게시글 카드, 댓글, 헤더, 아바타 등 포스트 관련 컴포넌트
│   │
│   ├── contexts
│   │   ├── HeaderContext.tsx # 페이지별 헤더 설정 컨텍스트
│   │   ├── SearchContext.tsx # 검색 상태 관리 컨텍스트
│   │   ├── useAuthStore.ts   # 인증 관련 Zustand 스토어
│   │   ├── useFeedStore.ts   # 피드/좋아요/스크롤 상태 관리
│   │   ├── followStore.ts    # 팔로우/언팔로우 상태
│   │   └── useToastStore.ts  # 토스트 알림 상태
│   │
│   ├── data
│   │   └── mockChat.ts       # 더미 채팅 데이터
│   │
│   │
│   ├── hooks
│   │   ├── useFeedData.ts        # 피드 데이터 불러오기/처리 커스텀 훅
│   │   ├── useSearch.ts          # 사용자 검색 로직 커스텀 훅
│   │   └── useUserPostsData.ts   # 유저별 게시글 데이터 관리 훅
│   │
│   ├── pages
│   │   ├── home/             # 피드 페이지
│   │   ├── post/             # 게시글 상세/작성 페이지
│   │   ├── product/          # 판매 상품 등록/수정/상세
│   │   ├── profile/          # 프로필 조회/수정/상품 목록/갤러리
│   │   ├── search/           # 유저 검색 페이지
│   │   ├── follow/           # 팔로워/팔로잉 리스트 페이지
│   │   ├── chat/             # 채팅 리스트/채팅방 (UI)
│   │   ├── chatbot/          # 독립 챗봇 페이지
│   │   ├── login/            # 로그인/이메일 로그인
│   │   ├── signup/           # 회원가입
│   │   ├── splash/           # 스플래시 화면
│   │   └── errPage/          # 에러/예외 페이지 (404 등)
│   │
│   ├── services              # API 통신 레이어 (Axios)
│   │   ├── authService.ts
│   │   ├── feedService.ts
│   │   ├── followService.ts
│   │   ├── imageService.ts
│   │   ├── postService.ts
│   │   ├── productService.ts
│   │   └── profileService.ts
│   │
│   ├── types                 # 공통 타입 정의 (TypeScript)
│   │   ├── api.ts
│   │   ├── feed.ts
│   │   ├── follow.ts
│   │   ├── post.ts
│   │   ├── product.ts
│   │   └── user.ts
│   │
│   ├── utils
│   │   ├── tokenManager.ts       # 토큰 저장/조회/삭제 관련 유틸
│   │   ├── fetchPostMeta.ts      # 게시글 메타 정보(좋아요, 댓글 수 등)
│   │   ├── formatter/dateFormatter.ts   # 날짜 포매터
│   │   ├── getImageUrls.ts       # 이미지 URL 처리 유틸
│   │   ├── GuestRoute.tsx        # 비회원만 접근 가능한 라우트 가드
│   │   ├── MemberRoute.tsx       # 회원만 접근 가능한 라우트 가드
│   │   ├── fishEasterEgg.ts      # 물고기 관련 이스터에그/재미 요소
│   │   └── validation/           # 로그인/회원가입/상품 등 입력값 검증
│   │
│   ├── rootRoute.tsx         # 라우트 구성 및 레이아웃 설정
│   └── vite-env.d.ts
│
├── package.json
├── tsconfig*.json
├── vercel.json               # Vercel 배포 설정
└── vite.config.ts            # Vite 설정
```

---

## 배포 & 데모

### ▶ 배포 URL

**배포 URL은 Ctrl(⌘) + 클릭하여 새 탭에서 열 수 있습니다.**

<p>
  <a href="https://fishmarket-six.vercel.app/" target="_blank"><b>물고기마켓 배포 사이트</b></a>
</p>

### 시연 GIF / 영상

여기에는 피드, 프로필, 게시글 작성, 검색, 챗봇 등
주요 흐름을 보여주는 GIF/영상을 추후 추가할 예정입니다.

---

## 주요 구현 포인트

### 1) 상태 관리 (Zustand + Context)

useFeedStore

feedList, skip, hasMore, isFetching, isRefreshing 등 무한스크롤/피드 상태 관리

좋아요 토글 시 낙관적 업데이트 적용

서버 응답 필드(hearted) → 프론트 사용 필드(isLiked)로 매핑 레이어 구성

useAuthStore

로그인/로그아웃, 현재 사용자 정보, 토큰 상태 관리

tokenManager.ts와 함께 인증 흐름 구성

useToastStore

알림/에러 메시지를 Toast 컴포넌트와 연결

HeaderContext, SearchContext

페이지별 헤더 타이틀/액션 버튼 제어

검색 인풋 상태와 검색 결과 공유

#### 2) 무한 스크롤 & 요청 제어

FeedPage + useFeedStore + IntersectionObserver 활용

스크롤 하단에 도달 시 다음 피드 자동 로드

isFetching, isRefreshing, hasMore, skip을 기반으로
중복 호출 방지 및 최대 요청 횟수 제어 로직 구현

Skeleton 컴포넌트(Skeleton.tsx, SkeletonWrapper.tsx)로 로딩 상태 시각화

#### 3) 게시글/댓글/좋아요 흐름

postService.ts, feedService.ts, post.ts, feed.ts 타입과 함께
게시글 및 댓글의 CRUD를 서비스 레이어로 분리

좋아요/댓글 수는 fetchPostMeta.ts에서 별도 메타 정보로 가공하여
PostCard, PostDetail 등에서 일관되게 사용

#### 4) 프로필 & 팔로우

profileService.ts와 followService.ts를 통해

프로필 조회/수정

팔로워/팔로잉 리스트 조회

팔로우/언팔로우 요청 수행

followStore.ts에서 팔로우 상태를 전역으로 관리하여
여러 컴포넌트에서 동일한 팔로우 상태를 공유할 수 있도록 설계

#### 5) 챗봇 & 채팅

챗봇

pages/chatbot 디렉터리에서

intents.ts, synonyms.ts, utils.ts를 기반으로
간단한 의도 매칭/키워드 기반 챗봇 구현

components/chatbot/FloatingChatbot.tsx

화면 하단에 떠 있는 플로팅 버튼 형태의 챗봇 트리거

사용자 흐름 방해 없이 언제든지 도움을 요청할 수 있도록 설계

채팅

pages/chat 디렉터리에서 채팅 리스트/채팅방 UI 구현

현재는 더미 데이터(mockChatData.ts) 기반 UI만 구현된 상태

향후 Socket.io + 자체 백엔드와 연동하여 실시간 채팅으로 확장 예정

-

## 트러블슈팅 (Trouble Shooting)

실제 구현/리팩터링 과정에서 겪었던 이슈와 해결 과정을 발표 때 같이 설명하기 위한 섹션입니다.
(여기 내용은 팀이 커밋/이슈를 정리하면서 구체적으로 채우면 좋아요.)

#### 1) API 응답 필드 불일치 (hearted vs isLiked)

**문제**

백엔드 제공 API는 좋아요 여부를 hearted로 내려주지만,
프론트 컴포넌트에서는 isLiked 필드를 기준으로 UI를 구성

**결과**

좋아요가 눌려도 UI가 반영되지 않거나, 반대로 잘못된 상태로 노출

**해결**

feedService / useFeedStore에서 응답을 받아올 때
hearted → isLiked 필드로 변환하는 매핑 함수 추가

이후 모든 컴포넌트는 isLiked만 신뢰하도록 규약 통일

#### 2) 무한 스크롤 중복 호출 및 에러

**문제**

IntersectionObserver 콜백이 여러 번 호출되면서
같은 페이지를 중복으로 요청하거나, hasMore가 false인데도 호출되는 문제 발생

**해결**

if (isFetching) return;
if (isLoadMore && (isRefreshing || !hasMore)) return; 등의 가드 로직 추가

요청 상태/남은 데이터 여부를 철저하게 조건으로 분리해 레이스 컨디션 방지

#### 3) 팔로워/팔로잉 수 불일치

**문제**

팔로우/언팔로우 후 바로 UI에 수치가 반영되지 않거나, 새로고침 후에만 반영

**해결**

팔로우/언팔로우 API 성공 시점에
followStore와 해당 프로필 컴포넌트의 상태를 즉시 동기화하도록 수정

마이 프로필(myinfo) 재요청 및 전역 상태 업데이트로 일관성 확보

#### 4) 라우트 보호(Guest/Member Route) 이슈

**문제**

로그인하지 않은 사용자가 특정 페이지에 접근해도 막히지 않거나,
반대로 로그인 사용자가 로그인 페이지로 접근 시 리다이렉트가 제대로 안 되는 경우 발생

**해결**

GuestRoute, MemberRoute를 별도 컴포넌트로 분리하고
tokenManager 기반 인증 여부를 판단하여 라우팅 가드를 일원화

---

## 향후 개선 계획 (Roadmap)

- 위니브 제공 감귤마켓 API를 제거하고 자체 백엔드 서버 구축

- 게시글/상품에 대한 신고/관리 기능 추가

- 실시간 채팅 및 알림 기능 구현 (Socket.io)

- 검색 고도화 (자동완성, 해시태그/키워드 기반 검색)

- 지도/위치 기반 동네 설정 및 필터링

- 반응형(데스크톱) UI 및 다크모드 추가

- 에러/예외 상황에 대한 더 세밀한 안내 UX

---

## 기여 방법 (Contribution Guide)

실제 Git 브랜치 전략과 PR 템플릿에 맞게 수정해서 사용하면 됩니다.

이슈 생성

버그 / 기능 / 리팩터링 / 문서 등 라벨 지정

브랜치 네이밍 규칙

bash
코드 복사
feat/기능명
fix/버그명

---

## PR 규칙

제목: [#이슈번호] feat: 기능명 / [#이슈번호] fix: 이슈 요약 등

내용:

작업 내용 요약

스크린샷 (UI 변경 시 필수)

테스트 방법 및 체크리스트

코드 스타일

ESLint + Prettier를 통한 포맷 일원화

함수/컴포넌트는 단일 책임 원칙(SRP) 지향

---

## 팀원 기여도 (예시)

아래는 커밋/이슈를 기반으로 발표 전에 구체적으로 작성할 수 있는 템플릿입니다.

**이상민**  
전역 상태 관리(Zustand) 구조 설계

피드 페이지/무한 스크롤 및 좋아요 로직 구현

라우트 가드 및 구조 리팩터링

**김예슬1**  
프로필/팔로우/팔로워/팔로잉 기능 구현

검색 페이지 및 유저 카드 컴포넌트

폼/입력값 검증 및 에러 처리 UX 보완

**김예슬2**  
채팅 UI/챗봇 페이지 및 플로팅 챗봇

공통 버튼/모달/레이아웃 컴포넌트 제작

에러 페이지/스플래시 및 전반적인 UI 다듬기

**천수겸**  
API 설계 및 DB 구조 초안

자체 백엔드 서버 구축 및 연동 예정 (별도 레포/발표)

---

## 설치 & 실행 방법

**bash**
코드 복사

**의존성 설치**

npm install

**개발 서버 실행**

npm run dev

**프로덕션 빌드**

npm run build

---

## 라이선스

본 프로젝트는 교육 및 포트폴리오 목적으로 제작되었습니다.
상업적 사용 또는 2차 배포 시에는 팀과 먼저 협의가 필요합니다.






