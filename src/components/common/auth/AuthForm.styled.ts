import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0 34px;
  gap: 30px;
`;

export const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 12px;
  color: var(--color-gray-dark);
  font-weight: 500;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
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

  &::placeholder {
    color: var(--color-gray-medium);
  }
`;

export const ErrorMessage = styled.span`
  color: var(--color-error);
  font-size: 12px;
  margin-top: 6px;
`;
