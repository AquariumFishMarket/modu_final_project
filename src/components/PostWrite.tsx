import { useEffect, useRef, useState } from "react"
import ProfileImg from "./common/ProfileImg"
import ImageUpButton from "./common/imageUpload/UploadButton"
import styled from "styled-components"

const PostContainer = styled.div`
    padding-top: 20px;
    margin: 0 auto;
    padding-left:16px;
    padding-right:16px;
    max-width:600px;
    border:1px solid;
    height:100vh;
`
const Contents = styled.div`
    height: 100%;
    display:flex;
    gap: 13px;
`
const WriteZone = styled.div`
    max-width: 100%;
    width: calc(100% - 55px);
    height: calc(100% - 100px);
`
const TextArea = styled.textarea`
    padding: 12px 12px 0;
    width: 100%;
    min-height: 1px;
    max-height: 100%;
    border: unset;
    resize:none;
    font-size: var(--font-size-md);
    color: black;
    &:placeholder {
        color: rgba(196, 196, 196, 1);
    }
    &:focus {
        outline: none;
    }
`
const ImageContainer = styled.ul`
    margin-top: 13px;
`
const ImageList = styled.li`
    border-radius: 10px;
    overflow: hidden;
`

const ImageUpButtonContainer = styled.div`
    position: fixed;
    bottom: 16px;
    right:0;
`

export default function PostWrite() {
    const [imgArr,setImgArr] = useState<File[]>([]); //file 배열이 필요할 경우 넣어주세요
    const [textHeight,setTextHeight] = useState('');
    const [textPlaceholder,setTextPlaceholder] = useState('게시글 입력하기..');

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        target.style.height = 'auto';
        target.style.height = target.scrollHeight + 'px';

        setTextHeight(target.value)
    }

    useEffect(()=>{
        if(imgArr.length > 0) {
            setTextPlaceholder('')
        }
    },[imgArr])

    return (
        <>
        <PostContainer>
            <Contents>
                <ProfileImg width={42} thumbimg={false}></ProfileImg>
                <WriteZone>
                    <TextArea
                    ref={textAreaRef}
                    placeholder={textPlaceholder}
                    value={textHeight}
                    onChange={handleTextChange}
                    />
                <ImageContainer>
                    {imgArr.map((imgele,i)=>(
                        <ImageList key={i}>
                            <img
                            src={URL.createObjectURL(imgele)}
                            alt={`preview-${i}`}
                            style={{ width: '100%', height: 'auto', objectFit:'cover'}}
                            ></img>
                        </ImageList>
                    ))}
                </ImageContainer>
                </WriteZone>
            </Contents>
            <ImageUpButtonContainer>
                <ImageUpButton
                colortype="color"
                size="large"
                setImgArr={setImgArr}
                />
            </ImageUpButtonContainer>
        </PostContainer>
        </>
    )
}