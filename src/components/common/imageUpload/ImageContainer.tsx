import { Dispatch, SetStateAction, useState } from "react";
import DeleteButton from "./DeleteButton";
import styled from "styled-components"

interface imgcontainer {
    type: 'post' | 'profile';
    setDeleteIdx: Dispatch<SetStateAction<number | undefined>>;
    imgArr: File[]
}

//이미지 여러개일 때
const ContainerArr = styled.ul`
    display: flex;
    width: calc(100% - 90px);
    overflow-x: scroll;
`
const ImageListArr = styled.li`
    position: relative;
    width: 80px;
    border-radius: 10px;
    overflow: hidden;
    flex: 0 0 auto;
    aspect-ratio: 1;
    margin-right: 8px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`
const ContainerProfile = styled.div`
    width: 100%;
    height: 100%;
`
const ImageSolo = styled.div`
    position: relative;
    height: 100%;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

export default function ImageContainer({type,imgArr,setDeleteIdx}:imgcontainer) {
    if(type === 'post') {
        return (
            <ContainerArr>
                {
                    imgArr.map((imgele,i)=>(
                        <ImageListArr key={i}>
                            <img
                            src={URL.createObjectURL(imgele)}
                            alt={`preview-${i}`}
                            ></img>
                            <DeleteButton data-index={i} setDeleteIdx={setDeleteIdx}/>
                        </ImageListArr>
                    ))
                }
            </ContainerArr>
        )
    }
    if(type === 'profile') {
        const LastImageIdx = imgArr[imgArr.length - 1];
        return (
            <>
            {LastImageIdx && (
                <ContainerProfile>
                    <ImageSolo>
                        <img
                        src={URL.createObjectURL(LastImageIdx)}
                        alt={`나의 프로필`}
                        ></img>
                    </ImageSolo>
                </ContainerProfile>
            )}
            </>
        )
    }

}