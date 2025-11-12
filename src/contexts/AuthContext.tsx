import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, saveToken, removeToken } from "../utils/tokenManager";

// 사용자 정보 타입
export interface AuthUser {
  _id: string;
  username: string;
  accountname: string;
  email: string;
  image: string;
  intro: string;
  followerCount: number;
  followingCount: number;
}

// Context 타입 정의
interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  refreshUserInfo: () => Promise<void>;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 사용자 정보 가져오기
  const fetchUserInfo = async (): Promise<AuthUser | null> => {
    try {
      const token = getToken();
      if (!token) {
        return null;
      }

      const response = await fetch(
        "https://dev.wenivops.co.kr/services/mandarin/user/myinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("사용자 정보 가져오기 실패");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
      // 토큰이 유효하지 않으면 제거
      removeToken();
      return null;
    }
  };

  // 초기 로드 시 사용자 정보 확인
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const user = await fetchUserInfo();
      setCurrentUser(user);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 로그인
  const login = (token: string, user: AuthUser) => {
    saveToken(token);
    setCurrentUser(user);
  };

  // 로그아웃
  const logout = () => {
    removeToken();
    setCurrentUser(null);
  };

  // 사용자 정보 업데이트 (프로필 수정 후 등)
  const updateUser = (updatedFields: Partial<AuthUser>) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        ...updatedFields,
      });
    }
  };

  // 사용자 정보 새로고침 (필요할 때 호출)
  const refreshUserInfo = async () => {
    const user = await fetchUserInfo();
    if (user) {
      setCurrentUser(user);
    }
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
