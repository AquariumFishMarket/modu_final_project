import React from "react";
import { useState } from "react";
import styled from "styled-components";
import DefaultButton from "./Button";
import ImageContainer from "./imageUpload/ImageContainer";
import ProfileImg from "./ProfileImg";
import ImageUpButton from "./imageUpload/UploadButton";

/**
 * 프로필, 상품 등록 페이지에서 공통으로 쓰일 입력폼 컴포넌트
 */

// 타입
interface CommonFormProps {
  formType: "profile" | "product";
  fields: FormFieldConfig[];
  showButton?: boolean;
  onSubmit?: (data: FormSubmissionData) => void;
}

interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  validator?: (value: string) => Promise<string | null> | string | null;
}

export interface FormSubmissionData {
  formData: FormData;
  imageFiles: File[];
  formValues: Record<string, string>;
}

interface ValidationErrors {
  [key: string]: string;
}

// Styled
const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 30px 19px;

  // 버튼 위 여백 30px
  > *:last-child {
    margin-top: 14px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    vertical-align: bottom;
    margin-bottom: 10px;
    color: var(--color-gray-dark);
  }

  input {
    padding-bottom: 8px;
    border: none;
    border-bottom: 1px solid var(--color-gray-medium);
    outline: none;

    &:focus {
      border-bottom-color: var(--color-primary-600);
    }

    &.error {
      border-bottom-color: var(--color-error);
    }

    &::placeholder {
      color: var(--color-gray-medium);
    }
  }
`;

const ErrorMessage = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: 6px;
  display: block;
`;

const FormImgContainer = styled.div<{ $formType: "profile" | "product" }>`
  margin: 0 auto;
  position: relative;
  margin-bottom: 30px;
  width: ${(props) => (props.$formType === "profile" ? "150px" : "100%")};
  height: ${(props) => (props.$formType === "profile" ? "150px" : "auto")};
  /* 상품 이미지 */
  ${(props) =>
    props.$formType === "product" &&
    `
    min-height: 204px;
    background-color: var(--color-gray-light);
    border: 1px solid var(--color-gray-medium);
    border-radius: 10px;
    overflow: hidden;
  `}
`;

const FormBtnContainer = styled.div<{ $formType: "profile" | "product" }>`
  position: absolute;
  bottom: 0;
  right: 0;
  ${(props) =>
    props.$formType === "product" &&
    `
    bottom: 10px;
    right: 10px;
  `}
`;

export default function CommonForm({
  formType,
  fields,
  showButton = true,
  onSubmit,
}: CommonFormProps) {
  // 폼 상태 관리
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [deleteIdx, setDeleteIdx] = useState<number | undefined>();

  const hasSelectedImage = imgFiles.length > 0;

  // 이미지 삭제 처리
  React.useEffect(() => {
    if (deleteIdx !== undefined) {
      const newImgFiles = imgFiles.filter((_, index) => index !== deleteIdx);
      setImgFiles(newImgFiles);
      setDeleteIdx(undefined);
    }
  }, [deleteIdx, imgFiles]);

  // 입력값 변경 핸들러
  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));

    // 에러 메시지 초기화
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  // 포커스 아웃 시 유효성 검사
  const handleBlur = async (fieldName: string, value: string) => {
    const field = fields.find((f) => f.name === fieldName);
    if (field?.validator && value.trim()) {
      const errorMessage = await field.validator(value);
      if (errorMessage) {
        setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
      }
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // 버튼 클릭 핸들러 -> 제출할 데이터 준비
  const handleButtonClick = async () => {
    // 전체 유효성 검사
    const newErrors: ValidationErrors = {};

    for (const field of fields) {
      if (field.required && !formValues[field.name]?.trim()) {
        newErrors[field.name] = `${field.label}는 필수입니다.`;
      } else if (field.validator && formValues[field.name]?.trim()) {
        const error = await field.validator(formValues[field.name]);
        if (error) newErrors[field.name] = error;
      }
    }

    setErrors(newErrors);

    // 에러가 없으면 폼 제출
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();

      // 폼 데이터 추가
      fields.forEach((field) => {
        formData.append(field.name, formValues[field.name]);
      });

      // 이미지 파일 추가
      if (imgFiles.length > 0) {
        if (formType === "profile") {
          formData.append("profileImage", imgFiles[0]);
        } else {
          imgFiles.forEach((file, index) => {
            formData.append(`productImage_${index}`, file);
          });
        }
      }

      onSubmit?.({
        formData,
        imageFiles: imgFiles,
        formValues,
      });
    }
  };

  // 버튼 활성화 조건
  const isFormValid = () => {
    const requiredFields = fields.filter((field) => field.required);
    const allRequiredFilled = requiredFields.every((field) =>
      formValues[field.name]?.trim()
    );
    const hasNoErrors = Object.values(errors).every((error) => !error);

    return allRequiredFilled && hasNoErrors;
  };

  return (
    <section>
      <InputForm onSubmit={handleSubmit}>
        <legend className="sr-only">사용자 설정</legend>

        <FormImgContainer $formType={formType}>
          {/* 프로필용 이미지 렌더링 */}
          {formType === "profile" && (
            <>
              {!hasSelectedImage ? (
                <ProfileImg width={150} thumbimg={false} imgSrc={undefined} />
              ) : (
                <ImageContainer
                  type="profile"
                  imgArr={imgFiles}
                  setDeleteIdx={setDeleteIdx}
                />
              )}
            </>
          )}

          {/* 상품용 이미지 렌더링 */}
          {formType === "product" && (
            <ImageContainer
              type="post" // 단일 사진만 이용할지, post 방식대로 할지?
              imgArr={imgFiles}
              setDeleteIdx={setDeleteIdx}
            />
          )}

          <FormBtnContainer $formType={formType}>
            <ImageUpButton
              imgArrType="singular"
              colortype="color"
              size="small"
              imgArr={imgFiles}
              setImgArr={setImgFiles}
            />
          </FormBtnContainer>
        </FormImgContainer>

        {/* 입력 필드들 */}
        {fields.map((field) => (
          <InputGroup key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              placeholder={field.placeholder}
              className={errors[field.name] ? "error" : ""}
              value={formValues[field.name]}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onBlur={(e) => handleBlur(field.name, e.target.value)}
              required={field.required}
            />
            {errors[field.name] && (
              <ErrorMessage>{errors[field.name]}</ErrorMessage>
            )}
          </InputGroup>
        ))}

        {showButton && (
          <DefaultButton
            text="시작하기"
            disabled={!isFormValid()}
            onClick={handleButtonClick}
          />
        )}
      </InputForm>
    </section>
  );
}
