import { useRef, useState } from "react";
import styled from "styled-components"
import ButtonTextField from "./Buttons/ButtonTextField";

interface textfield {
  left: React.ReactNode;
  placeholder: string;
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

export default function TextField({left,placeholder}:textfield) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [btnColor,setBtnColor] = useState(false)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        target.style.height = 'auto';
        target.style.height = target.scrollHeight - 19.5 + 'px';

        if(textAreaRef.current?.value !=='') {
          setBtnColor(true)
        } else {
          setBtnColor(false)
        }
    }
  return (
        <Container>
          <ContainerInner>
            <Left>
            {left}
            </Left>
            <TextArea
            placeholder={placeholder}
            onChange={handleTextChange}
            ref={textAreaRef} />
            <Right><ButtonTextField textcolor={btnColor}/></Right>
          </ContainerInner>
        </Container>
    )
}