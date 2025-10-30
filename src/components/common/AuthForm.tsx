import React, { useState } from "react";
import styled from "styled-components";
import DefaultButton from "./Button";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0 34px;
  gap: 30px;
`;

const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 12px;
  color: var(--color-gray-dark);
  font-weight: 500;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  border-bottom: 1px solid
    ${(props) =>
      props.$hasError ? "var(--color-error)" : "var(--color-gray-medium)"};
  border-top: none;
  border-left: none;
  border-right: none;
  padding: 8px 0;
  background: transparent;
  font-size: 14px;

  &:focus {
    outline: none;
    border-bottom-color: ${(props) =>
      props.$hasError ? "var(--color-error)" : "var(--color-primary-600)"};
  }
`;

const ErrorMessage = styled.span`
  color: var(--color-error);
  font-size: 12px;
  margin-top: 4px;
`;

interface FormField {
  type: "email" | "password";
  name: string;
  label: string;
  placeholder?: string; // 선택적 프로퍼티로 추가
  required?: boolean;
}

interface AuthFormProps {
  fields: FormField[];
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onButtonClick: () => void;
  placeHolder?: string;
  disabled?: boolean;
}

// 유효성 검사 함수들
const validateEmail = (email: string): string => {
  if (!email.trim()) return "이메일을 입력해 주세요.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return "";
};

const validatePassword = (password: string): string => {
  if (!password) return "비밀번호를 입력해 주세요.";
  if (password.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
  return "";
};

export default function AuthForm({
  fields,
  buttonText,
  onSubmit,
  onButtonClick,
  disabled = true,
}: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // 실시간 유효성 검사
    if (errors[name]) {
      validateField(name, value);
    }
  };

  // 필드별 유효성 검사
  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "email") {
      error = validateEmail(value);
    } else if (name === "password") {
      error = validatePassword(value);
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  // 전체 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = values[field.name] || "";
      const error =
        field.name === "email" ? validateEmail(value) : validatePassword(value);

      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      // 첫 번째 에러 필드에 포커스
      const firstErrorField = fields.find((field) => errors[field.name]);
      if (firstErrorField) {
        document.getElementById(firstErrorField.name)?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(e);
    } catch (error) {
      // 서버 에러 처리는 부모 컴포넌트에서
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <Form onSubmit={handleSubmit}>
        <Fieldset>
          <legend className="sr-only">로그인 정보 입력</legend>
          {fields.map((field) => (
            <InputGroup key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={handleInputChange}
                $hasError={!!errors[field.name]}
                required={field.required}
              />
              {errors[field.name] && (
                <ErrorMessage>{errors[field.name]}</ErrorMessage>
              )}
            </InputGroup>
          ))}
        </Fieldset>
        <DefaultButton
          text={buttonText}
          disabled={disabled || isSubmitting}
          onClick={onButtonClick}
        />
      </Form>
    </section>
  );
}
