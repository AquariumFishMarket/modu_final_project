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

  setUser: (u: AuthUser | null) => void;
  setToken: (t: string | null) => void;

  signup: (email: string, password: string) => Promise<AuthUser | null>;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
  updateUser: (partial: Partial<AuthUser>) => void;
};

export const useAuthStore = create<State>()(
  persist(
    (set, get) => {
      // BroadcastChannel로 로그인/로그아웃 동기화
      try {
        const bc = new BroadcastChannel("auth");
        bc.onmessage = (ev) => {
          const { type, token } = ev.data || {};

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
            set({ token });
          }
        };
      } catch (err) {
        console.warn("BroadcastChannel 초기화 실패:", err);
      }

      return {
        user: null,
        token: getToken() || null,
        isLoading: false,
        error: null,
        lastFetchedAt: null,

        // 사용자 저장
        setUser: (u) => set({ user: u }),

        // 토큰 저장 / 삭제
        setToken: (t) => {
          if (t) {
            // 저장
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
              console.warn("로그인 브로드캐스트 실패:", err);
            }
          } else {
            // 삭제
            try {
              removeToken();
            } catch (err) {
              console.error("토큰 제거 실패:", err);
            }

            try {
              new BroadcastChannel("auth").postMessage({
                type: "logout",
              });
            } catch (err) {
              console.warn("로그아웃 브로드캐스트 실패:", err);
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
              accountname: `account_${timestamp}`,
              email,
              password,
              intro: "",
              image: DEFAULT_PROFILE_IMG,
            };

            await auth.signup(payload);

            const loginData = await auth.login(email, password);
            get().setToken(loginData.token);

            const myInfo = await auth.getMyInfo();
            const user = myInfo.user as AuthUser;

            set({ user, isLoading: false });
            return user;
          } catch (err: any) {
            set({
              isLoading: false,
              error: err?.message || "회원가입 중 오류가 발생했습니다.",
            });
            throw err;
          }
        },

        // 로그인
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            const data = await auth.login(email, password);

            get().setToken(data.token);

            const myInfo = await auth.getMyInfo();
            const user = myInfo.user as AuthUser;

            set({ user, isLoading: false });
            return user;
          } catch (err: any) {
            set({
              isLoading: false,
              error: err?.message || "로그인 중 오류가 발생했습니다.",
            });
            throw err;
          }
        },

        // 로그아웃
        logout: () => {
          try {
            removeToken();
          } catch (err) {
            console.error("토큰 제거 실패:", err);
          }

          try {
            new BroadcastChannel("auth").postMessage({ type: "logout" });
          } catch (err) {
            console.warn("브로드캐스트 로그아웃 실패:", err);
          }

          set({ user: null, token: null });
        },

        // 내 정보 최신화
        refreshUser: async () => {
          set({ isLoading: true, error: null });

          try {
            const token = getToken();
            if (!token) {
              set({ user: null, token: null, isLoading: false });
              return null;
            }

            const payload = await auth.getMyInfo();
            const user = payload.user as AuthUser;

            set({
              user,
              lastFetchedAt: Date.now(),
              isLoading: false,
            });

            return user;
          } catch (err: any) {
            try {
              removeToken();
            } catch (e) {
              console.warn("갱신 실패 중 토큰 제거 오류:", e);
            }

            set({
              user: null,
              token: null,
              isLoading: false,
              error: err?.message || "사용자 정보 갱신 실패",
            });

            return null;
          }
        },

        // 유저 일부 업데이트
        updateUser: (partial) => {
          const u = get().user;
          if (!u) return;

          set({
            user: { ...u, ...partial } as AuthUser,
          });
        },
      };
    },

    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, 
      }),
    }
  )
);
