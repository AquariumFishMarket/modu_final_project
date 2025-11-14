// API 호출 관리 서비스
const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";
const DEFAULT_PROFILE_IMG = "/img/empty-profile.png";

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

export interface CheckDuplicateResponse {
  message: string;
}

// 이메일 중복 체크
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

// 계정 ID 중복 체크
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

// 회원가입
export const signup = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // 임시 username과 accountname 생성 (나중에 프로필 설정에서 변경)
  const timestamp = Date.now();
  const tempUsername = `user_${timestamp}`;
  const tempAccountname = `account_${timestamp}`;

  const response = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        username: tempUsername,
        email: email,
        password: password,
        accountname: tempAccountname,
        intro: "",
        image: DEFAULT_PROFILE_IMG,
      },
    }),
  });

  const data = await response.json();
  console.log("회원가입 응답:", data);

  if (!response.ok) {
    throw new Error("회원가입에 실패했습니다.");
  }

  return data;
};

// 로그인
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    console.log("🔐 로그인 API 호출 시작");

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

    console.log("📡 응답 상태:", response.status);

    const data = await response.json();
    console.log("📦 로그인 응답:", data);

    if (!response.ok) {
      throw new Error("로그인에 실패했습니다.");
    }

    return data;
  } catch (error) {
    console.error("❌ 로그인 에러:", error);
    throw error;
  }
};

// 프로필 조회/수정 API는 profileService로 이동
