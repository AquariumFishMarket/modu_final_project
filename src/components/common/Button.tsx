import styled from "styled-components";

interface ButtonProps {
  text: string;
  width?: number;
  disabled?: boolean;
  onClick?: () => void;
}

const StyledButton = styled.button<{ $width?: number }>`
  width: ${(props) => (props.$width ? `${props.$width}px` : "auto")};
  padding: 0.7rem 1.6rem;
  border: none;
  border-radius: 3.2rem;
  font-family: "font-medium", "sans-serif";
  font-size: var(--font-size-md);
  background-color: var(--main-color);
  color: #fff;
  cursor: pointer;

  &:disabled {
    background-color: #dbdbdb;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }
`;

function DefaultButton({ text, width, disabled = false, onClick }: ButtonProps) {
  return (
    <StyledButton $width={width} disabled={disabled} onClick={onClick}>
      {text}
    </StyledButton>
  );
}

export default DefaultButton;
