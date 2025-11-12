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

export default function RootRoute() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 스플래시 - 앱 진입점 */}
        <Route path="/" element={<Splash />} />

        <Route element={<GlobalLayout />}>
          {/* 피드 */}
          <Route path="/feed" element={<FeedPage />} />
          {/* 로그인, 회원가입 */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/email" element={<LoginEmail />} />
          <Route path="/signup" element={<Signup />} />
          {/* 프로필 */}
          <Route path="/profile/setup" element={<ProfileSetup />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route
            path="/profile/:userId/:type"
            element={<Follow key={location.pathname} />}
          />
          <Route
            path="/profile/:userId"
            element={<Profile key={location.pathname} />}
          />
          <Route
            path="/profile"
            element={<Profile key={location.pathname} />}
          />
          {/* 메인 피드, 검색 */}
          <Route path="/search" element={<SearchPage />} />
          {/* 상품 */}
          <Route path="/product/upload" element={<ProductAdd />} />
          <Route path="/product/:id/edit" element={<ProductEdit />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* 게시글 */}
          <Route path="/post" element={<PostWrite />} />
          {/* 상세게시글 */}
          <Route path="/post/:postId" element={<PostDetail />} />
          {/* 채팅 */}
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/chat-room/:roomId" element={<ChatRoom />} />
          {/* 에러 페이지 */}
          <Route path="/404" element={<ErrPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
