import React, {
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import ImageContainer from "../imageUpload/ImageContainer";
import ProfileImg from "../ProfileImg";
import ImageUpButton from "../imageUpload/UploadButton";
import {
  CommonFormRef,
  EditFormProps,
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
  ProfileImageWrapper,
  ProfileImageOverlay,
} from "./Form.styled";

function EditFormInner<T extends FormData>(
  props: EditFormProps<T>,
  ref: React.Ref<CommonFormRef>
) {
  const {
    formType,
    fields,
    onSubmit,
    onValidationChange,
    initialValues = {},
    initialImageUrl = "",
  } = props;
  // 초기값으로 폼 상태 초기화
  const [formValues, setFormValues] = useState(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = initialValues[field.name] || "";
    });
    return initial;
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl); // 기존 이미지 URL
  const [hasUserInteraction, setHasUserInteraction] = useState(false);

  // 프로필 이미지 프리뷰 URL 캐싱 -> 이미지 깜빡거림 해결
  const previewUrl = useMemo(
    () => (imgFile ? URL.createObjectURL(imgFile) : imageUrl || undefined),
    [imgFile, imageUrl]
  );

  // 버튼 활성화 조건
  const isFormValid = useMemo(() => {
    const requiredFields = fields.filter((field) => field.required);

    const allRequiredFilled = requiredFields.every((field) =>
      formValues[field.name]?.trim()
    );
    const hasNoErrors = Object.values(errors).every((error) => !error);

    return allRequiredFilled && hasNoErrors;
  }, [fields, formValues, errors]);

  // 폼 유효성이 변경될 때마다 부모에게 알림
  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  // 입력 변경 핸들러
  const handleInputChange = (fieldName: string, value: string) => {
    const field = fields.find((f) => f.name === fieldName);

    let formattedValue = value;
    if (field?.formatter) {
      formattedValue = field.formatter(value);
    }
    setFormValues((prev) => ({ ...prev, [fieldName]: formattedValue }));
    setHasUserInteraction(true);
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  // 포커스 아웃 시 유효성 검사
  const handleBlur = async (fieldName: string, value: string) => {
    if (!hasUserInteraction) return; // 사용자가 실제로 수정한 경우에만 유효성 검사

    const field = fields.find((f) => f.name === fieldName);

    // 기존 값과 같으면 검사 안함 (중복 체크 불필요)
    if (value === initialValues[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      return;
    }

    if (field?.validator) {
      if (value.trim()) {
        const errorMessage = await field.validator(value);
        if (errorMessage) {
          setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
        } else {
          setErrors((prev) => ({ ...prev, [fieldName]: "" }));
        }
      } else {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      }
    }
  };

  // 폼 제출 로직
  const performSubmit = useCallback(async () => {
    const newErrors: ValidationErrors = {};
    for (const field of fields) {
      if (field.required && !formValues[field.name]?.trim()) {
        newErrors[field.name] = `${field.label}는 필수입니다.`;
      } else if (field.validator && formValues[field.name]?.trim()) {
        // 기존 값과 같으면 검증 안함
        if (formValues[field.name] !== initialValues[field.name]) {
          const error = await field.validator(formValues[field.name]);
          if (error) newErrors[field.name] = error;
        }
      }
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // 단일 이미지와 폼 데이터 전달
      onSubmit?.({
        ...formValues,
        image: imgFile || imageUrl || undefined,
      } as T);
      return true;
    }
    return false;
  }, [fields, formValues, imgFile, imageUrl, initialValues, onSubmit]);

  // 외부에서 호출할 수 있는 제출 함수
  const submitForm = async () => {
    console.log("📤 submitForm 호출됨");
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

  // 최초 마운트 시에만 초기값으로 폼 상태 설정 (입력 후에는 덮어쓰지 않음)
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFormValues(() => {
        const updated: Record<string, string> = {};
        fields.forEach((field) => {
          updated[field.name] = initialValues[field.name] || "";
        });
        return updated;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 초기 이미지 URL이 변경될 때 업데이트
  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  // ⁉️ 이미지 업로드 핸들러 (배열 → 단일)
  const handleImageChange: Dispatch<SetStateAction<File[]>> = useCallback(
    (filesOrUpdater) => {
      // SetStateAction은 값 또는 함수일 수 있음
      if (typeof filesOrUpdater === "function") {
        // 함수형 업데이트는 사용 안함
        return;
      }

      // 배열을 받아서 첫 번째 요소만 사용
      const files = filesOrUpdater as File[];
      setImgFile(files[0] || null);
    },
    []
  );

  return (
    <section>
      <InputForm onSubmit={handleSubmit}>
        <legend className="sr-only">사용자 설정</legend>

        <FormImgContainer
          $formType={formType}
          $hasSelectedImage={!!(imgFile || imageUrl)}
        >
          {/* 프로필용 이미지 렌더링 */}
          {formType === "profile" && (
            <ProfileImageWrapper
              $hasImage={!!previewUrl}
              onClick={() => {
                setImgFile(null);
                setImageUrl("");
              }}
              title={previewUrl ? "클릭하여 기본 이미지로 변경" : ""}
            >
              {!previewUrl ? (
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
          {formType === "product" && previewUrl && (
            <ImageContainer
              key={`product-images-${previewUrl}`}
              imgArr={imgFile ? [imgFile] : imageUrl ? [imageUrl as unknown as File] : []}
              setDeleteIdx={() => {
                setImgFile(null);
                setImageUrl("");
              }}
            />
          )}

          <FormBtnContainer $formType={formType}>
            <ImageUpButton
              multiple={false}
              colortype="color"
              size="small"
              imgArr={imgFile ? [imgFile] : []}
              setImgArr={handleImageChange}
            />
          </FormBtnContainer>
        </FormImgContainer>
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

const EditForm = forwardRef(EditFormInner) as <T extends FormData = FormData>(
  props: EditFormProps<T> & { ref?: React.Ref<CommonFormRef> }
) => React.ReactElement | null;

export default EditForm;
