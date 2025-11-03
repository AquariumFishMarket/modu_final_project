import { Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import styled,{ css } from "styled-components";

import useEmblaCarousel from "embla-carousel-react";

interface ContainerType {
  setDeleteIdx: Dispatch<SetStateAction<number | undefined>>;
  imgArr: File[];
}


const PostWriteCont = styled.ul`
    display: flex;
    width: calc(100% - 90px);
    overflow-x: auto;

    li {
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
    }
`;

const SingleCont = styled.div`
  width: 100%;
  height: 100%;
`;
const Image = styled.div`
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

export default function ImageContainer({
  imgArr,
  setDeleteIdx,
}: ContainerType) {

  const [emblaRef] = useEmblaCarousel();

  /*
    현재 pathname을 기준으로 UI 분리했습니다.
    추후 사용 할 pathname이 늘어날 경우 조건문 추가해주세요
  */
  const {pathname} = useLocation();
  let isLocation:string = 'default';
  if(pathname.includes('post')) { isLocation = 'post' }
  else if(pathname.includes('profile')) { isLocation = 'profile' }
  else if(pathname.includes('product')) { isLocation = 'product' }

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
      <PostWriteCont>
        {imgArr.map((imgele, i) => (
          <li key={i}>
            <img src={URL.createObjectURL(imgele)} alt={`preview-${i}`}></img>
            <DeleteButton data-index={i} setDeleteIdx={setDeleteIdx} />
          </li>
        ))}
      </PostWriteCont>
    );
  }
  if (isLocation === 'profile') {
    const LastImageIdx = imgArr[imgArr.length - 1];
    return (
      <>
        {LastImageIdx && (
          <SingleCont>
            <Image>
              <img
                src={URL.createObjectURL(LastImageIdx)}
                alt={''}
              ></img>
            </Image>
          </SingleCont>
        )}
      </>
    );
  }
}
