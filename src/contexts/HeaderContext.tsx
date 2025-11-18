import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// Header 타입 정의
export type HeaderType =
  | "feed"
  | "search"
  | "follower"
  | "followers"
  | "following"
  | "profile"
  | "edit"
  | "post"
  | "postDetail"
  | "chatList"
  | "chat"
  | "product"
  | "productDetail";

// Header 설정 인터페이스
export interface HeaderConfig {
  show: boolean;
  type?: HeaderType;
  title?: string;
  userName?: string; // chat type에서 사용
  inputState?: boolean; // edit, post type에서 사용
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  onBackClick?: () => void;
  onSearchClick?: () => void;
  onMoreClick?: () => void;
  onButtonClick?: () => void;
  pageTitle?: string;
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
    pageTitle: "물고기마켓",
  });

  const setHeaderConfig = useCallback((newConfig: Partial<HeaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

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
