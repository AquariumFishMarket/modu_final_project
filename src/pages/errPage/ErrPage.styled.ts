import styled, { keyframes } from "styled-components";

// 좌우 유영 + 상하 파도
const swimAndFloat = keyframes`
  0% {
    transform: translateX(-120px) translateY(0px) scaleX(-1);
  }
  5% {
    transform: translateX(-100px) translateY(-3px) scaleX(-1);
  }
  10% {
    transform: translateX(-80px) translateY(-6px) scaleX(-1);
  }
  15% {
    transform: translateX(-60px) translateY(-8px) scaleX(-1);
  }
  20% {
    transform: translateX(-40px) translateY(-6px) scaleX(-1);
  }
  25% {
    transform: translateX(-20px) translateY(-3px) scaleX(-1);
  }
  30% {
    transform: translateX(0px) translateY(0px) scaleX(-1);
  }
  35% {
    transform: translateX(20px) translateY(3px) scaleX(-1);
  }
  40% {
    transform: translateX(40px) translateY(6px) scaleX(-1);
  }
  45% {
    transform: translateX(60px) translateY(8px) scaleX(-1);
  }
  47% {
    transform: translateX(80px) translateY(6px) scaleX(-1);
  }
  48% {
    transform: translateX(100px) translateY(3px) scaleX(-1);
  }
  49% {
    transform: translateX(120px) translateY(0px) scaleX(-1);
  }
  50% {
    transform: translateX(120px) translateY(0px) scaleX(1);
  }
  51% {
    transform: translateX(120px) translateY(0px) scaleX(1);
  }
  52% {
    transform: translateX(100px) translateY(-3px) scaleX(1);
  }
  53% {
    transform: translateX(80px) translateY(-6px) scaleX(1);
  }
  55% {
    transform: translateX(60px) translateY(-8px) scaleX(1);
  }
  60% {
    transform: translateX(40px) translateY(-6px) scaleX(1);
  }
  65% {
    transform: translateX(20px) translateY(-3px) scaleX(1);
  }
  70% {
    transform: translateX(0px) translateY(0px) scaleX(1);
  }
  75% {
    transform: translateX(-20px) translateY(3px) scaleX(1);
  }
  80% {
    transform: translateX(-40px) translateY(6px) scaleX(1);
  }
  85% {
    transform: translateX(-60px) translateY(8px) scaleX(1);
  }
  90% {
    transform: translateX(-80px) translateY(6px) scaleX(1);
  }
  95% {
    transform: translateX(-100px) translateY(3px) scaleX(1);
  }
  97% {
    transform: translateX(-110px) translateY(0px) scaleX(1);
  }
  98% {
    transform: translateX(-120px) translateY(0px) scaleX(1);
  }
  99% {
    transform: translateX(-120px) translateY(0px) scaleX(-1);
  }
  100% {
    transform: translateX(-120px) translateY(0px) scaleX(-1);
  }
`;

export const ErrPageSection = styled.section`
  margin-top: 13.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  //overflow: hidden;
  position: relative;
`;

export const ErrorImage = styled.img`
  max-width: 100%;
  height: auto;
  animation: ${swimAndFloat} 12s linear infinite;
  transform-origin: center;
  will-change: transform;
`;

export const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

export const ErrorMessage = styled.p`
  font-size: 1.6rem;
  text-align: center;
`;
