// 공통 Form 타입

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
  formData: FormData;
  imageFiles: File[];
  formValues: Record<string, string>;
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
