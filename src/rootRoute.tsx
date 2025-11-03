import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react"
import GlobalLayout from "./components/layout/globalLayout";
import Login from "./pages/login/Login";
import LoginEmail from "./pages/login/LoginEmail";
import Signup from "./pages/signup/Signup";
import ProfileSetup from "./pages/profile/ProfileSetup";
import ProfileEdit from "./pages/profile/ProfileEdit";

import SearchPage from "./pages/Search/SearchPage";

import PostWrite from "./components/PostWrite";
import FeedPage from "./pages/Home/FeedPage";
import PostCardTest from "./pages/PostCardTest";


export default function RootRoute() {
  return (
    <AnimatePresence>
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/login/email" element={<LoginEmail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/setup" element={<ProfileSetup />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />


        {/* 나머지 route 경로 수정 */}
        <Route path="/search" />

        <Route path="/post" element={<PostWrite />} />
        <Route path="/postcard-test" element={<PostCardTest />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/search" element={<SearchPage />} />
          <Route path="/post" element={<PostWrite />}/>

          <Route path="/chat-list" />
          <Route path="/chat-room" />

          <Route path="/404" />
      </Route>
    </Routes>
    </AnimatePresence>
  );
}
