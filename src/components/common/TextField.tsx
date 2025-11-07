import { useRef, useState } from "react";
import styled from "styled-components"
import ButtonTextField from "./Buttons/ButtonTextField";

interface textfield {
  left?: React.ReactNode;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  onClick?:()=>void;
}

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  background-color:#fff;
  position: fixed;
  left: 50%;
  right: 0;
  transform:translateX(-50%);
  bottom: 0;
  padding: 12px 16px;
  border-top: 1px solid var(--color-gray-medium);
  z-index: 1000;
`
const ContainerInner = styled.div`
  position:relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 4px;
`
const Left = styled.div`
  position: absolute;
  top:0;
  left:0;
`
const Right = styled.div`
  position: absolute;
  top:0;
  right:0;
`
const TextArea = styled.textarea`
    width: calc(100% - 94px);
    padding: 8px 14px;
    border: unset;
    height: 36px;
    max-height: 90px;
    font-size: var(--font-size-md);
    resize:none;
    &:focus,&:active {
      outline: none;
    }
`

export default function TextField({left, placeholder, value, onChange, onSubmit}:textfield) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [btnColor,setBtnColor] = useState(false)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        target.style.height = 'auto';
        target.style.height = target.scrollHeight - 19.5 + 'px';

        // 외부 onChange가 있으면 호출
        if (onChange) {
          onChange(e);
        }

        if(textAreaRef.current?.value !=='') {
          setBtnColor(true)
        } else {
          setBtnColor(false)
        }
    }

    const handleSubmit = () => {
      if (onSubmit && textAreaRef.current?.value.trim()) {
        onSubmit();
        // 제출 후 높이 초기화
        if (textAreaRef.current) {
          textAreaRef.current.style.height = '36px';
        }
      }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }

  return (
        <Container>
          <ContainerInner>
            {left && (
              <Left>
                {left}
              </Left>
            )}
            <TextArea
              placeholder={placeholder}
              value={value}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              ref={textAreaRef}
            />
            <Right>
              <div onClick={handleSubmit}>
                <ButtonTextField textcolor={btnColor}/>
              </div>
            </Right>
          </ContainerInner>
        </Container>
    )
}