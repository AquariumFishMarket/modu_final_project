import ProfileImg from "../../components/common/ProfileImg";

import styled from "styled-components";



interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    content: string;
    type: 'text' | 'image' | 'system';
    timestamp: number;
}

const ChatContainer = styled.section`
    max-height: 100%;
    border: 1px solid;
    overflow-y: auto;
`
const DefaultChat = styled.div`
    display: flex;
    margin-bottom: 9px;
`
const DefaultChatMessage = styled.div`
    max-width: calc(100% - 90px);
    width: fit-content;
    margin: 0 6px 0 12px;
    padding: 12px;
    border-radius: 10px;
    border-top-left-radius: 0;
`

const YourChat = styled(DefaultChat)``

const YourChatMessage = styled(DefaultChatMessage)`
    background: #fff;
    border: 1px solid var(--color-gray-semi-dark);
    > p {
        font-size: var(--font-size-md);
        line-height: 1.4
    }
`
const YourTime = styled.p`
    font-size: 1rem;
    align-self: end;
    color: var(--color-gray-dark);
`

const MyChat = styled(DefaultChat)`
    justify-content: end;
`
const MyChatMessage = styled(DefaultChatMessage)`
    background: var(--color-primary-600);
    border-top-left-radius: 10px;
    border-top-right-radius: 0;
    > p {
        color: #fff;
    }
`
const MyTime = styled.p`
    font-size: 1rem;
    align-self: end;
    color: var(--color-gray-dark);
`

export default function ChatRoom() {

    return (
        <ChatContainer>
            <YourChat>
                <ProfileImg
                    thumbimg={false}
                    width={42}
                />
                <YourChatMessage>
                    <p>
                        어쩌구저쩌구...어쩌구저쩌구..
                        어쩌구저쩌구...어쩌구저쩌구..
                        어쩌구저쩌구...어쩌구저쩌구..
                        어쩌구저쩌구...어쩌구저쩌구..
                        어쩌구저쩌구...어쩌구저쩌구..
                    </p>
                </YourChatMessage>
                <YourTime>12:23</YourTime>
            </YourChat>
            <YourChat>
                <ProfileImg
                    thumbimg={false}
                    width={42}
                />
                <YourChatMessage>
                    <p>
                        잉어킹 갸라도스
                    </p>
                </YourChatMessage>
                <YourTime>12:23</YourTime>
            </YourChat>
            <MyChat>
                <MyTime>12:40</MyTime>
                <MyChatMessage>
                    <p>말씀하시라고요</p>
                </MyChatMessage>
            </MyChat>
        </ChatContainer>
    )
}