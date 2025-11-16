import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import RootRoute from "./rootRoute";
import { SearchProvider } from "./contexts/SearchContext";
// import { AuthProvider } from "./contexts/AuthContext";
import { useAuthStore } from "./contexts/useAuthStore";
import { ToastContainer } from "react-toastify";
import Toast from "./components/common/modal/Toast";
import Pusher from "pusher-js";
export const pusher = new Pusher("25b10e3b7afa8175af9e", {
  cluster: "ap3", // 도쿄
});

function App() {
  const refreshUser = useAuthStore((s) => s.refreshUser);
  // const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    // 앱 시작 시 한 번만 수행
    refreshUser();
  }, [refreshUser]);

  return (
    // <AuthProvider>
    <BrowserRouter>
      <SearchProvider>
        <ToastContainer />
        <Toast />
        <RootRoute />
      </SearchProvider>
    </BrowserRouter>
    // </AuthProvider>
  );
}

export default App;
