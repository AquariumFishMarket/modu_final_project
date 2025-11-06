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
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-dark);
  vertical-align: bottom;
  margin-bottom: 10px;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  border-bottom: 1px solid
    ${(props) =>
      props.$hasError ? "var(--color-error)" : "var(--color-gray-medium)"};
  border-top: none;
  border-left: none;
  border-right: none;
  background: transparent;
  font-size: var(--font-size-md);

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
  font-size: var(--font-size-sm);
  margin-top: 6px;
`;
