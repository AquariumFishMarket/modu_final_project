import styled from "styled-components";

// 소셜 로그인 버튼 Props
interface SocialButtonProps {
  text: string;
  width?: number;
  onClick?: () => void;
  href?: string;
  icon?: string;
  borderColor?: string;
}

// 소셜 로그인 버튼 스타일
const SocialBtn = styled.button<{
  $width?: number;
  $borderColor?: string;
  $icon?: string;
}>`
  position: relative;
  border: 1px solid
    ${(props) => props.$borderColor || "var(--color-gray-medium)"};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: unset;
  width: ${(props) => (props.$width ? `${props.$width}px` : "100%")};
  min-height: 24px;
  height: 44px;
  padding: 0 14px;
  margin: 0 auto;
  background-color: transparent;
  color: var(--color-gray-dark);
  font-size: 14px;
  border-radius: 44px;
  transition: all 0.2s;

  /* 아이콘 스타일 */
  ${(props) =>
    props.$icon &&
    `
    &::before {
      content: "";
      background-image: url(${props.$icon});
      background-size: 20px 20px;
      background-repeat: no-repeat;
      background-position: center;
      width: 24px;
      height: 24px;
      position: absolute;
      left: 14px;
      flex-shrink: 0;
    }
  `}

  &:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
`;

export default function SocialButton({
  width,
  text,
  onClick,
  href,

  icon,
  borderColor,
}: SocialButtonProps) {
  if (href) {
    return (
      <SocialBtn
        as="a"
        $width={width}
        href={href}
        $borderColor={borderColor}
        $icon={icon}
      >
        {text}
      </SocialBtn>
    );
  }

  return (
    <SocialBtn
      $width={width}
      onClick={onClick}
      $borderColor={borderColor}
      $icon={icon}
    >
      {text}
    </SocialBtn>
  );
}
