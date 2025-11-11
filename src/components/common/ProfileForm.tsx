import DefaultButton from "./buttons/Button";
import styled from "styled-components";
import ProfileImg from "./ProfileImg";
import ImageUpButton from "./imageUpload/UploadButton";
import { useState } from "react";
import { ErrorMessage } from "./auth/AuthForm.styled";
import React from "react";
import ImageContainer from "./imageUpload/ImageContainer";

interface ProfileFormProps {
  showTitle?: boolean;
  buttonText?: string;
  onSubmit?: (formData: FormData) => void;
}

interface ValidationErrors {
  username?: string;
  accountId?: string;
  introduction?: string;
}

const ProfileTitle = styled.div`
  text-align: center;
  margin-top: 30px;

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

const InfoForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 30px 34px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;

  &:last-of-type {
    margin-bottom: 30px;
  }

  label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    vertical-align: bottom;
    margin-bottom: 10px;
    color: var(--color-gray-dark);
  }

  input {
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-gray-medium);

    &:focus {
      border-bottom-color: var(--color-primary-600);
    }

    &::placeholder {
      color: var(--color-gray-medium);
    }
  }
`;

const ImgContainer = styled.div`
  margin: 0 auto;
  position: relative;
  margin-bottom: 30px;
  width: 150px;
  height: 150px;
`;

const BtnContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

export default function ProfileForm({
  showTitle = false,
  buttonText = "시작하기",
  onSubmit,
}: ProfileFormProps) {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [deleteIdx, setDeleteIdx] = useState<number | undefined>();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formValues, setFormValues] = useState({
    username: "",
    accountId: "",
    introduction: "",
  });

  const hasSelectedImage = imgFiles.length > 0;

  // 이미지 삭제 처리 (deleteIdx가 변경될 때)
  React.useEffect(() => {
    if (deleteIdx !== undefined) {
      const newImgFiles = imgFiles.filter((_, index) => index !== deleteIdx);
      setImgFiles(newImgFiles);
      setDeleteIdx(undefined);
    }
  }, [deleteIdx, imgFiles]);

  // 유효성 검사 함수들
  const validateUsername = (username: string): string | null => {
    if (username.length < 2 || username.length > 10) {
      return "사용자 이름은 2-10자 이내여야 합니다.";
    }
    return null;
  };

  const validateAccountId = async (
    accountId: string
  ): Promise<string | null> => {
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
      // 실제로는 서버 API 호출
      const isDuplicate = await checkAccountIdDuplicate(accountId);
      if (isDuplicate) {
        return "이미 사용 중인 계정 ID입니다.";
      }
    } catch (error) {
      return "계정 ID 중복 확인 중 오류가 발생했습니다.";
    }

    return null;
  };

  // 중복 검사 API 시뮬레이션 (실제로는 서버 API 호출)
  const checkAccountIdDuplicate = async (
    accountId: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 테스트용 중복 계정 ID들
        const duplicateIds = ["admin", "test", "user123"];
        resolve(duplicateIds.includes(accountId.toLowerCase()));
      }, 500);
    });
  };

  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof ValidationErrors, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 포커스 아웃 시 유효성 검사
  const handleBlur = async (field: keyof ValidationErrors, value: string) => {
    let errorMessage: string | null = null;

    switch (field) {
      case "username":
        errorMessage = validateUsername(value);
        break;
      case "accountId":
        if (value.trim()) {
          errorMessage = await validateAccountId(value);
        }
        break;
      case "introduction":
        // 소개는 필수가 아니므로 별도 검증 없음
        break;
    }

    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  // 폼 제출 핸들러
  const handleButtonClick = async () => {
    // 전체 유효성 검사
    const newErrors: ValidationErrors = {};

    // 사용자 이름 검사
    const usernameError = validateUsername(formValues.username);
    if (usernameError) newErrors.username = usernameError;

    // 계정 ID 검사
    if (formValues.accountId.trim()) {
      const accountIdError = await validateAccountId(formValues.accountId);
      if (accountIdError) newErrors.accountId = accountIdError;
    } else {
      newErrors.accountId = "계정 ID는 필수입니다.";
    }

    setErrors(newErrors);

    // 에러가 없으면 폼 제출
    if (Object.keys(newErrors).length === 0) {
      // FormData 생성
      const formData = new FormData();
      formData.append("username", formValues.username);
      formData.append("accountId", formValues.accountId);
      formData.append("introduction", formValues.introduction);

      if (imgFiles.length > 0) {
        formData.append("profileImage", imgFiles[0]);
      }
      onSubmit?.(formData);
    }
  };

  // 기존 폼 제출 핸들러는 기본 동작만 방지
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // 버튼 활성화 조건
  const isFormValid = () => {
    return (
      formValues.username.trim() &&
      formValues.accountId.trim() &&
      Object.keys(errors).length === 0 &&
      !Object.values(errors).some((error) => error !== undefined)
    );
  };

  return (
    <section>
      {showTitle && (
        <ProfileTitle>
          <h2>프로필 설정</h2>
          <p>나중에 언제든지 변경할 수 있습니다.</p>
        </ProfileTitle>
      )}

      <InfoForm onSubmit={handleSubmit}>
        <legend className="sr-only">사용자 설정</legend>

        <ImgContainer>
          {/* 이미지가 없으면 기본 ProfileImg, 있으면 ImageContainer */}
          {!hasSelectedImage ? (
            <ProfileImg width={150} thumbimg={false} imgSrc={undefined} />
          ) : (
            <ImageContainer imgArr={imgFiles} setDeleteIdx={setDeleteIdx} />
          )}
          <BtnContainer>
            <ImageUpButton
              multiple={false}
              colortype="color"
              size="small"
              imgArr={imgFiles}
              setImgArr={setImgFiles}
            />
          </BtnContainer>
        </ImgContainer>

        <InputGroup>
          <label htmlFor="usename">사용자 이름</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="2-10자 이내여야 합니다."
            className={errors.username ? "error" : ""}
            value={formValues.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            onBlur={(e) => handleBlur("username", e.target.value)}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <label htmlFor="accountId">계정 ID</label>
          <input
            id="accountId"
            name="accountId"
            type="text"
            placeholder="영문, 숫자, 특수문자(.),(...)만 사용 가능합니다."
            className={errors.accountId ? "error" : ""}
            value={formValues.accountId}
            onChange={(e) => handleInputChange("accountId", e.target.value)}
            onBlur={(e) => handleBlur("accountId", e.target.value)}
            required
          />
          {errors.accountId && <ErrorMessage>{errors.accountId}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <label htmlFor="introduction">소개</label>
          <input
            id="introduction"
            name="introduction"
            type="text"
            placeholder="자신과 판매할 상품에 대해 소개해 주세요!"
            value={formValues.introduction}
            onChange={(e) => handleInputChange("introduction", e.target.value)}
          />
        </InputGroup>
        <DefaultButton
          text={buttonText}
          disabled={!isFormValid()}
          onClick={handleButtonClick}
        />
      </InfoForm>
    </section>
  );
}
