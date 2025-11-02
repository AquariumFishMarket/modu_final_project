import React from "react";
import AuthForm from "../../components/common/auth/AuthForm";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LoginTitle = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin: 0 auto 40px;
`;

const SignupLink = styled(Link)`
  font-size: 12px;
  text-decoration: none;
  color: var(--color-gray-dark);
  width: 100%;
  display: inline-block;
  text-align: center;
  margin: 20px auto;
`;

export default function LoginEmail() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("폼 제출:", e);
  };

  const handleButtonClick = (): void => {
    console.log("로그인 버튼 클릭");
  };

  // 로그인 폼 필드 설정
  const loginFields = [
    {
      type: "email" as const,
      name: "email",
      label: "이메일",
      required: true,
    },
    {
      type: "password" as const,
      name: "password",
      label: "비밀번호",
      required: true,
    },
  ];

  return (
    <>
      <LoginTitle>로그인</LoginTitle>
      <AuthForm
        fields={loginFields}
        buttonText="로그인"
        onSubmit={handleSubmit}
        onButtonClick={handleButtonClick}
      />
      <SignupLink to="/signup">이메일로 회원가입</SignupLink>
    </>
  );
}
