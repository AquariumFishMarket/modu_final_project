import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import DefaultButton from "../Button";
import ImageContainer from "../imageUpload/ImageContainer";
import ProfileImg from "../ProfileImg";
import ImageUpButton from "../imageUpload/UploadButton";
import { CommonFormRef, CreateFormProps, ValidationErrors } from "./types";
import {
  InputForm,
  InputGroup,
  ErrorMessage,
  FormImgContainer,
  FormBtnContainer,
  RequiredCheck,
  ProfileImageOverlay,
  ProfileImageWrapper,
} from "./Form.styled";

const CreateForm = forwardRef<CommonFormRef, CreateFormProps>(
  (
    { formType, fields, showButton = true, onSubmit, onValidationChange },
    ref
  ) => {
    // 초기값은 모두 빈 문자열
    const [formValues, setFormValues] = useState(() => {
      const initial: Record<string, string> = {};
      fields.forEach((field) => {
        initial[field.name] = "";
      });
      return initial;
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [imgFiles, setImgFiles] = useState<File[]>([]);
    const [deleteIdx, setDeleteIdx] = useState<number | undefined>();
    const [hasUserInteraction, setHasUserInteraction] = useState(false);

    const hasSelectedImage = imgFiles.length > 0;

    // 🆕 프로필 이미지 클릭 시 삭제 핸들러
    const handleProfileImageClick = () => {
      if (hasSelectedImage) {
        setImgFiles([]); // 이미지 삭제하여 기본 이미지로 되돌리기
      }
    };

    // 이미지 삭제 처리
    React.useEffect(() => {
      if (deleteIdx !== undefined) {
        const newImgFiles = imgFiles.filter((_, index) => index !== deleteIdx);
        setImgFiles(newImgFiles);
        setDeleteIdx(undefined);
      }
    }, [deleteIdx, imgFiles]);

    // 버튼 활성화 조건
    const isFormValid = () => {
      const requiredFields = fields.filter((field) => field.required);
      const allRequiredFilled = requiredFields.every((field) =>
        formValues[field.name]?.trim()
      );
      const hasNoErrors = Object.values(errors).every((error) => !error);

      return allRequiredFilled && hasNoErrors;
    };

    // 🆕 폼 유효성이 변경될 때마다 부모에게 알림
    useEffect(() => {
      const isValid = isFormValid();
      onValidationChange?.(isValid);
    }, [formValues, errors, onValidationChange]);

    // 입력 변경 핸들러
    const handleInputChange = (fieldName: string, value: string) => {
      const field = fields.find((f) => f.name === fieldName);

      let formattedValue = value;
      if (field?.formatter) {
        formattedValue = field.formatter(value);
      }

      setFormValues((prev) => ({ ...prev, [fieldName]: formattedValue }));
      setHasUserInteraction(true);

      // 기존 에러 제거
      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      }
    };

    // 포커스 아웃 시 유효성 검사
    const handleBlur = async (fieldName: string, value: string) => {
      if (!hasUserInteraction) return;

      const field = fields.find((f) => f.name === fieldName);
      if (field?.validator && value.trim()) {
        const errorMessage = await field.validator(value);
        if (errorMessage) {
          setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
        }
      }
    };

    // 폼 제출 로직 (버튼 클릭과 외부 호출 모두 사용)
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
        if (formType === "profile") {
          if (imgFiles.length > 0) {
            formData.append("profileImage", imgFiles[0]);
          } else {
            formData.append("DefaultImage", "true");
          }
        } else if (formType === "product") {
          imgFiles.forEach((file, index) => {
            formData.append(`productImage_${index}`, file);
          });
        }

        onSubmit?.({
          formData,
          imageFiles: imgFiles,
          formValues,
          hasCustomImage: imgFiles.length > 0, // 🆕 커스텀 이미지 여부
          useDefaultImage: imgFiles.length === 0, // 🆕 기본 이미지 사용 여부
        });

        return true; // 성공
      }

      return false; // 실패
    };

    // 외부에서 호출할 수 있는 제출 함수
    const submitForm = async () => {
      await performSubmit();
    };

    // ref를 통해 submitForm 메서드 노출
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
              <ProfileImageWrapper
                $hasImage={hasSelectedImage}
                onClick={handleProfileImageClick}
                title={hasSelectedImage ? "클릭하여 기본 이미지로 변경" : ""}
              >
                {!hasSelectedImage ? (
                  <ProfileImg width={150} thumbimg={false} imgSrc={undefined} />
                ) : (
                  <>
                    <ProfileImg
                      width={150}
                      thumbimg={true}
                      imgSrc={URL.createObjectURL(imgFiles[0])}
                    />
                    <ProfileImageOverlay>클릭하여 삭제</ProfileImageOverlay>
                  </>
                )}
              </ProfileImageWrapper>
            )}

            {/* 상품용 이미지 렌더링 */}
            {formType === "product" && (
              <ImageContainer
                key={`product-images-${imgFiles.length}`}
                imgArr={imgFiles}
                setDeleteIdx={setDeleteIdx}
              />
            )}

            <FormBtnContainer $formType={formType}>
              <ImageUpButton
                multiple={formType === "product"}
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
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <RequiredCheck>*</RequiredCheck>}
              </label>

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

          {showButton && formType === "profile" && (
            <DefaultButton
              text="저장"
              disabled={!isFormValid()}
              onClick={handleButtonClick}
            />
          )}
        </InputForm>
      </section>
    );
  }
);

CreateForm.displayName = "CreateForm";
export default CreateForm;
