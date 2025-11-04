import styled from "styled-components";

interface DefaultButtonProps {
  text: string;
  width?: number;
  height?: string;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "white";
}

const DefaultBtn = styled.button<{
  width?: number;
  height?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "white";
}>`
  background: unset;
  border: ${(props) =>
    props.variant === "white" ? "1px solid var(--color-gray-light)" : "unset"};
  cursor: ${(props) => (props.disabled === true ? "initial" : "pointer")};
  display: inline-block;
  text-align: center;
  text-decoration: unset;
  background-color: ${(props) => {
    if (props.disabled === true) return "var(--color-primary-400)";
    if (props.variant === "secondary") return "var(--color-gray-semi-dark)";
    if (props.variant === "white") return "#fff";
    return "var(--color-primary-600)";
  }};
  color: ${(props) =>
    props.variant === "white" ? "var(--color-gray-dark)" : "#fff"};
  font-size: 14px;
  border-radius: 500px;
  min-height: 24px;
  height: ${(props) => {
    if (props.height == 'large') return '44px';
    if (props.height == 'mediup') return '34px';
    if (props.height == 'small') return '28px'
  }};
  line-height: ${(props) => {
    if (props.height == 'large') return '44px';
    if (props.height == 'mediup') return '34px';
    if (props.height == 'small') return '28px'
  }};
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  transition: all 0.2s;

  &:not(:disabled):active {
    background-color: ${(props) => {
      if (props.variant === "secondary") return "var(--color-gray-semi-dark)";
      if (props.variant === "white") return "var(--color-gray-light)";
      return "var(--color-primary-800)";
    }};
  }
`;

export default function DefaultButton({
  width,
  height = "large",
  text,
  disabled,
  onClick,
  href,
  variant = "primary",
}: DefaultButtonProps) {
  if (href) {
    return (
      <DefaultBtn as="a" width={width} height={height} href={href} variant={variant}>
        {text}
      </DefaultBtn>
    );
  } else {
    return (
      <DefaultBtn
        width={width}
        height={height}
        disabled={disabled}
        onClick={onClick}
        variant={variant}
      >
        {text}
      </DefaultBtn>
    );
  }
}
