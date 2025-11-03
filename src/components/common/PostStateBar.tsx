import { Dispatch, SetStateAction, useRef, useState } from "react"
import styled from "styled-components"

interface postStateBar {
    postState: string;
    setPostState: Dispatch<SetStateAction<'list'|'gallery'>>;
}

const BarContainer = styled.div`
    width: calc(100% + 30px);
    margin-left: -16px;
    padding: 9px 16px;
    border-bottom: 1px solid var(--color-gray-medium);
    display: flex;
    justify-content: end;
    background: #fff;
`
const ButtonWrap = styled.div`
    display: flex;
    gap: 16px;
`
const CommonBtnStyle = styled.button`
    width: 26px;
    height: 26px;
    background-color: transparent;
`
const ListContainer = styled(CommonBtnStyle)<{$postState:string}>`
    background-image: ${(props)=>props.$postState === 'list' ?
        'url(/img/icon-list-on.svg)' : 'url(/img/icon-list-off.svg)'};
`
const GalleryContainer = styled(CommonBtnStyle)<{$postState:string}>`
    background-image: ${(props)=>props.$postState === 'gallery' ?
        'url(/img/icon-gallery-on.svg)' : 'url(/img/icon-gallery-off.svg)'};
`

export default function PostStateBar({postState,setPostState}:postStateBar) {
    const ListRef = useRef<HTMLButtonElement | null>(null)
    const GalleryRef = useRef<HTMLButtonElement | null>(null)

    const handlePostState = (e:React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        if(target.closest('.list-container')){
            setPostState('list')
        } else if(target.closest('.gallery-container')) {
            setPostState('gallery')
        }
    }

    return (
        <BarContainer>
            <ButtonWrap onClick={handlePostState}>
                <ListContainer
                className="list-container"
                $postState={postState}
                ref={ListRef}
                />
                <GalleryContainer
                className="gallery-container"
                $postState={postState}
                ref={GalleryRef}
                />
            </ButtonWrap>
        </BarContainer>
    )
}