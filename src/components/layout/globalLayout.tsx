import Header from "../common/Header";
import FooterNav from "../common/FooterNav";
// import ProfileImg from "../common/ProfileImg";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.main<{ $hasFooter: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: ${(props) => (props.$hasFooter ? "60px" : "0")};
`;

export default function GlobalLayout() {
  const location = useLocation();

  // FooterNav를 숨길 경로들
  const hideNavPaths = ["/post", "/signup", "/login"];

  // Header를 숨길 경로들
  const hideHeadPaths = ["/login", "/login/email", "signup"];

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
        {/* <ProfileImg thumbimg={false} width={110} /> */}
        <Outlet />
      </MainContent>
      {!shouldHideNav && <FooterNav />}
    </LayoutContainer>
  );
}
