import Header from "../common/Header";
import FooterNav from "../common/FooterNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HeaderProvider, useHeader } from "../../contexts/HeaderContext";
import { useEffect } from "react";

const LayoutContainer = styled.div<{ $isProfile?: boolean }>`
  max-width: 600px;
  width: 100%;
  height: ${(props) => (props.$isProfile ? "auto" : "100vh")};
  min-height: ${(props) => (props.$isProfile ? "100vh" : "auto")};
  margin: 0 auto;
  overflow-y: ${(props) => (props.$isProfile ? "visible" : "hidden")};
  background-color: #fff;
  border: 1px solid #eeeeee;
`;

const MainContent = styled.main<{ $hasFooter: boolean; $isProfile?: boolean }>`
  padding-top: 68px;
  padding-left: 15px;
  padding-right: 15px;
  height: ${(props) => (props.$isProfile ? "auto" : "100vh")};
  overflow-x: hidden;
  overflow-y: ${(props) => (props.$isProfile ? "visible" : "auto")};
  padding-bottom: ${(props) => {
    if (props.$isProfile) return "0";
    return props.$hasFooter ? "110px" : "50px";
  }};
  background-color: #fafafa;
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
      path === "/signup"
    ) {
      setHeaderConfig({ show: false });
      return;
    }

    // 프로필 셋업 (정확한 경로 체크)
    if (path === "/profile/setup") {
      setHeaderConfig({
        show: true,
        type: "edit",
        inputState: true,
        onBackClick: () => navigate("/login"),
        onButtonClick: () => console.log("프로필 설정 완료"),
      });
      return;
    }

    // 프로필 수정 (정확한 경로를 먼저 체크)
    if (path === "/profile/edit") {
      setHeaderConfig({
        show: true,
        type: "edit",
        inputState: true,
        onBackClick: () => navigate("/profile"),
        onButtonClick: () => console.log("저장"),
      });
      return;
    }

    // 프로필 페이지 (edit 이후에 체크)
    if (path === "/profile") {
      setHeaderConfig({
        show: true,
        type: "profile",
        onBackClick: () => navigate("/"),
        onMoreClick: () => console.log("더보기"),
      });
      return;
    }

    // 게시글 작성
    if (path === "/post") {
      setHeaderConfig({
        show: true,
        type: "post",
        inputState: true,
        onBackClick: () => navigate("/"),
        onButtonClick: () => console.log("업로드"),
      });
      return;
    }

    // 검색 페이지
    if (path === "/search") {
      setHeaderConfig({
        show: true,
        type: "search",
        onBackClick: () => navigate("/"),
      });
      return;
    }

    // 상품 추가
    if (path === "/product/add") {
      setHeaderConfig({
        show: true,
        type: "edit",
        inputState: true,
        onBackClick: () => navigate("/"),
        onButtonClick: () => console.log("상품 등록"),
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

  // FooterNav를 숨길 경로들
  const hideNavPaths = [
    "/post",
    "/signup",
    "/login",
    "/login/email",
    "/profile/setup",
    "/profile/edit",
    "/product/add",
  ];

  // 현재 경로가 숨김 목록에 있는지 확인
  const shouldHideNav = hideNavPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const isProfilePage = location.pathname === "/profile";

  return (
    <LayoutContainer $isProfile={isProfilePage}>
      <Header />
      <MainContent $hasFooter={!shouldHideNav} $isProfile={isProfilePage}>
        <Outlet />
      </MainContent>
      {!shouldHideNav && <FooterNav />}
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
