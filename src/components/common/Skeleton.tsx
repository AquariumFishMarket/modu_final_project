import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(150%);
  }
`;

export const Skeleton = styled.div`
    width: 100%;
    height: 100%;
  position: relative;
  overflow: hidden;
  background: #eeeeee;
  border-radius: 8px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.7) 50%,
      rgba(255,255,255,0) 100%
    );
    filter: blur(20px);
    transform: translateX(-150%);
    animation: ${shimmer} 1.5s ease-out infinite;
  }
`;
