import React, { useState, useMemo } from "react";
import DefaultButton from "../Button";
import {
  Form,
  Fieldset,
  InputGroup,
  Label,
  Input,
  ErrorMessage,
} from "./AuthForm.styled";
import { validateEmail, validatePassword } from "./AuthForm.utils";

interface FormField {
  type: "email" | "password";
  name: string;
  label: string;
  placeholder?: string;
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

export default function AuthForm({
  fields,
  buttonText,
  onSubmit,
  onButtonClick,
  disabled = false,
}: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid = useMemo(() => {
    const fieldResults = fields.map((field) => {
      const value = values[field.name];

      if (!value || value.trim().length === 0) {
        return false;
      }

      let error = "";
      if (field.name === "email") {
        error = validateEmail(value);
      } else if (field.name === "password") {
        error = validatePassword(value);
      }

      return error === "";
    });

    return fieldResults.every((result) => result);
  }, [fields, values]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = fields.find((field) => errors[field.name]);
      if (firstErrorField) {
        document.getElementById(firstErrorField.name)?.focus();
      }
      return;
    }

    try {
      await onSubmit(e);
    } catch (error) {
      console.error("Form submission error:", error);
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
          disabled={!isFormValid || disabled}
          onClick={onButtonClick}
        />
      </Form>
    </section>
  );
}
