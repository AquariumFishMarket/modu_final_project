import CommonForm, {
  FormSubmissionData,
} from "../../components/common/CommonForm";
import styled from "styled-components";

const ProfileTitle = styled.div`
  text-align: center;

  h2 {
    font-size: var(--font-size-2xl);
    font-weight: 500;
    margin-bottom: 12px;
  }

  p {
    font-size: var(--font-size-md);
    color: var(--color-gray-dark);
  }
`;

// 유효성 검사 함수 -> profile 유효성만 따로 분리
const validateUsername = (username: string): string | null => {
  if (username.length < 2 || username.length > 10) {
    return "사용자 이름은 2-10자 이내여야 합니다.";
  }
  return null;
};

const validateAccountId = async (accountId: string): Promise<string | null> => {
  // 형식 검사
  const accountIdRegex = /^[a-zA-Z0-9._]+$/;
  if (!accountIdRegex.test(accountId)) {
    return "영문, 숫자, 특수문자(.), (_)만 사용 가능합니다.";
  }

  if (accountId.length < 3) {
    return "계정 ID는 3자 이상이어야 합니다.";
  }

  // 중복 검사 (API 호출 시뮬레이션)
  try {
    const isDuplicate = await checkAccountIdDuplicate(accountId);
    if (isDuplicate) {
      return "이미 사용 중인 계정 ID입니다.";
    }
  } catch {
    // error 매개변수 잠시 제거
    return "계정 ID 중복 확인 중 오류가 발생했습니다.";
  }

  return null;
};

// 중복 검사 API 시뮬레이션
const checkAccountIdDuplicate = async (accountId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const duplicateIds = ["admin", "test", "user123"]; // ID 중복 테스트 데이터
      resolve(duplicateIds.includes(accountId.toLowerCase()));
    }, 500);
  });
};

const profileFields = [
  {
    name: "username",
    label: "사용자 이름",
    placeholder: "2-10자 이내여야 합니다.",
    required: true,
    validator: validateUsername,
  },
  {
    name: "accountId",
    label: "계정 ID",
    placeholder: "영문, 숫자, 특수문자(.),(...)만 사용 가능합니다.",
    required: true,
    validator: validateAccountId,
  },
  {
    name: "introduction",
    label: "소개",
    placeholder: "자신과 판매할 상품에 대해 소개해 주세요!",
  },
];

export default function ProfileSetup() {
  // 폼 제출 핸들러 정의
  const handleSubmit = (data: FormSubmissionData) => {
    console.log("프로필 설정 완료:", data);
    // 실제 API 호출이나 다음 페이지 이동 로직 추가
  };

  return (
    <>
      <ProfileTitle>
        <h2>프로필 설정</h2>
        <p>나중에 언제든지 변경할 수 있습니다.</p>
      </ProfileTitle>
      <CommonForm
        formType="profile"
        fields={profileFields}
        onSubmit={handleSubmit}
      />
    </>
  );
}
