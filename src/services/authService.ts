import { getAuthHeaders } from "../utils/tokenManager";

// API 호출 관리 서비스
const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

export interface AuthResponse {
  message: string;
  user?: {
    accountname: string;
    email: string;
    image: string;
    intro: string;
    username: string;
    _id: string;
  };
}

export interface LoginResponse {
  _id: string;
  username: string;
  email: string;
  accountname: string;
  intro: string;
  image: string;
  refreshToken: string;
  token: string;
}

export interface LoginErrorReponse {
  message: string;
  status: number;
}

export interface CheckDuplicateResponse {
  message: string;
}

// 이메일 중복 체크 API
export const checkEmailDuplicate = async (
  email: string
): Promise<CheckDuplicateResponse> => {
  const response = await fetch(`${BASE_URL}/user/emailvalid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: { email: email } }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("이메일 중복 확인에 실패했습니다.");
  }

  return data;
};

// 계정 ID 중복 API
export const checkAccountIdDuplicate = async (
  accountId: string
): Promise<CheckDuplicateResponse> => {
  const response = await fetch(`${BASE_URL}/user/accountnamevalid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: { accountname: accountId } }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("계정 ID 중복 확인에 실패했습니다.");
  }

  return data;
};

// 회원가입 API
export const signup = async (payload: {
  username: string;
  email: string;
  password: string;
  accountname: string;
  intro?: string;
  image?: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: payload,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  return data;
};

// 로그인 API
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email: email,
        password: password,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("API 응답 실패:", response.status, data); // 확인
    throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  return data;
};

export const getMyInfo = async () => {
  const response = await fetch(`${BASE_URL}/user/myinfo`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("사용자 정보를 불러오는 데 실패했습니다.");
  }

  return data; // { user: {} }
};
