import React from "react";
import AuthForm from "../common/AuthForm";
import styled from "styled-components";

const Header = styled.header`
  margin: 30px auto;
  font-size: 24px;
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
      <Header>로그인</Header>
      <main>
        <AuthForm
          fields={loginFields}
          buttonText="로그인"
          onSubmit={handleSubmit}
          onButtonClick={handleButtonClick}
          disabled={true}
        />
      </main>
    </>
  );
}
