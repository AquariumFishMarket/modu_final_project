import ProfileImg from "./common/ProfileImg"
import ImageUpButton from "./common/UploadButton"
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
const WriteZone = styled.div`
    height: 100%;
    display:flex;
    gap: 13px;
`
const TextArea = styled.textarea`
    padding: 12px 12px 0;
    max-width: 100%;
    width: calc(100% - 55px);
    height: calc(100% - 100px);
    font-size: var(--font-size-md);
    color: black;
    border: none;
    resize: none;
    &:placeholder {
        color: rgba(196, 196, 196, 1);
    }
    &:focus {
        outline: none;
    }
`

const ImageUpButtonContainer = styled.div`
    position: fixed;
    bottom: 16px;
    right:0;
`

export default function PostWrite() {
    return (
        <>
        <PostContainer>
            <WriteZone>
                <ProfileImg width={42} thumbimg={false}></ProfileImg>
                <TextArea placeholder="게시글 입력하기"></TextArea>
            </WriteZone>
            <ImageUpButtonContainer>
                <ImageUpButton colortype="color" size="large" />
            </ImageUpButtonContainer>
        </PostContainer>
        </>
    )
}