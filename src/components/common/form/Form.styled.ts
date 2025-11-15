import styled from "styled-components";

export const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 18px;

  > button:last-child {
    margin-top: 20px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: var(--font-size-md);
    font-weight: 500;
    vertical-align: bottom;
    margin-bottom: 10px;
    color: var(--color-gray-dark);
  }

  input {
    border-bottom: 1px solid var(--color-gray-medium);
    outline: none;
    background: transparent;

    &:focus {
      border-bottom-color: var(--color-primary-600);
    }

    &.error {
      border-bottom-color: var(--color-error);
    }

    &::placeholder {
      color: var(--color-gray-medium);
    }
  }

  textarea {
    min-height: 200px;
    padding: 10px;
    line-height: 1.5;
    border: 1px solid var(--color-gray-medium);
    outline: none;
    border-radius: 10px;
    background: transparent;
    resize: none;

    &:focus {
      border-color: var(--color-primary-600);
    }

    &.error {
      border-color: var(--color-error);
    }

    &::placeholder {
      color: var(--color-gray-medium);
    }
  }
`;

export const ErrorMessage = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: 6px;
  display: block;
`;

export const FormImgContainer = styled.div<{
  $formType: "profile" | "product";
  $hasSelectedImage: boolean;
}>`
  margin: 0 auto;
  position: relative;
  margin-bottom: 30px;
  width: ${(props) => (props.$formType === "profile" ? "150px" : "100%")};
  height: ${(props) => (props.$formType === "profile" ? "150px" : "auto")};

  ${(props) =>
    props.$formType === "product" &&
    `
    aspect-ratio: 322 / 204;
    min-height: 204px;
    border-radius: 10px;
  `}
  ${(props) =>
    !props.$hasSelectedImage &&
    props.$formType === "product" &&
    `
    border: 1px solid var(--color-gray-medium);
    `}
`;

// 프로필 이미지 컨테이너
export const ProfileImageWrapper = styled.div<{ $hasImage: boolean }>`
  position: relative;
  display: inline-block;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.$hasImage &&
    `
        &: hover {
            opacity: 0.8;
            transform: scale(0.98);
        }
    `}
`;

// 프로필 이미지 오버레이 (호버 시 표시)
export const ProfileImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 10;
`;

// 수정용 폼에서만 사용하는 스타일
// export const EditImagesContainer = styled.div`
//   display: flex;
//   gap: 10px;
//   height: 100%;
//   width: 100%;
//   overflow-x: auto;

//   &::-webkit-scrollbar {
//     height: 4px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background: #c1c1c1;
//     border-radius: 2px;
//   }
// `;

export const ImageSlide = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: calc(100% - 20px);
  height: 100%;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const FormBtnContainer = styled.div<{
  $formType: "profile" | "product";
}>`
  position: absolute;
  bottom: 0;
  right: 0;
  ${(props) =>
    props.$formType === "product" &&
    `
    bottom: 10px;
    right: 10px;
  `}
`;

export const RequiredCheck = styled.span`
  color: red;
`;

export const EmptyImageMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 204px;
  color: #999;
  font-size: var(--font-size-md);
  text-align: center;
`;

export const ImageCountBadge = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: var(--font-size-sm);
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 12px;
`;
