import { useEffect, useRef, useState } from "react"
import ProfileImg from "../../components/common/ProfileImg"
import ImageUpButton from "../../components/common/imageUpload/UploadButton"
import ImageContainer from "../../components/common/imageUpload/ImageContainer"
import styled from "styled-components"
import { motion } from "motion/react"

const PostContainer = styled.div`
    height: 100%;
    margin: 0 auto;
`
const ImageUploadContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`
const Contents = styled.div`
    height: calc(100% - 100px);
    display:flex;
    gap: 13px;
`
const WriteZone = styled.div`
    max-width: 100%;
    width: calc(100% - 55px);
    height: 100%;
`
const TextArea = styled.textarea`
    padding: 12px 12px 30px;
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
const ImageUpButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    border: 1px solid var(--color-gray-medium);
    > p {
        font-size: var(--font-size-sm)
    }
`

export default function PostWrite() {
    const [imgArr,setImgArr] = useState<File[]>([]); //file 배열이 필요할 경우 넣어주세요
    const [deleteIndex,setDeleteIdx] = useState<number | undefined>();
    const [textHeight,setTextHeight] = useState('');
    const [textPlaceholder,setTextPlaceholder] = useState('게시글 입력하기..');

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        target.style.height = 'auto';
        target.style.height = target.scrollHeight + 'px';

        setTextHeight(target.value)
    }

    const handleSubmit = () => {
        //게시글 전송 메서드
    }

    useEffect(()=>{
        if(imgArr.length > 0 && textAreaRef.current?.value !=='') {
            setTextPlaceholder('')
        }
    },[imgArr])

    useEffect(()=>{
        setImgArr(prev => prev.filter((_, i) => i !== deleteIndex));
        //초기화
        setDeleteIdx(undefined);
    },[deleteIndex])

    return (
        <div style={{ height: '100%', overflow: 'hidden' }}>
            <motion.div initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1}}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ height: '100%' }}
            >
                <PostContainer>
                    <ImageUploadContainer>
                        <ImageUpButtonContainer>
                            <ImageUpButton
                            multiple={true}
                            colortype="color"
                            size="small"
                            imgArr={imgArr}
                            setImgArr={setImgArr}
                            />
                            <p>{imgArr.length}/10</p>
                        </ImageUpButtonContainer>
                        <ImageContainer multiple={true} imgArr={imgArr} setDeleteIdx={setDeleteIdx} />
                    </ImageUploadContainer>
                    <Contents>
                        <ProfileImg width={42} thumbimg={false}></ProfileImg>
                        <WriteZone>
                            <TextArea
                            ref={textAreaRef}
                            placeholder={textPlaceholder}
                            value={textHeight}
                            onChange={handleTextChange}
                            />
                        </WriteZone>
                    </Contents>

                </PostContainer>
            </motion.div>
        </div>
    )
}