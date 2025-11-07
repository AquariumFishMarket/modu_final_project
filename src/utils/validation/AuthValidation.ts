// 유효성 검사 함수들
export const validateEmail = (email: string): string => {
  if (!email.trim()) return "이메일을 입력해 주세요.";
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "비밀번호를 입력해 주세요.";
  if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  return "";
};
