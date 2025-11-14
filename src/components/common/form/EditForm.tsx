import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
// import ImageContainer from "../imageUpload/ImageContainer";
import ProfileImg from "../ProfileImg";
import ImageUpButton from "../imageUpload/UploadButton";
import DeleteButton from "../imageUpload/DeleteButton";
import { CommonFormRef, EditFormProps, ValidationErrors } from "./types";
import {
  InputForm,
  InputGroup,
  ErrorMessage,
  FormImgContainer,
  FormBtnContainer,
  EditImagesContainer,
  RequiredCheck,
  EmptyImageMessage,
  ImageCountBadge,
  ImageSlide,
  ProfileImageWrapper,
  ProfileImageOverlay,
} from "./Form.styled";

const EditForm = forwardRef<CommonFormRef, EditFormProps>(
  (
    {
      formType,
      fields,
      onSubmit,
      onValidationChange,
      initialValues = {},
      initialImages = [],
      existingImageUrls = [],
    },
    ref
  ) => {
    // 초기값으로 폼 상태 초기화
    const [formValues, setFormValues] = useState(() => {
      const initial: Record<string, string> = {};
      fields.forEach((field) => {
        initial[field.name] = initialValues[field.name] || "";
      });
      return initial;
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [imgFiles, setImgFiles] = useState<File[]>(initialImages);
    const [deleteIdx, setDeleteIdx] = useState<number | undefined>();

    // 수정 모드 특화 로직들 - 누락된 상태 추가
    const [deletedExistingImages, setDeletedExistingImages] = useState<
      number[]
    >([]);
    const [deleteExistingIdx, setDeleteExistingIdx] = useState<
      number | undefined
    >();
    const [hasUserInteraction, setHasUserInteraction] = useState(false);

    // 총 이미지 개수 계산
    const totalImageCount =
      existingImageUrls.length - deletedExistingImages.length + imgFiles.length;
    const hasSelectedImage = totalImageCount > 0;

    // 이미지 삭제 처리
    useEffect(() => {
      if (deleteIdx !== undefined) {
        const newImgFiles = imgFiles.filter((_, index) => index !== deleteIdx);
        setImgFiles(newImgFiles);
        setDeleteIdx(undefined);
      }
    }, [deleteIdx, imgFiles]);

    // 프로필 이미지 클릭 시 삭제 핸들러
    const handleProfileImageClick = () => {
      if (hasSelectedImage) {
        setImgFiles([]);
      }
    };

    // 상품 기존 이미지 삭제 처리
    useEffect(() => {
      if (deleteExistingIdx !== undefined) {
        setDeletedExistingImages((prev) => [...prev, deleteExistingIdx]);
        setDeleteExistingIdx(undefined);
      }
    }, [deleteExistingIdx]);

    // 버튼 활성화 조건
    const isFormValid = () => {
      const requiredFields = fields.filter((field) => field.required);
      const allRequiredFilled = requiredFields.every((field) =>
        formValues[field.name]?.trim()
      );
      const hasNoErrors = Object.values(errors).every((error) => !error);

      return allRequiredFilled && hasNoErrors;
    };

    // 폼 유효성이 변경될 때마다 부모에게 알림
    useEffect(() => {
      const isValid = isFormValid();
      onValidationChange?.(isValid);
    }, [formValues, errors]);

    // 입력 변경 핸들러
    const handleInputChange = (fieldName: string, value: string) => {
      const field = fields.find((f) => f.name === fieldName);

      let formattedValue = value;
      if (field?.formatter) {
        formattedValue = field.formatter(value);
      }

      // price 필드 숫자로 변환
      // if (fieldName === "price" && value) {
      //   const numValue = Number(value.replace(/,/g, ""));
      //   formattedValue = isNaN(numValue) ? 0 : numValue;
      // }

      setFormValues((prev) => ({ ...prev, [fieldName]: formattedValue }));
      setHasUserInteraction(true);

      // 기존 에러 제거
      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      }
    };

    // 포커스 아웃 시 유효성 검사
    const handleBlur = async (fieldName: string, value: string) => {
      if (!hasUserInteraction) return; // 사용자가 실제로 수정한 경우에만 유효성 검사

      const field = fields.find((f) => f.name === fieldName);

      if (field?.validator) {
        if (value.trim()) {
          // 값이 있으면 유효성 검사
          const errorMessage = await field.validator(value);
          if (errorMessage) {
            setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
          } else {
            // 유효성 검사 통과 시 에러 제거
            setErrors((prev) => ({ ...prev, [fieldName]: "" }));
          }
        } else {
          // 값이 비어있으면 에러 제거 (단, 필수 필드면 에러 설정하지 않음 - 제출 시에만)
          setErrors((prev) => ({ ...prev, [fieldName]: "" }));
        }
      }
    };

    // 폼 제출 로직
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

      if (Object.keys(newErrors).length === 0) {
        const formData = new FormData();

        // 폼 데이터 추가
        fields.forEach((field) => {
          formData.append(field.name, formValues[field.name]);
        });

        // 삭제된 기존 이미지 정보 추가
        if (deletedExistingImages.length > 0) {
          formData.append(
            "deletedExistingImages",
            JSON.stringify(deletedExistingImages)
          );
        }

        // 새 이미지 파일 추가
        if (imgFiles.length > 0) {
          if (formType === "profile") {
            formData.append("profileImage", imgFiles[0]);
          } else {
            imgFiles.forEach((file, index) => {
              formData.append(`productImage_${index}`, file);
            });
          }
        }

        onSubmit?.({});

        return true;
      }

      return false;
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

    // 초기값이 변경될 때 폼 상태 업데이트
    useEffect(() => {
      if (Object.keys(initialValues).length > 0) {
        setFormValues((prev) => {
          const updated = { ...prev };
          fields.forEach((field) => {
            if (
              initialValues[field.name] !== undefined &&
              (prev[field.name] === "" || !hasUserInteraction)
            ) {
              updated[field.name] = initialValues[field.name];
            }
          });
          return updated;
        });
      }
    }, []);

    // 초기 이미지가 변경될 때 업데이트
    useEffect(() => {
      if (initialImages.length > 0) {
        setImgFiles(initialImages);
      }
    }, [initialImages]);

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
              <>
                {hasSelectedImage ? (
                  <EditImagesContainer>
                    {existingImageUrls.map((url, index) => {
                      if (deletedExistingImages.includes(index)) return null;

                      return (
                        <ImageSlide key={`existing-${index}`}>
                          <img src={url} alt={`기존 이미지 ${index + 1}`} />
                          <DeleteButton
                            data-index={index}
                            setDeleteIdx={setDeleteExistingIdx}
                          />
                        </ImageSlide>
                      );
                    })}

                    {/* 🆕 새 이미지들도 동일한 스타일로 */}
                    {imgFiles.map((file, index) => (
                      <ImageSlide key={`new-${index}`}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`새 이미지 ${index + 1}`}
                        />
                        <DeleteButton
                          data-index={index}
                          setDeleteIdx={setDeleteIdx}
                        />
                      </ImageSlide>
                    ))}
                  </EditImagesContainer>
                ) : (
                  <EmptyImageMessage>이미지를 업로드해주세요</EmptyImageMessage>
                )}
              </>
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

            {/* 총 이미지 개수 표시 */}
            {formType === "product" && totalImageCount > 0 && (
              <ImageCountBadge>{totalImageCount}/10</ImageCountBadge>
            )}
          </FormImgContainer>

          {/* 입력 필드들 */}
          {fields.map((field) => (
            <InputGroup key={field.name}>
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <RequiredCheck>*</RequiredCheck>}
              </label>

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
        </InputForm>
      </section>
    );
  }
);

EditForm.displayName = "EditForm";
export default EditForm;
