import { ReactNode } from "react";
import ExceptionPage from "../pages/errPage/ExceptionPage";
import { getToken } from "./tokenManager";
// import { useAuth } from "../contexts/AuthContext";
import { useAuthStore } from "../contexts/useAuthStore";
interface Props {
  children: ReactNode;
}

//login 되어있을때

export default function MemberRoute({ children }: Props) {
  // const { isLoading } = useAuth();
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return null;
  const token = getToken();
  if (token)
    return (
      <>
        <ExceptionPage text="이미 로그인 되어있어요 :)" type="member" />
      </>
    );
  return <>{children}</>;
}
