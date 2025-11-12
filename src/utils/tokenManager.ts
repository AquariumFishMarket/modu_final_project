// 토큰 관리 유틸리티
export const saveToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const removeToken = (): void => {
  localStorage.removeItem("authToken");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
