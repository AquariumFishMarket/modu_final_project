// 공통 Form 타입

export type FormMode = "create" | "edit";

export interface CommonFormRef {
  submitForm: () => void;
}

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

export interface FormSubmissionData {
  [key: string]:
    | string
    | File
    | null
    | FormData
    | File[]
    | Record<string, string>;
  // formData?: FormData;
  // imageFiles?: File[];
  // formValues?: Record<string, string>;
  // hasCustomImage?: boolean;
  // useDefaultImage?: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface BaseFormProps {
  formType: "profile" | "product";
  fields: FormFieldConfig[];
  showButton?: boolean;
  onSubmit?: (data: FormSubmissionData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export type CreateFormProps = BaseFormProps;

export interface EditFormProps extends BaseFormProps {
  initialValues?: { [key: string]: string };
  initialImages?: File[];
  existingImageUrls?: string[];
}

export interface UnitedFormProps extends BaseFormProps {
  mode: FormMode;
  initialValues?: { [key: string]: string };
  initialImages?: File[];
  existingImageUrls?: string[];
}
