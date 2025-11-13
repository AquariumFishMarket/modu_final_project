// 공통 Form 타입

export type FormMode = "create" | "edit";

export interface CommonFormRef {
  submitForm: () => void;
}

// 입력 필드
export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  validator?: (value: string) => Promise<string | null> | string | null;
  type?: "input" | "textarea";
  maxLength?: number;
  formatter?: (value: string) => string; // 포맷터 함수 추가
}

export interface FormData {
  [key: string]: string | File | undefined;

  // 프로필 전용 필드
  username?: string;
  accountname?: string;
  intro?: string;
  image?: File; // 폼에서 선택한 이미지 파일

  // 상품 전용 필드
  itemName?: string;
  price?: string; // 제출 시 number로 변환
  link?: string;
  itemImage?: File; // 폼에서 선택한 이미지 파일

  // formData?: FormData;
  // imageFiles?: File[];
  // formValues?: Record<string, string>;
  // hasCustomImage?: boolean;
  // useDefaultImage?: boolean;
}

// API 요청용 타입
export interface ProductRequest {
  itemName: string;
  price: number;
  link: string;
  itemImage: string;
}

export interface ProfileRequest {
  username: string;
  accountname: string;
  intro: string;
  image?: string; // URL 문자열
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface BaseFormProps {
  formType: "profile" | "product";
  fields: FormFieldConfig[];
  showButton?: boolean;
  onSubmit?: (data: FormData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export type CreateFormProps = BaseFormProps;

export interface EditFormProps extends BaseFormProps {
  initialValues?: { [key: string]: string };
  initialImages?: File[];
  existingImageUrls?: string[];
}
