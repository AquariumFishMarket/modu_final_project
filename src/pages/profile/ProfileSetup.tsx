import CreateForm from "../../components/common/form/CreateForm";
import { FormSubmissionData } from "../../components/common/form/types";
import { getProfileFields } from "../../utils/validation/userValidation";
import { useNavigate } from "react-router-dom";
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

export default function ProfileSetup() {
  const navigate = useNavigate();

  const profileFields = getProfileFields();

  // 폼 제출 핸들러 정의
  const handleSubmit = (data: FormSubmissionData) => {
    const profileData = {
      username: data.formValues.username,
      accountId: data.formValues.accountId,
      introduction: data.formValues.introduction,
      profileImage: data.hasCustomImage ? data.imageFiles[0] : null,
      useDefaultProfileImage: data.useDefaultImage,
    };

    // 개발 단계에서 확인용
    console.log("프로필 데이터:", profileData);
    console.log("폼 데이터:", data);

    // API 호출
    // createUserProfile(profileData);

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
      />
    </>
  );
}
