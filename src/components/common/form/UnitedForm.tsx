import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import DefaultButton from "../buttons/Button";
import ImageContainer from "../imageUpload/ImageContainer";
import ProfileImg from "../ProfileImg";
import ImageUpButton from "../imageUpload/UploadButton";
import DeleteButton from "../imageUpload/DeleteButton";
import { CommonFormRef, UnifiedFormProps, ValidationErrors } from "./types";
import {
  InputForm,
  InputGroup,
  ErrorMessage,
  FormImgContainer,
  FormBtnContainer,
  RequiredCheck,
  ProfileImageOverlay,
  ProfileImageWrapper,
  EditImagesContainer,
  EmptyImageMessage,
  ImageCountBadge,
  ImageSlide,
} from "./Form.styled";

const UnifiedForm = forwardRef<CommonFormRef, UnifiedFormProps>(
  (
    {
      mode,
      formType,
      fields,
      showButton = true,
      onSubmit,
      onValidationChange,
      initialValues = {},
      initialImages = [],
      existingImageUrls = [],
    },
    ref
  ) => {
    const isEditMode = mode === "edit";

    // 초기값 설정 (수정 모드일 경우 initialValues 사용)
    const [formValues, setFormValues] = useState(() => {
      const initial: Record<string, string> = {};
      fields.forEach((field) => {
        initial[field.name] = initialValues[field.name] || "";
      });
      return initial;
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [validationStatus, setValidationStatus] = useState<{
      [key: string]: "idle" | "checking" | "success" | "error";
    }>({});
    const [imgFiles, setImgFiles] = useState<File[]>(initialImages);
    const [deleteIdx, setDeleteIdx] = useState<number | undefined>();
    const [hasUserInteraction, setHasUserInteraction] = useState(false);

    // 수정 모드 전용 상태
    const [deletedExistingImages, setDeletedExistingImages] = useState<
      number[]
    >([]);
    const [deleteExistingIdx, setDeleteExistingIdx] = useState<
      number | undefined
    >();

    // 총 이미지 개수 계산
    const totalImageCount = isEditMode
      ? existingImageUrls.length -
        deletedExistingImages.length +
        imgFiles.length
      : imgFiles.length;
    const hasSelectedImage = totalImageCount > 0;

    // 프로필 이미지 클릭 시 삭제 핸들러
    const handleProfileImageClick = () => {
      if (hasSelectedImage) {
        setImgFiles([]);
        if (isEditMode) {
          setDeletedExistingImages([0]); // 프로필은 단일 이미지
        }
      }
    };

    // 새 이미지 삭제 처리
    useEffect(() => {
      if (deleteIdx !== undefined) {
        const newImgFiles = imgFiles.filter((_, index) => index !== deleteIdx);
        setImgFiles(newImgFiles);
        setDeleteIdx(undefined);
      }
    }, [deleteIdx, imgFiles]);

    // 기존 이미지 삭제 처리 (수정 모드)
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

      // 검사 중인 필드가 있으면 비활성화
      const isChecking = Object.values(validationStatus).some(
        (status) => status === "checking"
      );

      return allRequiredFilled && hasNoErrors && !isChecking;
    };

    // 폼 유효성이 변경될 때마다 부모에게 알림
    useEffect(() => {
      const isValid = isFormValid();
      onValidationChange?.(isValid);
    }, [formValues, errors, validationStatus, onValidationChange]);

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
      setValidationStatus((prev) => ({ ...prev, [fieldName]: "idle" }));
    };

    // 포커스 아웃 시 유효성 검사
    const handleBlur = async (fieldName: string, value: string) => {
      // 수정 모드에서 사용자가 실제로 수정한 경우에만 검사
      if (isEditMode && !hasUserInteraction) return;

      const field = fields.find((f) => f.name === fieldName);

      // validator가 없으면 검사 안함
      if (!field?.validator) return;

      // 필수 필드가 아니고 비어있으면 검사 안함
      if (!field.required && !value.trim()) {
        return;
      }

      console.log(`${fieldName} 유효성 검사 시작:`, value);
      setValidationStatus((prev) => ({ ...prev, [fieldName]: "checking" }));
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));

      try {
        const errorMessage = await field.validator(value);
        console.log(`${fieldName} 검사 결과:`, errorMessage);

        if (errorMessage) {
          setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
          setValidationStatus((prev) => ({ ...prev, [fieldName]: "error" }));
        } else {
          setValidationStatus((prev) => ({ ...prev, [fieldName]: "success" }));
        }
      } catch (err) {
        console.error(`${fieldName} 검사 오류:`, err);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "검사 중 오류가 발생했습니다.",
        }));
        setValidationStatus((prev) => ({ ...prev, [fieldName]: "error" }));
      }
    };

    // 폼 제출 로직
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

      // 에러가 있으면 제출 중단
      if (Object.keys(newErrors).length > 0) {
        console.log("유효성 검사 실패:", newErrors);
        return false;
      }

      // onSubmit 호출
      if (onSubmit) {
        console.log("onSubmit 호출:", formValues);

        if (isEditMode) {
          // 수정 모드: FormData 형식
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

          onSubmit({
            formData,
            imageFiles: imgFiles,
            formValues,
          });
        } else {
          // 생성 모드: 간단한 객체 형식
          const submissionData: Record<string, string | File | null> = {
            ...formValues,
          };

          // 이미지 파일이 있으면 추가
          if (formType === "profile" && imgFiles.length > 0) {
            submissionData.profileImage = imgFiles[0];
          } else if (formType === "product") {
            imgFiles.forEach((file, index) => {
              submissionData[`productImage_${index}`] = file;
            });
          }

          onSubmit(submissionData);
        }
      }

      return true;
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

    // 초기값이 변경될 때 폼 상태 업데이트 (수정 모드)
    useEffect(() => {
      if (isEditMode && Object.keys(initialValues).length > 0) {
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
    }, [isEditMode, initialValues, fields, hasUserInteraction]);

    // 초기 이미지가 변경될 때 업데이트 (수정 모드)
    useEffect(() => {
      if (isEditMode && initialImages.length > 0) {
        setImgFiles(initialImages);
      }
    }, [isEditMode, initialImages]);

    // 프로필 이미지 렌더링 (수정 모드에서 기존 이미지 처리)
    const renderProfileImage = () => {
      if (isEditMode) {
        // 수정 모드: 기존 이미지 또는 새 이미지 표시
        const hasExistingImage =
          existingImageUrls.length > 0 && !deletedExistingImages.includes(0);
        const hasNewImage = imgFiles.length > 0;
        const displayImage = hasNewImage
          ? URL.createObjectURL(imgFiles[0])
          : hasExistingImage
          ? existingImageUrls[0]
          : undefined;

        return (
          <ProfileImageWrapper
            $hasImage={hasSelectedImage}
            onClick={handleProfileImageClick}
            title={hasSelectedImage ? "클릭하여 기본 이미지로 변경" : ""}
          >
            {!hasSelectedImage ? (
              <ProfileImg width={150} thumbimg={false} imgSrc={undefined} />
            ) : (
              <>
                <ProfileImg width={150} thumbimg={true} imgSrc={displayImage} />
                <ProfileImageOverlay>클릭하여 삭제</ProfileImageOverlay>
              </>
            )}
          </ProfileImageWrapper>
        );
      } else {
        // 생성 모드: 새 이미지만 표시
        return (
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
        );
      }
    };

    // 상품 이미지 렌더링
    const renderProductImages = () => {
      if (isEditMode) {
        // 수정 모드: 기존 이미지 + 새 이미지
        return (
          <>
            {hasSelectedImage ? (
              <EditImagesContainer>
                {/* 기존 이미지들 */}
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

                {/* 새 이미지들 */}
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
        );
      } else {
        // 생성 모드: 새 이미지만
        return (
          <ImageContainer
            key={`product-images-${imgFiles.length}`}
            imgArr={imgFiles}
            setDeleteIdx={setDeleteIdx}
          />
        );
      }
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
            {formType === "profile" && renderProfileImage()}

            {/* 상품용 이미지 렌더링 */}
            {formType === "product" && renderProductImages()}

            <FormBtnContainer $formType={formType}>
              <ImageUpButton
                multiple={formType === "product"}
                colortype="color"
                size="small"
                imgArr={imgFiles}
                setImgArr={setImgFiles}
              />
            </FormBtnContainer>

            {/* 총 이미지 개수 표시 (상품 전용) */}
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

UnifiedForm.displayName = "UnifiedForm";
export default UnifiedForm;
