import styled from "styled-components"

interface Profiletype {
    width: number;
    thumbimg: boolean;
    imgSrc?:string;
}

const ImageArea = styled.div<{$thumbimg:boolean, width: number, imgSrc?: string}>`
    width:${(props)=>`${props.width}px`};
    height:${(props)=>`${props.width}px`};
    border-radius:100%;
    border:1px solid var(--color-gray-medium);
    background-image: ${(props)=>props.$thumbimg === false ? 'url(/images/empty-profile.png)' : `url(${props.imgSrc})`};
    background-size:cover;
`

export default function ProfileImg({thumbimg,width,imgSrc}:Profiletype) {
    return(
        <ImageArea $thumbimg={thumbimg} width={width} imgSrc={imgSrc}></ImageArea>
    )
}