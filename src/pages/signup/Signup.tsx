import React, { useState } from "react";
import AuthForm from "../../components/common/auth/AuthForm";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { checkEmailDuplicate, signup, login } from "../../services/authService";
import { saveToken } from "../../utils/tokenManager";

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
  const [error, setError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    checking: boolean;
    checked: boolean;
    available: boolean;
    message: string;
  }>({ checking: false, checked: false, available: false, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이메일 중복 체크 함수 분리
  const handleEmailCheck = async (email: string) => {
    if (!email) return;

    console.log("이메일 중복 체크 시작:", email);
    setEmailStatus((prev) => ({ ...prev, checking: true }));
    setError(null);

    try {
      const res = await checkEmailDuplicate(email);
      console.log("중복 체크 응답:", res);

      const isAvailable = res.message === "사용 가능한 이메일 입니다.";

      setEmailStatus({
        checking: false,
        checked: true,
        available: isAvailable,
        message: res.message,
      });

      if (!isAvailable) {
        setError(res.message);
      }
    } catch (err) {
      console.error("이메일 중복 체크 에러:", err);
      setEmailStatus({
        checking: false,
        checked: false,
        available: false,
        message: "이메일 중복 확인에 실패했습니다.",
      });
      setError(
        err instanceof Error ? err.message : "이메일 중복 확인에 실패했습니다."
      );
    }
  };

  // 회원가입 폼 필드 설정
  const signupFields = [
    {
      type: "email" as const,
      name: "email",
      label: "이메일",
      placeholder: "이메일 주소를 입력해 주세요.",
      required: true,
      onBlur: async (e: React.FocusEvent<HTMLInputElement>) => {
        await handleEmailCheck(e.target.value);
      },
    },
    {
      type: "password" as const,
      name: "password",
      label: "비밀번호",
      placeholder: "비밀번호를 입력해 주세요.",
      required: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // const username = (formData.get("username") as string) || "";
    // const accountname = (formData.get("accountname") as string) || "";
    // const intro = (formData.get("intro") as string) || "";
    // const image = (formData.get("image") as string) || "";

    // 이메일 중복 체크가 진행 중인 경우
    if (emailStatus.checking) {
      setError("이메일 중복 확인 중입니다. 잠시만 기다려주세요.");
      return;
    }

    if (!emailStatus.checked) {
      console.log("이메일 중복 체크 미완료, 자동으로 체크 시작");
      setError("이메일 중복 확인 중입니다...");

      // 자동으로 중복 체크 실행
      try {
        await handleEmailCheck(email);
        // 체크 완료 후 다시 제출 시도하지 않고 사용자가 다시 클릭하도록 함
        setError("이메일 중복 확인이 완료되었습니다. 다시 시도해주세요.");
        return;
      } catch {
        setError("이메일 중복 확인에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      console.log("1. 회원가입 시작");
      await signup(email, password);
      console.log("회원가입 성공");

      console.log("2. 자동 로그인 시작");
      const loginResult = await login(email, password);
      console.log("로그인 성공:", loginResult);

      console.log("3. 토큰 저장");
      saveToken(loginResult.token);

      setError(null);
      alert("회원가입이 완료되었습니다. 프로필을 설정해주세요.");

      console.log("4. 프로필 설정 페이지로 이동");
      navigate("/profile/setup");
      // navigate("/login/email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
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
      {/* 나중에 빼기  */}
      {error && (
        <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          {error}
        </div>
      )}
      <LoginLink to={"/login/email"}>이메일로 로그인</LoginLink>
    </>
  );
}
