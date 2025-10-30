import { Routes, Route } from "react-router-dom";
import GlobalLayout from "./components/layout/globalLayout";
import Login from "./components/pages/Login";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/login/email" />
        <Route path="/signup" />
        <Route path="/profile-setting" />

        {/* 나머지 route 경로 수정 */}

        <Route path="/search" />

        <Route path="/post" />

        <Route path="/chat-list" />
        <Route path="/chat-room" />

        <Route path="/404" />
      </Route>
    </Routes>
  );
}
