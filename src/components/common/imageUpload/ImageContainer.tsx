import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import styled,{ css } from "styled-components";

import useEmblaCarousel from "embla-carousel-react";

interface ContainerType {
  setDeleteIdx: Dispatch<SetStateAction<number | undefined>>;
  imgArr: File[];
}


const PostWriteCont = styled.div`
  width: calc(100% - 90px);
  overflow: hidden;
`;
const PostWrapper = styled.div`
  display: flex;
  gap: 8px;
`
const PostSlide = styled.div`
      position: relative;
      width: 80px;
      border-radius: 10px;
      overflow: hidden;
      flex: 0 0 auto;
      aspect-ratio: 1;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
`

const ProfileWriteCont = styled.div`
  width: 100%;
  height: 100%;
`;
const ProfileSlide = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductWriteCont = styled.div`
  height: 100%;
  overflow: hidden;
`
const ProductWrapper = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
`
const ProductSlide = styled.div<{$length:number}>`
  ${({$length})=> ($length > 1) && css`
    flex: 0 0 80%;
  `}
  ${({$length})=> ($length == 1) && css`
    flex: 0 0 100%;
  `}
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
const ChatWriteCont = styled.section`

`
const ChatWrapper = styled.div`

`
const ChatSlide = styled.div<{$index:number, $keynum:number}>`
  position: relative;
  display: flex;
  gap: 8px;
  width: 100%;
  margin-bottom: ${({ $index, $keynum }) =>
    $keynum === $index ? '0' : '10px'};
`
const ChatImgContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
const ChatFileInfo = styled.div`
  font-size: var(--font-size-md);
`

export default function ImageContainer({
  imgArr,
  setDeleteIdx
}: ContainerType) {

  const [emblaRef, emblaApi] = useEmblaCarousel({ watchDrag: false });
  const [canDrag, setCanDrag] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const checkDraggable = () => {
      const container = emblaApi.containerNode();
      const viewport = emblaApi.rootNode();

      // 실제 너비 비교
      const containerWidth = container.scrollWidth;
      const viewportWidth = viewport.clientWidth;

      setCanDrag(containerWidth > viewportWidth);
    };

    checkDraggable();
    window.addEventListener("resize", checkDraggable);
    return () => window.removeEventListener("resize", checkDraggable);
  }, [emblaApi, imgArr]);

  // emblaApi가 갱신될 때마다 watchDrag 토글
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ watchDrag: canDrag });
  }, [canDrag, emblaApi]);

  /*
    현재 pathname을 기준으로 UI 분리했습니다.
    추후 사용 할 pathname이 늘어날 경우 조건문 추가해주세요
  */
  const {pathname} = useLocation();
  let isLocation:string = 'default';
  if(pathname.includes('post')) { isLocation = 'post' }
  else if(pathname.includes('profile')) { isLocation = 'profile' }
  else if(pathname.includes('product')) { isLocation = 'product' }
  else if(pathname.includes('chat-room')) { isLocation = 'chatroom' }

  if(isLocation == 'product') {
    return (
      <ProductWriteCont ref={emblaRef}>
        <ProductWrapper>
          {imgArr.map((imgele, i) => (
            <ProductSlide key={i} $length={imgArr.length}>
              <img src={URL.createObjectURL(imgele)} alt={`preview-${i}`}></img>
              <DeleteButton data-index={i} setDeleteIdx={setDeleteIdx} />
            </ProductSlide>
          ))}
        </ProductWrapper>
      </ProductWriteCont>
    )
  }

  if (isLocation === 'post') {
    return (
      <PostWriteCont ref={emblaRef}>
        <PostWrapper>
        {imgArr.map((imgele, i) => (
          <PostSlide key={i}>
            <img src={URL.createObjectURL(imgele)} alt={`preview-${i}`}></img>
            <DeleteButton data-index={i} setDeleteIdx={setDeleteIdx} />
          </PostSlide>
        ))}
        </PostWrapper>
      </PostWriteCont>
    );
  }
  if (isLocation === 'profile') {
    const LastImageIdx = imgArr[imgArr.length - 1];
    return (
      <>
        {LastImageIdx && (
          <ProfileWriteCont>
            <ProfileSlide>
              <img
                src={URL.createObjectURL(LastImageIdx)}
                alt={'나의 프로필'}
              ></img>
            </ProfileSlide>
          </ProfileWriteCont>
        )}
      </>
    );
  }
  if (isLocation == 'chatroom') {
    return (
      <ChatWriteCont>
        <ChatWrapper>
          {imgArr.map((imgele, i) => (
            <ChatSlide key={i} $keynum={i+1} $index={imgArr.length}>
              <ChatImgContainer>
                <img src={URL.createObjectURL(imgele)} alt={`preview-${i}`}></img>
              </ChatImgContainer>
              <ChatFileInfo>
                <p>{imgele.name}</p>
                <p style={{ marginTop: '5px' }}>{Math.round(imgele.size / 1024)} KB</p>
              </ChatFileInfo>
              <DeleteButton data-index={i} setDeleteIdx={setDeleteIdx} />
            </ChatSlide>
          ))}

        </ChatWrapper>
      </ChatWriteCont>
    )
  }
}
