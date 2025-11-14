// 공통 Form 타입

// ===================================
// 기본 타입
// ===================================

export type FormMode = "create" | "edit";

export interface CommonFormRef {
  submitForm: () => Promise<void>;
}

// ===================================
// 폼 필드 설정
// ===================================

export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validator?: (value: string) => Promise<string | null> | string | null;
  type?: "input" | "textarea";
  maxLength?: number;
  formatter?: (value: string) => string;
  disabled?: boolean; // 읽기 전용 필드 (계정ID)
}

// ===================================
// 폼 데이터 타입
// ===================================

/**
 * 폼에서 수집하는 데이터
 * - 텍스트 필드는 string
 * - 이미지 필드는 File (새 이미지) 또는 string (기존 URL)
 */

interface BaseFormData {
  [key: string]: string | File | undefined;
}

// 프로필 전용 FormData
export interface ProfileFormData extends BaseFormData {
  username: string;
  accountname: string;
  intro?: string;
  image?: File | string;
}

// 상품 전용 FormData
export interface ProductFormData extends BaseFormData {
  itemName: string;
  price: string; // 제출 시 number로 변환
  link?: string;
  itemImage?: File | string;
}

export type FormData = ProfileFormData | ProductFormData;

// ===================================
// 유효성 검사
// ===================================

export type ValidationErrors = Record<string, string>;

// ===================================
// API 요청 타입
// ===================================

/**
 * 프로필 업데이트 API 요청
 */
export interface ProfileRequest {
  username: string;
  accountname: string;
  intro: string;
  image?: string; // URL 문자열
}

/**
 * 상품 등록/수정 API 요청
 */
export interface ProductRequest {
  itemName: string;
  price: number;
  link: string;
  itemImage: string;
}

// ===================================
// 컴포넌트 Props
// ===================================

/**
 * 공통 Form Props
 */
export interface BaseFormProps<T extends FormData = FormData> {
  formType: "profile" | "product";
  fields: FormFieldConfig[];
  showButton?: boolean;
  onSubmit?: (data: T) => void;
  onValidationChange?: (isValid: boolean) => void;
}

/**
 * CreateForm Props (새로 생성)
 */
export interface CreateFormProps<T extends FormData = FormData> extends BaseFormProps<T> {
  buttonText?: string;
  disabled?: boolean;
}

/**
 * EditForm Props (수정)
 */
export interface EditFormProps<T extends FormData = FormData> extends BaseFormProps<T> {
  initialValues?: Record<string, string>;
  initialImageUrl?: string;
}
