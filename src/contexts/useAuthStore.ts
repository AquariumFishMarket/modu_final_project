import { create } from "zustand";
import { persist } from "zustand/middleware";
import { saveToken, getToken, removeToken } from "../utils/tokenManager";
import * as auth from "../services/authService";

const DEFAULT_PROFILE_IMG = "/img/empty-profile.png";

// 사용자 타입
export interface AuthUser {
  _id: string;
  username: string;
  accountname: string;
  email: string;
  image: string;
  intro: string;
}

type State = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;

  // actions: 유저, 토큰 저장
  setUser: (u: AuthUser | null) => void;
  setToken: (t: string | null) => void;

  signup: (email: string, password: string) => Promise<AuthUser | null>;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
  updateUser: (parital: Partial<AuthUser>) => void;
};

export const useAuthStore = create<State>()(
  persist(
    (set, get) => {
      try {
        const bc = new BroadcastChannel("auth");
        bc.onmessage = (ev) => {
          const { type } = ev.data || {};
          if (type === "logout") {
            set({ user: null, token: null });
            try {
              removeToken();
            } catch (err) {
              console.warn("브로드캐스트 로그아웃 중 토큰 제거 실패:", err);
            }
            window.location.reload();
          }
          if (type === "login") {
            set({ token: ev.data.token });
          }
        };
      } catch (err) {
        console.warn("BroadcastChannel을 사용할 수 없습니다:", err);
      }

      return {
        user: null,
        token: getToken() || null,
        isLoading: false,
        error: null,
        lastFetchedAt: null,

        setUser: (u) => set({ user: u }),
        setToken: (t) => {
          if (t) {
            try {
              saveToken(t);
            } catch (err) {
              console.error("토큰 저장 실패:", err);
            }
            try {
              new BroadcastChannel("auth").postMessage({
                type: "login",
                token: t,
              });
            } catch (err) {
              console.warn("로그인 브로드캐스트 전송 실패:", err);
            }
          } else {
            try {
              removeToken();
            } catch (err) {
              console.error("토큰 제거 실패:", err);
            }
            try {
              new BroadcastChannel("auth").postMessage({ type: "logout" });
            } catch (err) {
              console.warn("로그아웃 브로드캐스트 전송 실패:", err);
            }
          }
          set({ token: t });
        },

        // 회원가입
        signup: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const timestamp = Date.now();
            const payload = {
              username: `user_${timestamp}`,
              email,
              password,
              accountname: `account_${timestamp}`,
              intro: "",
              image: DEFAULT_PROFILE_IMG,
            };

            await auth.signup(payload);

            // 회원가입 뒤 자동 로그인
            const loginData = await auth.login(email, password);

            // 토큰 저장
            const token = loginData.token;
            get().setToken(token);

            // 유저 정보 갱신
            const myInfo = await auth.getMyInfo();
            const user = myInfo.user as AuthUser;
            set({ isLoading: false });
            return user;
          } catch (err: any) {
            const errMsg = err?.message || "회원가입 중 오류가 발생했습니다.";
            set({ isLoading: false, error: errMsg });
            throw err;
          }
        },

        // 로그인
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const data = await auth.login(email, password);
            const token = data.token;
            get().setToken(token);

            // 토큰 저장 후 즉시 사용자 정보 가져오기
            const myInfo = await auth.getMyInfo();
            const user = myInfo.user as AuthUser;

            set({ user, isLoading: false });
            return user;
          } catch (err: any) {
            const errMsg = err?.message || "로그인 중 오류가 발생했습니다.";
            set({ isLoading: false, error: errMsg });
            throw err;
          }
        },

        // 로그아웃
        logout: () => {
          try {
            removeToken();
          } catch (err) {
            console.error("로그아웃 중 토큰 제거 실패:", err);
          }
          try {
            new BroadcastChannel("auth").postMessage({ type: "logout" });
          } catch (err) {
            console.warn("로그아웃 브로드캐스트 전송 실패:", err);
          }
          set({ user: null, token: null });
        },

        // 최신 정보 갱신
        refreshUser: async () => {
          set({ isLoading: true, error: null });
          try {
            const token = getToken();
            if (!token) {
              set({ isLoading: false, user: null });
              return null;
            }
            const payload = await auth.getMyInfo();
            const user = payload.user as AuthUser;

            set({ user, lastFetchedAt: Date.now(), isLoading: false });
            return user;
          } catch (err: any) {
            const errMsg = err?.message || "사용자 정보 갱신 실패";
            // 토큰 무효화 시 제거
            try {
              removeToken();
            } catch (e) {
              console.warn("갱신 실패 중 토큰 제거 오류:", e);
            }
            set({ user: null, token: null, isLoading: false, error: errMsg });
            return null;
          }
        },

        // 일부 변경 업데이트
        updateUser: (partial) => {
          const u = get().user;
          if (!u) return;
          set({ user: { ...u, ...partial } as AuthUser });
        },
      };
    },
    {
      name: "auth-storage", //localStorage key
      partialize: (state) => ({ user: state.user }), // 보안을 위해 토큰을 persist에서 제외
    }
  )
);
