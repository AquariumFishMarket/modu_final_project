import { ReactNode } from "react";
import { isAuthenticated } from "./auth";
import ExceptionPage from "../pages/errPage/ExceptionPage";

interface Props {
  children: ReactNode;
}
const isLogined = isAuthenticated()

//login 안되어있을때

export default function GuestRoute({children}:Props) {
    if(!isLogined) return <ExceptionPage text="로그인이 필요합니다 :)" type="guest" />
    return <>{children}</>
}