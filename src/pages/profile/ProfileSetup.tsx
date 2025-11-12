import CreateForm from "../../components/common/form/CreateForm";
import { FormSubmissionData } from "../../components/common/form/types";
import { getProfileFields } from "../../utils/validation/userValidation";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useState } from "react";
import {
  // checkAccountIdDuplicate,
  updateProfile,
} from "../../services/authService";
import { getToken } from "../../utils/tokenManager";

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

// 나중에 빼기
const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
`;

export default function ProfileSetup() {
  const navigate = useNavigate();
  const profileFields = getProfileFields();
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 계정 ID 중복 체크
  // const handleAccountIdCheck = async (accountId: string): Promise<void> => {
  //   setIsCheckingAccountId(true);
  //   setError("");

  //   try {
  //     const result = await checkAccountIdDuplicate(accountId);
  //     setIsAccountIdAvailable(result.available);

  //     if (!result.available) {
  //       setError("이미 사용 중인 계정 ID입니다.");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setError("계정 ID 확인 중 오류가 발생했습니다.");
  //     setIsAccountIdAvailable(null);
  //   } finally {
  //     setIsCheckingAccountId(false);
  //   }
  // };

  // 유효성 검사 상태 변경 핸들러
  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
  };

  // 폼 제출 핸들러 정의
  const handleSubmit = async (data: FormSubmissionData): Promise<void> => {
    setError("");

    const username = data.username as string;
    const accountname = data.accountId as string;
    const intro = (data.introduction as string) || "";

    // 빈 값 검사
    if (!username || !username.trim()) {
      setError("계정 ID 중복 확인을 먼저 해주세요.");
      return;
    }

    if (!accountname || !accountname.trim()) {
      setError("사용할 수 없는 계정 ID입니다.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("인증 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login/email");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile(username, accountname, intro, "", token);
      alert("회원 정보가 등록되었습니다.");
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "정보 등록에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }

    navigate("/"); // 성공 시 이동
  };

  return (
    <>
      <ProfileTitle>
        <h2>프로필 설정</h2>
        <p>나중에 언제든지 변경할 수 있습니다.</p>
      </ProfileTitle>
      <CreateForm
        formType="profile"
        fields={profileFields}
        showButton={true}
        onSubmit={handleSubmit}
        onValidationChange={handleValidationChange}
        // buttonText="완료"
        // disabled={isSubmitting}
      />

      {/* 나중에 빼기 */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
}
