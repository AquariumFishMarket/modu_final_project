import React from "react";
import AuthForm from "../../components/common/auth/AuthForm";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Signuptitle = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin: 0 auto 40px;
`;

const LoginLink = styled(Link)`
  font-size: 12px;
  text-decoration: none;
  color: var(--color-gray-dark);
  width: 100%;
  display: inline-block;
  text-align: center;
  margin: 20px auto;
`;

export default function Signup() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("회원가입 폼 제출:", e);
  };

  const handleButtonClick = (): void => {
    console.log("회원가입 버튼 클릭");
  };

  // 회원가입 폼 필드 설정
  const signupFields = [
    {
      type: "email" as const,
      name: "email",
      label: "이메일",
      placeholder: "이메일 주소를 입력해 주세요.",
      required: true,
    },
    {
      type: "password" as const,
      name: "password",
      label: "비밀번호",
      placeholder: "이메일 주소를 입력해 주세요.",
      required: true,
    },
  ];

  return (
    <>
      <Signuptitle>회원가입</Signuptitle>
      <AuthForm
        fields={signupFields}
        buttonText="회원가입"
        onSubmit={handleSubmit}
        onButtonClick={handleButtonClick}
      />
      <LoginLink to={"/login/email"}>이메일로 로그인</LoginLink>
    </>
  );
}
