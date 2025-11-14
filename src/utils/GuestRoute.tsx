import { ReactNode } from "react";
import ExceptionPage from "../pages/errPage/ExceptionPage";
import { useAuth } from "../contexts/AuthContext";
interface Props {
  children: ReactNode;
}


//login z

export default function GuestRoute({children}:Props) {
    const { isAuthenticated, isLoading } = useAuth();

    if(isLoading) return null;
    if(!isAuthenticated) return <ExceptionPage text="로그인이 필요한 서비스입니다! :)" type="guest" />
    return <>{children}</>
}