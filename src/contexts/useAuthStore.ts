import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  saveToken,
  getToken,
  removeToken,
  getAuthHeaders,
} from "../utils/tokenManager";
import { AuthResponse } from "../services/authService";

const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";
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
              console.warn("removeToken failed during broadcast logout:", err);
            }
          }
          if (type === "login") {
            set({ token: ev.data.token });
          }
        };
      } catch (err) {
        console.warn("BroadcastChannel unavailable:", err);
        // bc = null;
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
              console.error("saveToken failed:", err);
            }
            try {
              new BroadcastChannel("auth").postMessage({
                type: "login",
                token: t,
              });
            } catch (err) {
              console.warn("BroadcastChannel postMessage(login) failed:", err);
            }
          } else {
            try {
              removeToken();
            } catch (err) {
              console.error("removeToken failed:", err);
            }
            try {
              new BroadcastChannel("auth").postMessage({ type: "logout " });
            } catch (err) {
              console.warn("BroadcastChannel postMessage(logout) failed:", err);
            }
          }
          set({ token: t });
        },

        // 회원가입
        signup: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const timestamp = Date.now();
            const tempUsername = `user_${timestamp}`;
            const tempAccountname = `account_${timestamp}`;

            const res = await fetch(`${BASE_URL}/user`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: {
                  username: tempUsername,
                  email,
                  password,
                  accountname: tempAccountname,
                  intro: "",
                  image: DEFAULT_PROFILE_IMG,
                },
              }),
            });

            const data: AuthResponse = await res.json();
            if (!res.ok) {
              const msg = data.message || "회원가입 실패";
              throw new Error(msg);
            }

            // 회원가입 뒤 자동 로그인 토큰
            const loginRes = await fetch(`${BASE_URL}/user/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user: { email, password } }),
            });
            const loginData = await loginRes.json();
            if (!loginRes.ok) {
              throw new Error(loginData.message || "자동 로그인 실패");
            }

            // 토큰 저장
            const token = loginData.token;
            get().setToken(token);

            // 유저 정보 갱신
            const user = await get().refreshUser();
            set({ isLoading: false });
            return user;
          } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "signup error";
            set({ isLoading: false, error: errMsg });
            throw err;
          }
        },

        // 이메일 로그인
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const res = await fetch(`${BASE_URL}/user/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user: { email, password } }),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || "로그인 실패");
            }

            const token = data.token;
            get().setToken(token);

            // 토큰 저장 후 즉시 사용자 정보 가져오기
            const user = await get().refreshUser();
            set({ isLoading: false });
            return user;
          } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "login error";
            set({ isLoading: false, error: errMsg });
            throw err;
          }
        },

        logout: () => {
          try {
            removeToken();
          } catch (err) {
            console.error("removeToken failed in logout:", err);
          }
          try {
            new BroadcastChannel("auth").postMessage({ type: "logout" });
          } catch (err) {
            console.warn(
              "BroadcastChannel postMessage(logout) failed in logout:",
              err
            );
          }
          set({ user: null, token: null });
        },

        refreshUser: async () => {
          set({ isLoading: true, error: null });
          try {
            const token = getToken();
            if (!token) {
              set({ isLoading: false, user: null });
              return null;
            }
            const res = await fetch(`${BASE_URL}/user/myinfo`, {
              method: "GET",
              headers: getAuthHeaders(),
            });
            const payload = await res.json();
            if (!res.ok) {
              removeToken();
              set({ user: null, token: null, isLoading: false });
              return null;
            }
            const user = payload.user as AuthUser;
            set({ user, lastFetchedAt: Date.now(), isLoading: false });
            return user;
          } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "refresh error";
            set({
              user: null,
              isLoading: false,
              error: errMsg,
            });
            return null;
          }
        },

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
