import styled from "styled-components";

export const LayoutContainer = styled.div<{ $isProfile?: boolean }>`
  position: relative;
  max-width: 600px;
  width: 100%;
  height: 100vh;
  min-height: ${(props) => (props.$isProfile ? "100vh" : "auto")};
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #eeeeee;
`;

export const MainContent = styled.main<{
  $hasFooter: boolean;
  $isProfile?: boolean;
  $isChatRoom?: boolean;
  $isPostDetail?: boolean;
}>`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 100%;
  /* padding: ${(props) =>
    props.$isPostDetail ? "68px 25px 0" : "68px 15px 0"}; */
  padding: 68px 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
 / * padding-bottom: ${(props) => {
   if (props.$isProfile) return "0";
   return props.$hasFooter ? "110px" : "50px";
 }}; * /
  padding-bottom: 110px;
  background-color: ${(props) =>
    props.$isChatRoom ? "var(--color-gray-light)" : "#fff"};
`;

export const RefreshAlert = styled.div<{$letter: boolean, $height: number}>`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background: var(--color-primary-100);
  position: absolute;
  top: 48px;
  width: 100%;
  height: ${(props)=>props.$height}px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 120;
  text-align: center;
  padding: 25px 0;
  margin-bottom: 10px;
  animation : ${(props)=>props.$height > 0 && 'opacityStype 1s ease-in-out'};
  font-size: 1.8rem;
  font-weight: 600;
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${(props) => (props.$height > 30 ? '8px' : '3px')};
    transition: gap 0.5s ease;
  }
  span {
    display: inline-block;
    position: relative;
    max-width: ${(props) => (props.$height > 30 ? '80px' : '0px')};
    top: ${(props) => (props.$height > 30 ? '0' : '-20px')};
    opacity: ${(props) => (props.$height > 30 ? '1' : '0')};
    transform: ${(props) =>
      props.$height > 30 ? 'translateY(0)' : 'translateY(-15px)'};
    transition:
      transform 0.6s ease,
      opacity 0.6s ease,
      top 0.6s ease;
    overflow: hidden;
    color: var(--color-primary-500);
    will-change: transform, opacity, top;
  }


  @keyframes opacityStype {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`
export const Fish1 = styled.img<{$transform: number}>`
    position: absolute;
    top: -35px;
    left: -50px;
    transform: scale3d(0.5, 0.5, 0.5);
    opacity: 0;
    animation : ${(props)=>props.$transform > 60 && 'animations 0.7s forwards'};
    @keyframes animations {
      0% {
        top: -35px;
        left: -50px;
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
      }
      100% {
        top: -50px;
        left: -76px;
        opacity: 1;
        transform: scale3d(0.5, 0.5, 0.5);
      }
    }
`
export const Fish2 = styled.img<{$transform: number}>`
    position: absolute;
    bottom: -35px;
    right: -50px;
    transform: scale3d(0.5, 0.5, 0.5) scaleX(-1);
    opacity: 0;
    animation : ${(props)=>props.$transform > 60 && 'animations2 0.7s forwards'};
    @keyframes animations2 {
      0% {
        bottom: -35px;
        right: -50px;
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3) scaleX(-1);
      }
      100% {
        bottom: -50px;
        right: -76px;
        opacity: 1;
        transform: scale3d(0.5, 0.5, 0.5) scaleX(-1);
      }
    }
`
export const Seashall = styled.img<{$transform: number}>`
    position: absolute;
    bottom: -25px;
    right: 0;
    transform: scale3d(0.7, 0.7, 0.7);
    opacity: 0;
    animation : ${(props)=>props.$transform > 60 && 'animations3 0.7s forwards'};
    @keyframes animations3 {
      0% {
        bottom: -25px;
        right: 0;
        opacity: 0;
        transform: scale3d(0.7, 0.7, 0.7);
      }
      100% {
        bottom: -40px;
        right: -10px;
        opacity: 1;
        transform: scale3d(1,1,1);
      }
    }
`
export const Coral = styled.img<{$transform: number}>`
    position: absolute;
    top: -10px;
    left: -60px;
    transform: scale3d(0.7, 0.7, 0.7);
    opacity: 0;
    animation : ${(props)=>props.$transform > 60 && 'animations4 0.7s forwards'};
    @keyframes animations4 {
      0% {
        top: -10px;
        left: -60px;
        opacity: 0;
        transform: scale3d(0.5, 0.5, 0.5);
      }
      100% {
        top: -10px;
        left: -100px;
        opacity: 1;
        transform: scale3d(1,1,1);
      }
    }
`
export const Drop = styled.img<{$transform: number}>`
    position: absolute;
    top: -35px;
    right: -30px;
    transform: scale3d(0.4, 0.4, 0.4);
    opacity: 0;
    animation : ${(props)=>props.$transform > 60 && 'animations5 0.7s forwards'};
    @keyframes animations5 {
      0% {
        top: -35px;
        right: -30px;
        opacity: 0;
      }
      100% {
        top: -35px;
        right: -45px;
        opacity: 1;
      }
    }
`
export const Drop2 = styled.img<{$transform: number}>`
    position: absolute;
    bottom: -40px;
    left: -60px;
    transform: scale3d(0.6, 0.6, 0.6);
    opacity: 0;
    animation : ${(props)=>props.$transform > 60 && 'animations6 0.7s forwards'};
    @keyframes animations6 {
      0% {
        bottom: -40px;
        left: -60px;
        opacity: 0;
      }
      100% {
        bottom: -40px;
        left: -60px;
        opacity: 1;
      }
    }
`
