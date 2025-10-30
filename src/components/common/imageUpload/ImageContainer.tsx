import { useState } from "react";
import styled from "styled-components"

interface imgcontainer {
    type: 'post' | 'profile';
    imgArr: File[]
}

const ContainerArr = styled.ul`
    margin-top: 13px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    gap: 0;
`
const ImageListArr = styled.li`
    width: 50%;
    border-radius: 10px;
    overflow: hidden;
    flex: 0 0 auto;
    aspect-ratio: 168 / 126;
    margin-right: 8px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const ContainerSolo = styled.div<{type:string}>`
    width: 100%;
    height: ${(props)=>props.type === 'profile' ? '100%' : 'auto'};
    border-radius: ${(props)=>props.type === 'profile' ? '100%' : '20px'};
    overflow: hidden;
`
const ImageSolo = styled.div`
    height: 100%;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

export default function ImageContainer({type,imgArr}:imgcontainer) {
    const LastImageIdx = imgArr[imgArr.length - 1];

    return (
        <>
        {imgArr.length > 1 && type === 'post' && (
            <ContainerArr>
                {
                    imgArr.map((imgele,i)=>(
                        <ImageListArr key={i}>
                            <img
                            src={URL.createObjectURL(imgele)}
                            alt={`preview-${i}`}
                            ></img>
                        </ImageListArr>
                    ))
                }
            </ContainerArr>
        )}
        {imgArr.length < 2 && type === 'post' && (
            <ContainerSolo type={type}>
                {
                    imgArr.map((imgele,i)=>(
                        <ImageSolo key={i}>
                            <img
                            src={URL.createObjectURL(imgele)}
                            alt={`preview-${i}`}
                            ></img>
                        </ImageSolo>
                    ))
                }
            </ContainerSolo>
        )}
        {type === 'profile' && LastImageIdx && (
            <ContainerSolo type={type}>
                <ImageSolo>
                    <img
                    src={URL.createObjectURL(LastImageIdx)}
                    alt={`나의 프로필`}
                    ></img>
                </ImageSolo>
            </ContainerSolo>
        )}
        </>
    )
}