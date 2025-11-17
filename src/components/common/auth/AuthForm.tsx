import React, { useState, useMemo } from "react";
import DefaultButton from "../buttons/Button";
import {
  Form,
  Fieldset,
  InputGroup,
  Label,
  Input,
  ErrorMessage,
  ResultMessage,
} from "./AuthForm.styled";

import {
  validateEmail,
  validatePassword,
} from "../../../utils/validation/AuthValidation";

interface FormField {
  type: "email" | "password";
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface AuthFormProps {
  fields: FormField[];
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeHolder?: string;
  disabled?: boolean;
  formError?: string;
}

export default function AuthForm({
  fields,
  buttonText,
  onSubmit,
  disabled = false,
  formError,
}: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 검증 함수 맵
  const validators: Record<string, (value: string) => string> = {
    email: validateEmail,
    password: validatePassword,
  };

  const validateField = (name: string, value: string): string => {
    const field = fields.find((f) => f.name === name);
    if (!field) return "";

    const validator = validators[field.type];
    const error = validator ? validator(value) : "";

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = values[field.name] || "";
      const validator = validators[field.type];
      const error = validator ? validator(value) : "";

      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = fields.find(
        (field) => validationErrors[field.name]
      );
      if (firstErrorField) {
        document.getElementById(firstErrorField.name)?.focus();
      }
      return;
    }

    onSubmit(e);

    // try {
    //   await onSubmit(e);
    // } catch (error) {
    //   console.error("인증 폼 제출 에러: ", error);
    // }
  };

  const isFormValid = useMemo(() => {
    return fields.every((field) => {
      const value = values[field.name];
      if (!value || value.trim().length === 0) return false;

      const validator = validators[field.type];
      return validator ? validator(value) === "" : true;
    });
  }, [fields, values]);

  return (
    <section>
      <Form $status={!!formError} onSubmit={handleSubmit}>
        <Fieldset>
          <legend className="sr-only">로그인 정보 입력</legend>

          {/* 입력 필드들 */}
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
                onBlur={field.onBlur}
                $hasError={!!errors[field.name]}
                required={field.required}
              />
              {/* 필드별 에러 메시지 */}
              {errors[field.name] && (
                <ErrorMessage>{errors[field.name]}</ErrorMessage>
              )}
            </InputGroup>
          ))}
        </Fieldset>

        {/* 전체 결과 에러 메시지 */}
        {formError && <ResultMessage>{formError}</ResultMessage>}

        <DefaultButton
          text={buttonText}
          disabled={!isFormValid || disabled}
          type="submit"
        />
      </Form>
    </section>
  );
}
