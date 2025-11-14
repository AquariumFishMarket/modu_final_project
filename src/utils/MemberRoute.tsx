import { ReactNode } from "react";
import ExceptionPage from "../pages/errPage/ExceptionPage";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: ReactNode;
}

//login 되어있을때

export default function MemberRoute({children}:Props) {
  const { isAuthenticated, isLoading } = useAuth();

  if(isLoading) return null;
  if (isAuthenticated) return <ExceptionPage text="이미 로그인 되어있어요 :)" type="member" />
  return <>{children}</>
}