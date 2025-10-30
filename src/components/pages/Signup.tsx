import React from "react";
import AuthForm from "../common/AuthForm";
import styled from "styled-components";

const Header = styled.header`
  margin: 30px auto 40px;
  font-size: 24px;
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
      <Header>회원가입</Header>
      <main>
        <AuthForm
          fields={signupFields}
          buttonText="회원가입"
          onSubmit={handleSubmit}
          onButtonClick={handleButtonClick}
          disabled={true}
        />
      </main>
    </>
  );
}
