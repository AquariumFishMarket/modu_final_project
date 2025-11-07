import ProfileImg from "../../components/common/ProfileImg"
import styled from "styled-components"


const ContentsWrapper = styled.section`
    position: relative;
    display: flex;
    gap: 12px;
    align-items: center;
`
const ImageContainer = styled.div`
    position: relative;
`
const Alert = styled.span`
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: var(--color-primary-600);
    border-radius: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
`

const TextContainer = styled.div`
    width: calc(100% - 55px);
    p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /* 표시할 최대 줄 수 */
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const UserName = styled.p`
    font-size: var(-font-size-md);
    font-weight: 700;
    margin-bottom: 7px;
`
const ChatMessage = styled.p`
    width: 88%;
    font-size: var(--font-size-sm);
    color: var(--color-gray-dark);
`
const Date = styled.p`
    position: absolute;
    bottom: 4px;
    right: 0;
    font-size:var(--font-size-xs);
    color: var(--color-gray-medium)
`

export default function ChatContent(){
    return(
        <ContentsWrapper>
            <ImageContainer>
                <ProfileImg thumbimg={false}
                    width={42}
                    imgSrc=""
                />
                <Alert />
            </ImageContainer>
            <TextContainer>
                <UserName>잉어킹</UserName>
                <ChatMessage>채팅내용채팅내용채팅내용채팅내용채팅내용채팅내용채팅내용채팅내용채팅내용채팅내용채팅내용채팅내용</ChatMessage>
            </TextContainer>
            <Date>2025.08.12</Date>
        </ContentsWrapper>
    )
}