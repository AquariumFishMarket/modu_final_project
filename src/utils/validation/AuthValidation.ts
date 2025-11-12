import { checkEmailDuplicate } from "../../services/authService";

// 이메일 형식 및 필수 입력 검사
export const validateEmail = (email: string): string => {
  if (!email.trim()) return "이메일을 입력해 주세요.";
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return "";
};

// 이메일 중복 검사 (비동기)
export const validateEmailDuplicate = async (
  email: string
): Promise<string | null> => {
  try {
    const result = await checkEmailDuplicate(email);

    if (result.message === "사용 가능한 이메일 입니다.") {
      return null;
    }
    if (result.message === "이미 가입된 이메일 주소 입니다.") {
      return "이미 사용 중인 이메일입니다.";
    }
    if (result.message === "잘못된 접근입니다.") {
      return "잘못된 접근입니다.";
    }
    if (result.message === "잘못된 이메일 형식입니다.") {
      return "올바른 이메일 형식이 아닙니다.";
    }
    return "이메일 확인 중 오류가 발생했습니다.";
  } catch {
    return "이메일 중복 확인 중 오류가 발생했습니다.";
  }
};

// 비밀번호 형식 및 필수 입력 검사
export const validatePassword = (password: string): string => {
  if (!password) return "비밀번호를 입력해 주세요.";
  if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  // 필요 시 추가 규칙(특수문자, 숫자 등)도 여기에 추가
  return "";
};
