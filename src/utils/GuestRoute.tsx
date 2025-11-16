import { ReactNode, useEffect } from "react";
import ExceptionPage from "../pages/errPage/ExceptionPage";
import { getToken } from "./tokenManager";
import { useAuth } from "../contexts/AuthContext";
interface Props {
  children: ReactNode;
}

//login
export default function GuestRoute({children}:Props) {
  const { isLoading } = useAuth();
    if(isLoading) return null;

    const token = getToken();
    if(!token) return <><ExceptionPage text="로그인이 필요한 서비스입니다! :)" type="guest" /></>
    return <>{children}</>
}