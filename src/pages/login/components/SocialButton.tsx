import styled from "styled-components";
import { forwardRef } from "react";

// 소셜 로그인 버튼 Props
interface SocialButtonProps {
  text: string;
  width?: number;
  onClick?: () => void;
  href?: string;
  icon?: string;
  borderColor?: string;
  loading?: boolean;
  skeleton?: string;
}

// 소셜 로그인 버튼 스타일
const SocialBtn = styled.button<{
  $width?: number;
  $borderColor?: string;
  $icon?: string;
  $loading?: boolean;
  $skeleton?: string;
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
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: 14px;
  ${(props)=>!props.$loading && `
      &::before {
      content: '';
      position: absolute;
      left: 14px;
      width: 20px;
      height: 20px;
      background: ${props.$skeleton};
      filter: blur(7px);
      z-index: 10;
      opacity: 0.6;
      }
    `}
  &:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
`;

const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(({
  width,
  text,
  onClick,
  href,
  icon,
  loading,
  borderColor,
  skeleton},ref) => {
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
      ref={ref}
      $loading={loading}
      $skeleton={skeleton}
    >
      {text}
    </SocialBtn>
  );
})

// export default function SocialButton({
//   width,
//   text,
//   onClick,
//   href,
//   icon,
//   borderColor,
// }: SocialButtonProps) {
//   if (href) {
//     return (
//       <SocialBtn
//         as="a"
//         $width={width}
//         href={href}
//         $borderColor={borderColor}
//         $icon={icon}
//       >
//         {text}
//       </SocialBtn>
//     );
//   }

//   return (
//     <SocialBtn
//       $width={width}
//       onClick={onClick}
//       $borderColor={borderColor}
//       $icon={icon}
//     >
//       {text}
//     </SocialBtn>
//   );
// }

export default SocialButton