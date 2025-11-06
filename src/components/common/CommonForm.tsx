import React, { useState, useImperativeHandle, forwardRef } from "react";
import styled from "styled-components";
import DefaultButton from "./Button";
import ImageContainer from "./imageUpload/ImageContainer";
import ProfileImg from "./ProfileImg";
import ImageUpButton from "./imageUpload/UploadButton";

/**
 * 프로필, 상품 등록 페이지에서 공통으로 쓰일 입력폼 컴포넌트
 */

// 🆕 ref로 노출할 메서드 타입 정의
export interface CommonFormRef {
  submitForm: () => void;
}

// 타입
export interface CommonFormProps {
  formType: "profile" | "product";
  fields: FormFieldConfig[];
  showButton?: boolean;
  onSubmit?: (data: FormSubmissionData) => void;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  validator?: (value: string) => Promise<string | null> | string | null;
  type?: "input" | "textarea";
  maxLength?: number;
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
    padding: 8px;
    border-bottom: 1px solid var(--color-gray-medium);
    outline: none;
    background: transparent;
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

  textarea {
    min-height: 200px;
    padding: 15px 8px;
    line-height: 1.5;
    border: 1px solid var(--color-gray-medium);
    border-radius: 10px;
    background: transparent;
    resize: none; /* textarea 리사이즈 비활성화 */
  }
`;

const ErrorMessage = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: 6px;
  display: block;
`;

const FormImgContainer = styled.div<{
  $formType: "profile" | "product";
  $hasSelectedImage: boolean;
}>`
  margin: 0 auto;
  position: relative;
  margin-bottom: 30px;
  width: ${(props) => (props.$formType === "profile" ? "150px" : "100%")};
  height: ${(props) => (props.$formType === "profile" ? "150px" : "auto")};
  /* 상품 이미지 */
  ${(props) =>
    props.$formType === "product" &&
    `
    aspect-ratio: 322 / 204;
    min-height: 204px;
    border-radius: 10px;
  `}
  ${(props) =>
    !props.$hasSelectedImage &&
    props.$formType === "product" &&
    `
    border: 1px solid var(--color-gray-medium);
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

// 🆕 forwardRef로 감싸고 ref 타입 지정
const CommonForm = forwardRef<CommonFormRef, CommonFormProps>(
  ({ formType, fields, showButton = true, onSubmit }, ref) => {
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

    // 🆕 폼 제출 로직 (버튼 클릭과 외부 호출 모두 사용)
    const performSubmit = async () => {
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

        return true; // 성공
      }

      return false; // 실패
    };

    // 🆕 외부에서 호출할 수 있는 제출 함수
    const submitForm = async () => {
      await performSubmit();
    };

    // 🆕 ref를 통해 submitForm 메서드 노출
    useImperativeHandle(ref, () => ({
      submitForm,
    }));

    // 폼 제출 핸들러 (기본 폼 제출 방지)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };

    // 버튼 클릭 핸들러
    const handleButtonClick = async () => {
      await performSubmit();
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

          <FormImgContainer
            $formType={formType}
            $hasSelectedImage={hasSelectedImage}
          >
            {/* 프로필용 이미지 렌더링 */}
            {formType === "profile" && (
              <>
                {!hasSelectedImage ? (
                  <ProfileImg width={150} thumbimg={false} imgSrc={undefined} />
                ) : (
                  <ImageContainer
                    imgArr={imgFiles}
                    setDeleteIdx={setDeleteIdx}
                  />
                )}
              </>
            )}

            {/* 상품용 이미지 렌더링 */}
            {formType === "product" && (
              <ImageContainer imgArr={imgFiles} setDeleteIdx={setDeleteIdx} />
            )}

            <FormBtnContainer $formType={formType}>
              <ImageUpButton
                multiple={formType === "product"} // 🆕 상품은 다중 이미지 가능
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

              {/* 🆕 조건부 렌더링 - textarea vs input */}
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  className={errors[field.name] ? "error" : ""}
                  value={formValues[field.name]}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  onBlur={(e) => handleBlur(field.name, e.target.value)}
                  required={field.required}
                  maxLength={field.maxLength}
                  rows={4}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder={field.placeholder}
                  className={errors[field.name] ? "error" : ""}
                  value={formValues[field.name]}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  onBlur={(e) => handleBlur(field.name, e.target.value)}
                  required={field.required}
                />
              )}
              {errors[field.name] && (
                <ErrorMessage>{errors[field.name]}</ErrorMessage>
              )}
            </InputGroup>
          ))}

          {/* 🆕 조건부 버튼 렌더링 */}
          {showButton && (
            <DefaultButton
              text={formType === "profile" ? "저장" : "등록"}
              disabled={!isFormValid()}
              onClick={handleButtonClick}
            />
          )}
        </InputForm>
      </section>
    );
  }
);

// 🆕 displayName 설정 (디버깅용)
CommonForm.displayName = "CommonForm";

export default CommonForm;
