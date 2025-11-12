// 인증 토큰 관리 유틸리티

const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || "authToken";

/**
 * 로컬 스토리지에서 인증 토큰 가져오기
 */
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

/**
 * 로컬 스토리지에 인증 토큰 저장
 */
export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("토큰 저장 실패:", error);
  }
};

/**
 * 로컬 스토리지에서 인증 토큰 제거
 */
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("토큰 제거 실패:", error);
  }
};

/**
 * 인증 헤더 생성
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * 사용자 로그인 여부 확인
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
