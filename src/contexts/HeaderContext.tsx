import { createContext, useContext, useState, ReactNode } from "react";

// Header 타입 정의
export type HeaderType =
  | "feed"
  | "search"
  | "followers"
  | "profile"
  | "edit"
  | "post"
  | "chatList"
  | "chat";

// Header 설정 인터페이스
export interface HeaderConfig {
  show: boolean;
  type?: HeaderType;
  title?: string;
  userName?: string; // chat type에서 사용
  inputState?: boolean; // edit, post type에서 사용
  onBackClick?: () => void;
  onSearchClick?: () => void;
  onMoreClick?: () => void;
  onButtonClick?: () => void;
}

// Context 타입
interface HeaderContextType {
  config: HeaderConfig;
  setHeaderConfig: (config: Partial<HeaderConfig>) => void;
}

// Context 생성
const HeaderContext = createContext<HeaderContextType | null>(null);

// Provider 컴포넌트
export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<HeaderConfig>({
    show: true,
    type: "feed",
  });

  const setHeaderConfig = (newConfig: Partial<HeaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <HeaderContext.Provider value={{ config, setHeaderConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

// Custom Hook
export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within HeaderProvider");
  }
  return context;
};
