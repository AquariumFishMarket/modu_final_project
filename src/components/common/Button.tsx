
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
=======
import styled from "styled-components"

interface DefaultButtonProps {
    text: string;
    width?: number;
    disabled?: boolean;
    onClick?:()=>void;
    href?:string;
}

const DefaultBtn = styled.button<{ width?: number, disabled?: boolean }>`
    background:unset;
    border:unset;
    cursor:${(props)=>props.disabled === true ? 'initial' : 'pointer'};
    display:inline-block;
    text-align:center;
    text-decoration:unset;
    background-color:${(props)=>props.disabled === true ? 'var(--color-primary-400)' : 'var(--color-primary-600)'};
    color:#fff;
    font-size:14px;
    border-radius:500px;
    min-height:24px;
    line-height:44px;
    height:44px;
    width: ${(props)=>(props.width? `${props.width}px` : '100%')};
    transition: all 0.2s;

    &:active {
        background-color:var(--color-primary-800);
    }
    `

export default function DefaultButton({width,text,disabled,onClick,href} : DefaultButtonProps) {
    if(href) {
        return (
            <DefaultBtn as="a"
            width={width}
            href={href}
            >{text}</DefaultBtn>
        )
    } else {
        return (
            <DefaultBtn
            width={width}
            disabled={disabled}
            onClick={onClick}
            >{text}</DefaultBtn>
        )
    }

}
