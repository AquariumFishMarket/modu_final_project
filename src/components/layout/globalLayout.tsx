import Header from "../common/Header";
import FooterNav from "../common/FooterNav";
import ProfileImg from "../common/ProfileImg";
import { Outlet, useLocation } from "react-router-dom";

export default function GlobalLayout() {
  const location = useLocation();

  // FooterNav를 숨길 경로들
  const hideNavPaths = ["/post", "/signup", "/login"];

  // 현재 경로가 숨김 목록에 있는지 확인
  const shouldHideNav = hideNavPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <Header />
      <main>
        <ProfileImg thumbimg={false} width={110} />
        <Outlet />
      </main>
      {!shouldHideNav && <FooterNav />}
    </>
  );
}
