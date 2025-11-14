import { ReactNode } from "react";
import { isAuthenticated } from "./auth";
import ExceptionPage from "../pages/errPage/ExceptionPage";

interface Props {
  children: ReactNode;
}
const isLogined = isAuthenticated()

//login 되어있을때

export default function MemberRoute({children}:Props) {
    if(isLogined) return <ExceptionPage text="이미 로그인 되어있어요 :)" type="member" />
    return <>{children}</>
}