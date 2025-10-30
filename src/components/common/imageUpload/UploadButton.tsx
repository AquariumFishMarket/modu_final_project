import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface ImageButtonProps {
    colortype: 'color' | 'gray';
    size: 'large' | 'small';
    imgArr: File[];
    setImgArr: Dispatch<SetStateAction<File[]>>
}

const DefaultBtn = styled.button<{size:string,colortype:string}>`
    background:unset;
    border:unset;
    cursor:pointer;
    display:inline-block;
    text-align:center;
    background-image:
    ${(props)=>props.size === 'large' ? 'url(/img/icon-picture.svg)' : 'url(/img/icon-picture-s.svg)'};
    background-repeat: no-repeat;
    background-size: initial;
    background-position: center;
    background-color: ${(props)=>props.colortype === 'color' ? 'var(--color-primary-600)' : 'var(--color-gray-medium)'};
    border-radius:100%;
    width:${(props)=>props.size === 'large' ? '50px' : '36px'};
    height:${(props)=>props.size === 'large' ? '50px' : '36px'};
    transition: all 0.2s;

    &:active {
        background-color:var(--color-primary-800);
    }
`

export default function ImageUpButton({colortype, size, imgArr, setImgArr}:ImageButtonProps) {

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImgUpload = () => {
        //button click -> input[type="file"] click
        fileInputRef.current?.click();
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        const filtered = files.filter((file) => {
        if (!validTypes.includes(file.type)) {
            alert('이미지 파일만 업로드 가능합니다.');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return false;
        }
        return true;
        });

        const total = [...imgArr, ...filtered].slice(0, 10);
        setImgArr(total);

        // input 초기화
        e.target.value = '';
    }

    return (
        <>
            <input type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={(e)=>handleFileChange(e)}
            className="sr-only"
            />
            <DefaultBtn colortype={colortype} size={size} onClick={()=>{handleImgUpload()}} />
        </>
    )
}