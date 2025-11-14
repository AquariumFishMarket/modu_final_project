import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface ImageButtonProps {
    colortype: 'color' | 'gray';
    size: 'large' | 'small';
    imgArr: File[];
    setImgArr: Dispatch<SetStateAction<File[]>>;
    existingCount?: number;
}

interface MultipleBtn extends ImageButtonProps {
    multiple: true;
}

interface SingleBtn extends ImageButtonProps {
    multiple: false;
}

type ButtonType = MultipleBtn | SingleBtn;

const DefaultBtn = styled.button<{size:string,$colortype:string}>`
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
    background-color: ${(props)=>props.$colortype === 'color' ? 'var(--color-primary-600)' : 'var(--color-gray-medium)'};
    border-radius:100%;
    width:${(props)=>props.size === 'large' ? '50px' : '36px'};
    height:${(props)=>props.size === 'large' ? '50px' : '36px'};
    transition: all 0.2s;

    &:active {
        background-color:var(--color-primary-800);
    }
`

export default function ImageUpButton({multiple, colortype, size, imgArr, setImgArr, existingCount = 0}:ButtonType) {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [realtimeArr,setRealtimeArr] = useState<File[]>([])

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

        setRealtimeArr(filtered)
        e.target.value = '';
    }

    useEffect(()=>{
        if (realtimeArr.length === 0) return;

        const total = [...imgArr, ...realtimeArr];
        const totalWithExisting = total.length + existingCount;

        if(multiple == true) {
            if(totalWithExisting > 10) {
                alert(`이미지는 10장까지 업로드 가능합니다.\n(현재: 기존 ${existingCount}장 + 선택 ${total.length}장 = ${totalWithExisting}장)`);
                setRealtimeArr([]);
            } else {
                setImgArr(total);
            }
        } else {
            setImgArr(total);
        }
    },[realtimeArr])

    return (
        <>
            <input type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={(e)=>handleFileChange(e)}
            className="sr-only"
            />
            <DefaultBtn $colortype={colortype} size={size} onClick={()=>{handleImgUpload()}} />
        </>
    )
}