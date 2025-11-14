import React, { useState } from "react";
import AuthForm from "../../components/common/auth/AuthForm";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { signup, login } from "../../services/authService";
import { saveToken } from "../../utils/tokenManager";
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
`;

export default function Signup() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // // 이메일 중복 체크 함수 분리
  // const handleEmailCheck = async (email: string) => {
  //   if (!email) return;

  //   setEmailStatus((prev) => ({ ...prev, checking: true }));
  //   setError(null);

  //   try {
  //     const res = await checkEmailDuplicate(email);
  //     console.log("중복 체크 응답:", res);

  //     const isAvailable = res.message === "사용 가능한 이메일 입니다.";

  //     setEmailStatus({
  //       checking: false,
  //       checked: true,
  //       available: isAvailable,
  //       message: res.message,
  //     });

  //     if (!isAvailable) {
  //       setError(res.message);
  //     }
  //   } catch (error) {
  //     console.error("이메일 중복 체크 에러:", error);
  //     setEmailStatus({
  //       checking: false,
  //       checked: false,
  //       available: false,
  //       message: "이메일 중복 확인에 실패했습니다.",
  //     });
  //     setError(
  //       error instanceof Error
  //         ? error.message
  //         : "이메일 중복 확인에 실패했습니다."
  //     );
  //   }
  // };

  // 회원가입 폼 필드 설정 (validator 연결)
  const signupFields = [
    {
      type: "email" as const,
      name: "email",
      label: "이메일",
      placeholder: "이메일 주소를 입력해 주세요.",
      required: true,
      validator: async (value: string) => {
        // 형식 검사
        const formatError = validateEmail(value);
        if (formatError) return formatError;
        // 중복 검사
        const duplicateError = await validateEmailDuplicate(value);
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
      alert("회원가입이 완료되었습니다. 프로필을 설정해주세요.");
      navigate("/profile/setup");
    } catch (err) {
      // 실패 시 alert 대신 하단 메시지로만 표시
      setFormError(
        err instanceof Error ? err.message : "회원가입에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = (): void => {
    console.log("회원가입 버튼 클릭");
  };

  return (
    <>
      <Signuptitle>회원가입</Signuptitle>
      <AuthForm
        fields={signupFields}
        buttonText={isSubmitting ? "처리 중..." : "회원가입"}
        onSubmit={handleSubmit}
        onButtonClick={handleButtonClick}
      />
      {/* 폼 전체 에러 메시지 (예: 회원가입 실패) */}
      {formError && (
        <div
          style={{
            color: "var(--color-error)",
            textAlign: "center",
            marginTop: "12px",
          }}
        >
          {formError}
        </div>
      )}
      <LoginLink to={"/login/email"}>이미 계정이 있으신가요? 로그인</LoginLink>
    </>
  );
}
