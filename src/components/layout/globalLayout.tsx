import Header from "./Header";
import FooterNav from "./FooterNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HeaderProvider, useHeader } from "../../contexts/HeaderContext";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// import { relative } from "path";

const LayoutContainer = styled.div<{ $isProfile?: boolean }>`
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
  height: 100%;
  /* padding: ${(props) =>
    props.$isPostDetail ? "68px 25px 0" : "68px 15px 0"}; */
  padding: 68px 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative; //스크롤 버튼을 위해
  padding-bottom: ${(props) => {
    if (props.$isProfile) return "0";
    return props.$hasFooter ? "110px" : "50px";
  }};
  background-color: ${(props) =>
    props.$isChatRoom ? "var(--color-gray-light)" : "#fff"};
`;

function LayoutContent() {
  const location = useLocation();
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();

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
    if (path === "/product/add") {
      setHeaderConfig({
        show: true,
        type: "productAdd",
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

  const isChatRoomPage = location.pathname === "/chat-room";
  const isPostDetailPage = location.pathname.match(/^\/post\/[^/]+$/);

  return (
    <LayoutContainer $isProfile={isProfilePage}>
      <Header />
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
        >
          <Outlet />
        </MainContent>
      </AnimatePresence>
      {shouldShowNav() && <FooterNav />}
    </LayoutContainer>
  );
}

export default function GlobalLayout() {
  return (
    <HeaderProvider>
      <LayoutContent />
    </HeaderProvider>
  );
}
