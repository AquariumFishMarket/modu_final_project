import CreateForm from "../../components/common/form/CreateForm";
import { ProfileFormData } from "../../components/common/form/types";
import { getProfileFields } from "../../utils/validation/userValidation";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useState } from "react";
import { useAuthStore } from "../../contexts/useAuthStore";
import { updateProfile } from "../../services/profileService";
import { uploadImage } from "../../services/imageService";
import { getToken } from "../../utils/tokenManager";
import { useToastStore } from "../../contexts/useToastStore";

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
  const { setToast } = useToastStore();
  const refreshUser = useAuthStore((s) => s.refreshUser);

  // 유효성 검사 상태 변경 핸들러
  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (data: ProfileFormData): Promise<void> => {
    setError("");

    const username = data.username;
    const accountname = data.accountname;
    const intro = data.intro || "";
    const imageFile = data.image as File | undefined;

    // 빈 값 검사
    if (!username || !username.trim()) {
      setError("사용자 이름을 입력해주세요.");
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
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      await updateProfile(username, accountname, intro, imageUrl);
      await refreshUser(); // 프로필 정보 즉시 갱신
      setToast("회원정보가 등록되었습니다😊", () => navigate("/"));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "정보 등록에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ProfileTitle>
        <h2>프로필 설정</h2>
        <p>나중에 언제든지 변경할 수 있습니다.</p>
      </ProfileTitle>
      <CreateForm<ProfileFormData>
        formType="profile"
        fields={profileFields}
        showButton={true}
        onSubmit={handleSubmit}
        onValidationChange={handleValidationChange}
        buttonText={isSubmitting ? "저장 중..." : "저장"}
        disabled={!isValid || isSubmitting}
      />

      {/* 나중에 빼기 */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
}
