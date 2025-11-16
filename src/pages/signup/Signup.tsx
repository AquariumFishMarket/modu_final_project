import React, { useState } from "react";
import AuthForm from "../../components/common/auth/AuthForm";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { signup, login } from "../../services/authService";
import { saveToken } from "../../utils/tokenManager";
import { useAuth } from "../../contexts/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateEmailDuplicate,
} from "../../utils/validation/AuthValidation";

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

  span {
    font-weight: 700;
  }
`;

export default function Signup() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUserInfo } = useAuth();

  // 회원가입 폼 필드 설정
  const signupFields = [
    {
      type: "email" as const,
      name: "email",
      label: "이메일",
      placeholder: "이메일 주소를 입력해 주세요.",
      required: true,
      validator: async (value: string) => {
        const formatError = validateEmail(value);
        if (formatError) return formatError;

        const duplicateError = await validateEmailDuplicate(value);
        console.log("이메일 중복 체크: ", duplicateError);
        return duplicateError || "";
      },
    },
    {
      type: "password" as const,
      name: "password",
      label: "비밀번호",
      placeholder: "비밀번호를 입력해 주세요.",
      required: true,
      validator: validatePassword,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signup(email, password);

      const loginResult = await login(email, password);

      saveToken(loginResult.token);

      await refreshUserInfo(); // 사용자 정보 즉시 갱신

      alert("회원가입이 완료되었습니다. 프로필을 설정해주세요.");

      navigate("/profile/setup");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Signuptitle>회원가입</Signuptitle>
      <AuthForm
        fields={signupFields}
        buttonText={isSubmitting ? "처리 중..." : "회원가입"}
        onSubmit={handleSubmit}
        formError={formError}
      />
      <LoginLink to={"/login/email"}>
        이미 계정이 있으신가요? <span>이메일로 로그인</span>
      </LoginLink>
    </>
  );
}
