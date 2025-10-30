import styled from "styled-components"

interface ImageButtonProps {
    type: 'color' | 'gray';
    size: 'large' | 'small';
    onClick?:()=>void;
}

const DefaultBtn = styled.button<{size:string,type:string}>`
    background:unset;
    border:unset;
    cursor:pointer;
    display:inline-block;
    text-align:center;
    background-image:
    ${(props)=>props.size === 'large' ? 'url(/images/icon-picture.svg)' : 'url(/images/icon-picture-s.svg)'};
    background-repeat: no-repeat;
    background-size: initial;
    background-position: center;
    background-color: ${(props)=>props.type === 'color' ? 'var(--color-primary-600)' : 'var(--color-gray-medium)'};
    border-radius:100%;
    width:${(props)=>props.size === 'large' ? '50px' : '36px'};
    height:${(props)=>props.size === 'large' ? '50px' : '36px'};
    transition: all 0.2s;

    &:active {
        background-color:var(--color-primary-800);
    }
`

export default function ImageUpButton({type, size, onClick}:ImageButtonProps) {
    return (
        <DefaultBtn type={type} size={size} onClick={onClick} />
    )
}