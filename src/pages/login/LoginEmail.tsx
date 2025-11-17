import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/auth/AuthForm";
import styled from "styled-components";
import { useAuthStore } from "../../contexts/useAuthStore";

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

  span {
    font-weight: 700;
  }
`;

export default function LoginEmail() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [formError, setFormError] = useState<string>("");

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("로그인 에러 확인: ", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  return (
    <>
      <LoginTitle>로그인</LoginTitle>
      <AuthForm
        fields={loginFields}
        buttonText={isLoading ? "로그인 중..." : "로그인"}
        onSubmit={handleSubmit}
        disabled={isLoading}
        formError={formError}
      />

      <SignupLink to="/signup">
        처음이신가요? <span>이메일로 회원가입</span>
      </SignupLink>
    </>
  );
}
