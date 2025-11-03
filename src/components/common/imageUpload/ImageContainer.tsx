import { Dispatch, SetStateAction, useState } from "react";
import DeleteButton from "./DeleteButton";
import styled from "styled-components";

interface DefaultType {
  setDeleteIdx: Dispatch<SetStateAction<number | undefined>>;
  imgArr: File[];
}

interface MultipleContainer extends DefaultType {
  multiple: true;
}

interface SingleContainer extends DefaultType {
  multiple: false;
}

type ContainerType = MultipleContainer | SingleContainer;

//이미지 여러개일 때
const MultipleCont = styled.ul`
  display: flex;
  width: calc(100% - 90px);
  overflow-x: auto;
`;
const ImageListArr = styled.li`
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
`;
const SingleCont = styled.div`
  width: 100%;
  height: 100%;
`;
const Image = styled.div`
  position: relative;
  height: 100%;
  border-radius: 100%; // 이미지 적용 후 동글동글
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default function ImageContainer({
  multiple,
  imgArr,
  setDeleteIdx,
}: ContainerType) {
  if (multiple === true) {
    return (
      <MultipleCont>
        {imgArr.map((imgele, i) => (
          <ImageListArr key={i}>
            <img src={URL.createObjectURL(imgele)} alt={`preview-${i}`}></img>
            <DeleteButton data-index={i} setDeleteIdx={setDeleteIdx} />
          </ImageListArr>
        ))}
      </MultipleCont>
    );
  }
  if (multiple === false) {
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
