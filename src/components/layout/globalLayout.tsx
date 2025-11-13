import Header from "./Header";
import FooterNav from "./FooterNav";
import FloatingChatbot from "../chatbot/FloatingChatbot";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HeaderProvider, useHeader } from "../../contexts/HeaderContext";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollButton from "../common/buttons/ScrollButton";
import { useFeedData } from "../../hooks/useFeedData";
//zustand 전역
import { useFeedStore } from "../../contexts/useFeedStore";


// import { relative } from "path";

const LayoutContainer = styled.div<{ $isProfile?: boolean }>`
position: relative;
  max-width: 600px;
  width: 100%;
  height: 100vh;
  min-height: ${(props) => (props.$isProfile ? "100vh" : "auto")};
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #eeeeee;
`;

const MainContent = styled.main<{
  $hasFooter: boolean;
  $isProfile?: boolean;
  $isChatRoom?: boolean;
  $isPostDetail?: boolean;
}>`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 100%;
  /* padding: ${(props) =>
    props.$isPostDetail ? "68px 25px 0" : "68px 15px 0"}; */
  padding: 68px 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
 / * padding-bottom: ${(props) => {
   if (props.$isProfile) return "0";
   return props.$hasFooter ? "110px" : "50px";
 }}; * /
  padding-bottom: 110px;
  background-color: ${(props) =>
    props.$isChatRoom ? "var(--color-gray-light)" : "#fff"};
`;

const RefreshAlert = styled.div<{$letter: boolean, $height: number}>`
  position: absolute;
  top: 48px;
  width: 100%;
  height: ${(props)=>props.$height}px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 120;
  text-align: center;
  padding: 25px 0;
  margin-bottom: 10px;
  animation : ${(props)=>props.$height > 0 && 'opacityStype 0.7s ease-in-out'};
  letter-spacing : ${(props)=>props.$letter ? '2px' : '0'};
  font-size: 1.8rem;
  font-weight: 600;
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
  }
  span {
    display: inline-block;
    width: ${(props)=>props.$letter ? 'auto' : '0'};
    height: ${(props)=>props.$letter ? 'auto' : '0'};
    opacity: ${(props)=>props.$letter ? '1' : '0'};
    overflow: hidden;
    transition: all 0.7s;
    color: var(--color-primary-500);
  }

  @keyframes opacityStype {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

function LayoutContent() {
  const location = useLocation();
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();

  //drag 이벤트
  const [pull, setPull] = useState(0);
  const startYRef = useRef(0);
  const currentPullRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isLetterRef = useRef(false);
  const hasMoveRef = useRef(false);
  const { scrollContainerRef } = useFeedData();

  const fetchFeeds = useFeedStore((state) => state.fetchFeeds);

  useEffect(() => {
    const path = location.pathname;
    if (path !== '/feed') return; // main feed 페이지에서만 작동합니다

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleDragStart = (clientY: number) => {
      if (container.scrollTop === 0) {
        isDraggingRef.current = true;
        startYRef.current = clientY;
        isLetterRef.current = false;
        hasMoveRef.current = false;
      }
    };


    const handleDragMove = (clientY: number, preventDefault: () => void) => {
      if (!isDraggingRef.current) return;

      const distance = clientY - startYRef.current;

      if(Math.abs(distance) > 7) {
        hasMoveRef.current = true
      }

      if (distance > 0) {
        preventDefault();
        setPull(Math.min(distance, 120)); // 최대 100px까지만
        container.style.transform = `translateY(${Math.min(distance, 120)}px)`;
        currentPullRef.current = Math.min(distance, 120);
      }

      if( distance > 70) {
        preventDefault();
        isLetterRef.current = true;
      }
    };


    const handleDragEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        container.style.transform = `translateY(0px)`;
        setPull(0);
        isLetterRef.current = false;

        if(hasMoveRef.current && currentPullRef.current > 80) {
          fetchFeeds();
        }

        hasMoveRef.current = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => handleDragStart(e.clientY);
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY, () => e.preventDefault());
    const handleMouseUp = () => handleDragEnd();

    const handleTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientY, () => e.preventDefault());
    const handleTouchEnd = () => handleDragEnd();


    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);

      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleMouseUp);

    };
  }, []);



  // 경로별 헤더 자동 설정
  useEffect(() => {
    const path = location.pathname;

    // Header를 숨길 경로들 (가장 먼저 체크)
    if (
      path === "/login" ||
      path === "/login/email" ||
      path === "/signup" ||
      path === "/profile/setup" ||
      path === "/404"
    ) {
      setHeaderConfig({ show: false });
      return;
    }

    // 팔로우 페이지 - 자체적으로 헤더 관리
    if (path.match(/^\/profile\/[^/]+\/(followers|following)$/)) {
      return;
    }

    // 프로필 셋업 (정확한 경로 체크)
    // if (path === "/profile/setup") {
    //   setHeaderConfig({
    //     show: true,
    //     type: "edit",
    //     inputState: true,
    //     onBackClick: () => navigate("/login"),
    //     onButtonClick: () => console.log("프로필 설정 완료"),
    //   });
    //   return;
    // }

    // 프로필 수정 -> 경로 체크
    if (path === "/profile/edit") {
      setHeaderConfig({
        show: true,
        type: "edit",
        onBackClick: () => navigate(-1),
      });
      return;
    }

    // 프로필 페이지 - 자체적으로 헤더 관리
    if (path === "/profile" || path.match(/^\/profile\/[^/]+$/)) {
      return;
    }

    // 게시글 상세 (게시글 작성보다 먼저 체크)
    if (path.match(/^\/post\/[^/]+$/)) {
      setHeaderConfig({
        show: true,
        type: "postDetail",
        onBackClick: () => navigate(-1),
        onMoreClick: () => console.log("더보기"),
      });
      return;
    }

    // 게시글 작성
    if (path === "/post") {
      setHeaderConfig({
        show: true,
        type: "post",
        onBackClick: () => navigate(-1),
      });
      return;
    }

    // 검색 페이지
    if (path === "/search") {
      setHeaderConfig({
        show: true,
        type: "search",
        onBackClick: () => navigate(-1),
      });
      return;
    }

    // 상품 추가
    if (path === "/product") {
      setHeaderConfig({
        show: true,
        type: "product",
        onBackClick: () => navigate(-1),
      });
      return;
    }

    // 상품 상세
    if (path.match(/^\/product\/[^/]+$/)) {
      setHeaderConfig({
        show: true,
        type: "productDetail",
        onBackClick: () => navigate(-1),
        onMoreClick: () => console.log("더보기"),
      });
      return;
    }

    // 🆕 상품 수정 - 폼 관련 설정 제거 (상품 상세보다 뒤에 위치)
    if (path.match(/^\/product\/[^/]+\/edit$/)) {
      setHeaderConfig({
        show: true,
        type: "edit",
        inputState: true, // 삭제
        onBackClick: () => navigate(-1),
        onButtonClick: () => console.log("상품 수정 완료"), // 삭제
      });
      return;
    }

    // 채팅 리스트
    if (path === "/chat-list") {
      setHeaderConfig({
        show: true,
        type: "chatList",
        onBackClick: () => navigate(-1),
      });
      return;
    }

    // 채팅 방
    if (path.includes("/chat-room")) {
      setHeaderConfig({
        show: true,
        type: "chat",
        userName: "잉어킹",
        onBackClick: () => navigate(-1),
      });
      return;
    }

    // 기본 (피드)
    setHeaderConfig({
      show: true,
      type: "feed",
      onSearchClick: () => navigate("/search"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Nav 있을 부분
  const shouldShowNav = (): boolean => {
    const path = location.pathname;

    const showNavPaths = ["/", "/feed", "/search", "/chat-list"];

    // 프로필 페이지인지 체크 (동적 라우트 포함)
    const isProfilePath =
      path === "/profile" || path.match(/^\/profile\/[^/]+$/);

    return showNavPaths.includes(path) || !!isProfilePath;
  };

  const isProfilePage =
    location.pathname === "/profile" ||
    !!location.pathname.match(/^\/profile\/[^/]+$/);

  const isPostDetailPage = location.pathname.match(/^\/post\/[^/]+$/);

  return (
    <>
      <LayoutContainer $isProfile={isProfilePage}>
        <Header />
        {pull !==0 && (
        <RefreshAlert $letter={isLetterRef.current} $height={pull}>
          <p>땡겨서 <span>피쉬마켓</span> 새로고침</p>
        </RefreshAlert>
        )}
        <AnimatePresence mode="wait">
          <MainContent
            key={location.pathname}
            $hasFooter={shouldShowNav()}
            $isProfile={isProfilePage}
            $isPostDetail={!!isPostDetailPage}
            as={motion.main}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            ref={scrollContainerRef}
          >
            <Outlet />
          </MainContent>
        </AnimatePresence>
        {shouldShowNav() && <FooterNav />}
      </LayoutContainer>
      {/* 플로팅 챗봇 - position: fixed로 전역에 표시 */}
      <FloatingChatbot />
      <ScrollButton scrollContainerRef={scrollContainerRef}></ScrollButton>
    </>
  );
}

export default function GlobalLayout() {
  return (
    <HeaderProvider>
      <LayoutContent />
    </HeaderProvider>
  );
}
