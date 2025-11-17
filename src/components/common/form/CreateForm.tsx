import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import DefaultButton from "../buttons/Button";
import ImageContainer from "../imageUpload/ImageContainer";
import ProfileImg from "../ProfileImg";
import ImageUpButton from "../imageUpload/UploadButton";
import {
  CommonFormRef,
  CreateFormProps,
  ValidationErrors,
  FormData,
} from "./types";
import {
  InputForm,
  InputGroup,
  ErrorMessage,
  FormImgContainer,
  FormBtnContainer,
  RequiredCheck,
  ProfileImageOverlay,
  ProfileImageWrapper,
  ImageLabel,
} from "./Form.styled";

function CreateFormInner<T extends FormData>(
  props: CreateFormProps<T>,
  ref: React.Ref<CommonFormRef>
) {
  const {
    formType,
    fields,
    showButton = true,
    onSubmit,
    onValidationChange,
    buttonText = "등록",
    disabled = false,
    imageRequired = false,
  } = props;
  // 초기값은 모두 빈 문자열
  const [formValues, setFormValues] = useState(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = "";
    });
    return initial;
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [validationStatus, setValidationStatus] = useState<{
    [key: string]: "idle" | "checking" | "success" | "error";
  }>({}); // 🆕
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [deleteIdx, setDeleteIdx] = useState<number | undefined>();

  const hasSelectedImage = imgFiles.length > 0;

  const previewUrl = useMemo(
    () => (imgFiles[0] ? URL.createObjectURL(imgFiles[0]) : undefined),
    [imgFiles]
  );

  const handleProfileImageClick = () => {
    if (hasSelectedImage) {
      setImgFiles([]);
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
  const isFormValid = useMemo(() => {
    const requiredFields = fields.filter((field) => field.required);
    const allRequiredFilled = requiredFields.every((field) =>
      formValues[field.name]?.trim()
    );
    const hasNoErrors = Object.values(errors).every((error) => !error);
    const isChecking = Object.values(validationStatus).some(
      (status) => status === "checking"
    );

    const imageValid = !imageRequired || hasSelectedImage;

    return allRequiredFilled && hasNoErrors && !isChecking && imageValid;
  }, [
    fields,
    formValues,
    errors,
    validationStatus,
    imageRequired,
    hasSelectedImage,
  ]);

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  const handleInputChange = (fieldName: string, value: string) => {
    const field = fields.find((f) => f.name === fieldName);

    let formattedValue = value;
    if (field?.formatter) {
      formattedValue = field.formatter(value);
    }

    setFormValues((prev) => ({ ...prev, [fieldName]: formattedValue }));

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
    setValidationStatus((prev) => ({ ...prev, [fieldName]: "idle" }));
  };

  const handleBlur = async (fieldName: string, value: string) => {
    const field = fields.find((f) => f.name === fieldName);

    if (!field?.validator) return;

    if (!field.required && !value.trim()) {
      return;
    }

    setValidationStatus((prev) => ({ ...prev, [fieldName]: "checking" }));
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

    try {
      const errorMessage = await field.validator(value);

      if (errorMessage) {
        setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
        setValidationStatus((prev) => ({ ...prev, [fieldName]: "error" }));
      } else {
        setValidationStatus((prev) => ({ ...prev, [fieldName]: "success" }));
      }
    } catch (error) {
      console.error(`${fieldName} 검사 오류:`, error);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "검사 중 오류가 발생했습니다.",
      }));
      setValidationStatus((prev) => ({ ...prev, [fieldName]: "error" }));
    }
  };

  const performSubmit = async () => {
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

    if (Object.keys(newErrors).length > 0) {
      console.log("유효성 검사 실패:", newErrors);
      return false;
    }

    if (onSubmit) {
      const submissionData: Record<string, string | File | undefined> = {
        ...formValues,
      };

      if (imgFiles.length > 0) {
        if (formType === "profile") {
          submissionData.image = imgFiles[0];
        } else if (formType === "product") {
          submissionData.itemImage = imgFiles[0];
        }
      }

      setErrors({});
      onSubmit(submissionData as T);
    }

    return true;
  };

  const submitForm = async () => {
    await performSubmit();
  };

  useImperativeHandle(ref, () => ({
    submitForm,
  }));

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

        {/* 이미지 필드 라벨 (상품일 때만 표시) */}
        {formType === "product" && imageRequired && (
          <ImageLabel>
            상품 이미지
            <RequiredCheck>*</RequiredCheck>
          </ImageLabel>
        )}

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
                  <ProfileImg width={150} thumbimg={true} imgSrc={previewUrl} />
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
              multiple={false} // 상품도 단일 이미지
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

            {/* 조건부 렌더링 - textarea vs input */}
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                className={errors[field.name] ? "error" : ""}
                value={formValues[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
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
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onBlur={async (e) => {
                  // 계정ID 중복 검사 validator 연결
                  if (field.name === "accountname" && field.validator) {
                    setValidationStatus((prev) => ({
                      ...prev,
                      [field.name]: "checking",
                    }));
                    setErrors((prev) => ({ ...prev, [field.name]: "" }));
                    const errorMessage = await field.validator(e.target.value);
                    if (errorMessage) {
                      setErrors((prev) => ({
                        ...prev,
                        [field.name]: errorMessage,
                      }));
                      setValidationStatus((prev) => ({
                        ...prev,
                        [field.name]: "error",
                      }));
                    } else {
                      setValidationStatus((prev) => ({
                        ...prev,
                        [field.name]: "success",
                      }));
                    }
                  } else {
                    handleBlur(field.name, e.target.value);
                  }
                }}
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
            text={buttonText || "저장"}
            disabled={disabled ?? !isFormValid}
            onClick={handleButtonClick}
          />
        )}
      </InputForm>
    </section>
  );
}

const CreateForm = forwardRef(CreateFormInner) as <
  T extends FormData = FormData
>(
  props: CreateFormProps<T> & { ref?: React.Ref<CommonFormRef> }
) => React.ReactElement | null;

export default CreateForm;
