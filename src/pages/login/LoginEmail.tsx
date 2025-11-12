import React, { useState } from "react";
import AuthForm from "../../components/common/auth/AuthForm";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { saveToken } from "../../utils/tokenManager";
import { useAuth } from "../../contexts/AuthContext";

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
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // AuthContext의 login 함수
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log("폼 제출:", e);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.token && result.user) {
        // ✅ AuthContext에 로그인 정보 저장
        authLogin(result.token, {
          _id: result.user._id,
          username: result.user.username,
          accountname: result.user.accountname,
          email: result.user.email,
          image: result.user.image,
          intro: result.user.intro,
          followerCount: 0, // API 응답에 없으면 0으로 설정
          followingCount: 0,
        });

        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패합니다.");
    } finally {
      setIsSubmitting(false);
    }
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

      {error && (
        <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          {error}
        </div>
      )}

      <AuthForm
        fields={loginFields}
        buttonText={isSubmitting ? "로그인 중..." : "로그인"}
        onSubmit={handleSubmit}
        onButtonClick={handleButtonClick}
        disabled={isSubmitting}
      />

      <SignupLink to="/signup">이메일로 회원가입</SignupLink>
    </>
  );
}
