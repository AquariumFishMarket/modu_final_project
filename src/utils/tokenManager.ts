// 토큰 관리 유틸리티

// 토큰 저장
export const saveToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

// 토큰 조회
export const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// 토큰 삭제
export const removeToken = (): void => {
  localStorage.removeItem("authToken");
};

// 토큰 존재 여부로 인증 상태 확인
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
