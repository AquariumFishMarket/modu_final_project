import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import GlobalLayout from "./components/layout/globalLayout";
import Login from "./pages/login/Login";
import LoginEmail from "./pages/login/LoginEmail";
import Signup from "./pages/signup/Signup";
import ProfileSetup from "./pages/profile/ProfileSetup";
import Profile from "./pages/profile/components/Profile";
import ProfileEdit from "./pages/profile/ProfileEdit";
import SearchPage from "./pages/search/SearchPage";
import PostWrite from "./pages/post/PostWrite";
import PostDetail from "./pages/post/PostDetail";
import FeedPage from "./pages/home/FeedPage";
import ProductAdd from "./pages/product/ProductAdd";
import ErrPage from "./pages/errPage/ErrPage";

import Splash from "./pages/splash/Splash";

import ChatRoom from "./pages/chat/ChatRoom";
import ChatList from "./pages/chat/ChatList";
import ProductDetail from "./pages/product/ProductDetail";
import ProductEdit from "./pages/product/ProductEdit";
import Follow from "./pages/follow/follow";

//login 가드
import MemberRoute from "./utils/MemberRoute";
import GuestRoute from "./utils/GuestRoute";

export default function RootRoute() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 스플래시 - 앱 진입점 */}
        <Route path="/" element={<Splash />} />
        <Route element={<GlobalLayout />}>
          {/* 로그인, 회원가입 */}
          <Route
            path="/login"
            element={
              <MemberRoute>
                <Login />
              </MemberRoute>
            }
          />
          <Route
            path="/login/email"
            element={
              <MemberRoute>
                <LoginEmail />
              </MemberRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <MemberRoute>
                <Signup />
              </MemberRoute>
            }
          />
          {/* 피드 */}
          <Route
            path="/feed"
            element={
              <GuestRoute>
                <FeedPage />
              </GuestRoute>
            }
          />
          {/* 프로필 */}
          <Route
            path="/profile/setup"
            element={
              <GuestRoute>
                <ProfileSetup />
              </GuestRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <GuestRoute>
                <ProfileEdit />
              </GuestRoute>
            }
          />
          <Route
            path="/profile/:accountname/:type"
            element={
              <GuestRoute>
                <Follow key={location.pathname} />
              </GuestRoute>
            }
          />
          <Route
            path="/profile/:accountname"
            element={
              <GuestRoute>
                <Profile key={location.pathname} />
              </GuestRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <GuestRoute>
                <Profile key={location.pathname} />
              </GuestRoute>
            }
          />
          {/* 메인 피드, 검색 */}
          <Route
            path="/search"
            element={
              <GuestRoute>
                <SearchPage />
              </GuestRoute>
            }
          />
          {/* 상품 */}
          <Route
            path="/product"
            element={
              <GuestRoute>
                <ProductAdd />
              </GuestRoute>
            }
          />
          <Route
            path="/product/:id/edit"
            element={
              <GuestRoute>
                <ProductEdit />
              </GuestRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <GuestRoute>
                <ProductDetail />
              </GuestRoute>
            }
          />
          {/* 게시글 */}
          <Route
            path="/post"
            element={
              <GuestRoute>
                <PostWrite />
              </GuestRoute>
            }
          />
          {/* 게시글 수정 */}
          <Route
            path="/post/:postId/edit"
            element={
              <GuestRoute>
                <PostWrite />
              </GuestRoute>
            }
          />
          {/* 상세게시글 */}
          <Route
            path="/post/:postId"
            element={
              <GuestRoute>
                <PostDetail />
              </GuestRoute>
            }
          />
          {/* 채팅 */}
          <Route
            path="/chat-list"
            element={
              <GuestRoute>
                <ChatList />
              </GuestRoute>
            }
          />
          <Route
            path="/chat-room/:roomId"
            element={
              <GuestRoute>
                <ChatRoom />
              </GuestRoute>
            }
          />
          {/* 에러 페이지 */}
          <Route path="/404" element={<ErrPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
