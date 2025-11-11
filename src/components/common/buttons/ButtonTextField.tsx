import styled from "styled-components"

interface TextColor {
    textcolor: boolean;
    onClick?:()=>void;
}

const Button = styled.button<{$textcolor: boolean}>`
    background-color: transparent;
    height: 36px;
    width: 36px;
    color: ${(props)=>props.$textcolor ? 'rgba(242, 110, 34, 1)' : 'var(--color-gray-semi-dark)'};
    font-size: var(--font-size-md);
`

export default function ButtonTextField({textcolor,onClick}:TextColor) {

    return (
        <Button $textcolor={textcolor} onClick={onClick}>게시</Button>
    )
}