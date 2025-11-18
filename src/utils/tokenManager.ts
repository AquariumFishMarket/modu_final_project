// 토큰 관리 유틸리티
// ✅ 토큰 CRUD만 담당 = 저장소 계층

const TOKEN_KEY = "authToken";

// 토큰 저장
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// 토큰 조회
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 토큰 삭제
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// 요청 header
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
