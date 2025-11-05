import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import GlobalLayout from "./components/layout/globalLayout";
import Login from "./pages/login/Login";
import LoginEmail from "./pages/login/LoginEmail";
import Signup from "./pages/signup/Signup";
import ProfileSetup from "./pages/profile/ProfileSetup";
import Profile from "./components/common/profile/Profile";
import ProfileEdit from "./pages/profile/ProfileEdit";
import SearchPage from "./pages/Search/SearchPage";
import PostWrite from "./pages/post/PostWrite";
import FeedPage from "./pages/Home/FeedPage";
import ProductAdd from "./pages/product/ProductAdd";
import ErrPage from "./pages/errPage/ErrPage";
import ChatRoom from "./pages/chat/ChatRoom";
import ProductDetail from "./pages/product/ProductDetail";

export default function RootRoute() {
  return (
    <AnimatePresence>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<FeedPage />} />
          {/* 로그인, 회원가입 */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/email" element={<LoginEmail />} />
          <Route path="/signup" element={<Signup />} />
          {/* 프로필 */}
          <Route path="/profile/setup" element={<ProfileSetup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          {/* 메인 피드, 검색 */}
          <Route path="/search" element={<SearchPage />} />
          {/* 상품 */}
          <Route path="/product/add" element={<ProductAdd />} />
          <Route path="/product/edit/:id" /> {/* 상품 수정 */}
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* 게시글 */}
          <Route path="/post" element={<PostWrite />} />
          {/* 채팅 */}
          <Route path="/chat-list" />
          <Route path="/chat-room" element={<ChatRoom />}/>
          {/* 에러 페이지 */}
          <Route path="/404" element={<ErrPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
