import { ReactNode, useEffect } from "react";
import ExceptionPage from "../pages/errPage/ExceptionPage";
import { getToken } from "./tokenManager";
// import { useAuth } from "../contexts/AuthContext";
import { useAuthStore } from "../contexts/useAuthStore";
interface Props {
  children: ReactNode;
}

//login
export default function GuestRoute({ children }: Props) {
  // const { isLoading } = useAuth();
  const isLoading = useAuthStore((s) => s.isLoading);
  if (isLoading) return null;

  const token = getToken();
  if (!token)
    return (
      <>
        <ExceptionPage text="로그인이 필요한 서비스입니다! :)" type="guest" />
      </>
    );
  return <>{children}</>;
}
