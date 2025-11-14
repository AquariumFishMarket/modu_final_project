import { checkAccountIdDuplicate } from "../../services/authService";
import type { FormFieldConfig } from "../../components/common/form/types";
// import type { CheckDuplicateResponse } from "../../services/authService";

// 사용자명 유효성 검사
export const validateUsername = (username: string): string | null => {
  if (username.length < 2 || username.length > 10) {
    return "사용자 이름은 2-10자 이내여야 합니다.";
  }
  return null;
};

// 계정ID 유효성 검사
export const validateAccountId = async (
  accountId: string
): Promise<string | null> => {
  const accountIdRegex = /^[a-zA-Z0-9._]+$/;

  if (!accountIdRegex.test(accountId)) {
    return "영문, 숫자, 특수문자(.), (_)만 사용 가능합니다.";
  }

  if (accountId.length < 3) {
    return "계정 ID는 3자 이상이어야 합니다.";
  }

  // 중복 검사 (API 호출 시뮬레이션)
  try {
    const result = await checkAccountIdDuplicate(accountId);
    if (result.message === "이미 가입된 계정ID 입니다.") {
      return "이미 사용 중인 계정 ID입니다.";
    }

    if (result.message === "사용 가능한 계정ID 입니다.") {
      return null; // 사용 가능
    }

    // 기타 에러 메시지
    return result.message;
  } catch (err) {
    console.error("계정 ID 중복 확인 오류:", err);
    return "계정 ID 중복 확인 중 오류가 발생했습니다.";
  }

  return null;
};

// 중복 검사 API 시뮬레이션
// const checkAccountIdDuplicate = async (accountId: string): Promise<boolean> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const duplicateIds = ["admin", "test", "user123"]; // ID 중복 테스트 데이터
//       resolve(duplicateIds.includes(accountId.toLowerCase()));
//     }, 500);
//   });
// };

export const getProfileFields = (): FormFieldConfig[] => [
  {
    name: "username",
    label: "사용자 이름",
    placeholder: "2-10자 이내여야 합니다.",
    required: true,
    validator: validateUsername,
  },
  {
    name: "accountname",
    label: "계정 ID",
    placeholder: "영문, 숫자, 특수문자(.),(...)만 사용 가능합니다.",
    required: true,
    validator: validateAccountId,
  },
  {
    name: "intro",
    label: "소개",
    placeholder: "자신과 판매할 상품에 대해 소개해 주세요!",
  },
];
