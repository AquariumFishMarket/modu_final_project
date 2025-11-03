import Header from "../common/Header";
import FooterNav from "../common/FooterNav";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

const LayoutContainer = styled.div`
  max-width: 600px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow-y: hidden;
  background-color: #fff;
  border: 1px solid #eeeeee;
`;

const MainContent = styled.main<{ $hasFooter: boolean }>`
  padding-top: 68px;
  padding-left: 15px;
  padding-right: 15px;
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: ${(props) => (props.$hasFooter ? "110px" : "50px")};
`;

export default function GlobalLayout() {
  const location = useLocation();

  // FooterNav를 숨길 경로들
  const hideNavPaths = [
    "/post",
    "/signup",
    "/login",
    "/login/email",
    "/profile/setup",
    "/profile/edit",
  ];

  // Header를 숨길 경로들
  const hideHeadPaths = ["/login", "/login/email", "/signup", "/profile/setup"];

  // 현재 경로가 숨김 목록에 있는지 확인
  const shouldHideNav = hideNavPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const shouldHideHead = hideHeadPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <LayoutContainer>
      {!shouldHideHead && <Header />}
      <MainContent $hasFooter={!shouldHideNav}>
        <Outlet />
      </MainContent>
      {!shouldHideNav && <FooterNav />}
    </LayoutContainer>
  );
}
