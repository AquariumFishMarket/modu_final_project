import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import SocialButton from "./components/SocialButton";

const LoginContainer = styled(motion.section)`
  position: absolute; /* 전체화면을 위해 */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  height: 100vh;
  background-color: var(--color-primary-600);
`;

const LogoArea = styled.div`
  margin-bottom: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled(motion.img)`
  width: 300px;
  height: 300px;
  object-fit: contain;
`;

const LoginSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 50px 0;
  border-radius: 20px 20px 0 0;
  background-color: #fff;
  z-index: 100;
`;

const EmailLoginSignup = styled.div`
  text-align: center;
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  margin: 10px 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const StyledLink = styled(Link)`
  color: var(--color-gray-dark);
  text-decoration: none;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
    color: var(--color-primary-600);
  }
`;

const Separator = styled.span`
  color: var(--color-gray-dark);
  font-size: 12px;
`;

function Login() {
  const KakaoRef = useRef<HTMLButtonElement>(null)
  const GoogleRef = useRef<HTMLButtonElement>(null)
  const FaceBookRef = useRef<HTMLButtonElement>(null)
  const [kakaoLoad,setKakaoLoad] = useState(false)
  const [GoogleLoad,setGoogleLoad] = useState(false)
  const [FaceBookLoad,setFaceBookLoad] = useState(false)

  useEffect(()=>{
    const kakaoimg = new Image();
    const googleimg = new Image();
    const facebookimg = new Image();
    kakaoimg.src = '/icons/kakao-logo.svg'
    googleimg.src = '/icons/google-logo.svg'
    facebookimg.src = '/icons/facebook-logo.svg'

    const ImageLoad = (
      iconRef:React.RefObject<HTMLButtonElement | null>,
      set:React.Dispatch<React.SetStateAction<boolean>>,
      url:string) => {
      if(!iconRef.current) return;
      iconRef.current.style.backgroundImage = `url(${url})`
      set(true)
    }

    kakaoimg.onload = () => {
      ImageLoad(KakaoRef,setKakaoLoad,'/icons/kakao-logo.svg')
    }
    googleimg.onload = () => {
      ImageLoad(GoogleRef,setGoogleLoad,'/icons/google-logo.svg')
    }
    facebookimg.onload = () => {
      ImageLoad(FaceBookRef,setFaceBookLoad,'/icons/facebook-logo.svg')
    }

  },[])

  const handleKakaoLogin = () => {
    console.log("카카오 로그인 클릭!");
  };

  const handleGoogleLogin = () => {
    console.log("구글 로그인 클릭!");
  };

  const handleFacebookLogin = () => {
    console.log("페이스북 로그인 클릭!");
  };

  const logoVariants:Variants = {
    initial: {  opacity: 0},
    animate: {
      opacity: 1,
      transition: { duration: 1.2, delay: 0.3, ease: "easeInOut" },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  return (
      <LoginContainer>
        <LogoArea>
          <LogoImage
          src="/icons/fish-logo.svg" alt="물고기마켓 로고"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={logoVariants}
          />
        </LogoArea>

        <LoginSection>
          {/* 카카오 로그인 버튼 */}
          <SocialButton
            width={322}
            text="카카오 계정으로 로그인"
            onClick={handleKakaoLogin}
            borderColor="#F2C94C"
            icon="/icons/kakao-logo-low.png"
            ref={KakaoRef}
            loading={kakaoLoad}
            skeleton="#F2C94C"
          />

          {/* 구글 로그인 버튼 */}
          <SocialButton
            width={322}
            text="구글 계정으로 로그인"
            onClick={handleGoogleLogin}
            borderColor="var(--color-gray-dark)"
            icon="/icons/google-logo-low.png"
            ref={GoogleRef}
            loading={GoogleLoad}
            skeleton="linear-gradient(45deg, #ea4335, #fbbc05, #34a853, #4285f4)"
          />

          {/* 페이스북 로그인 버튼 */}
          <SocialButton
            width={322}
            text="페이스북 계정으로 로그인"
            onClick={handleFacebookLogin}
            borderColor="#2D9CDB"
            icon="/icons/facebook-logo-low.png"
            ref={FaceBookRef}
            loading={FaceBookLoad}
            skeleton="#9fd8f8"
          />
          <EmailLoginSignup>
            <StyledLink to="/login/email">이메일로 로그인</StyledLink>
            <Separator>|</Separator>
            <StyledLink to="/signup">회원가입</StyledLink>
          </EmailLoginSignup>
        </LoginSection>
      </LoginContainer>
  );
}

export default Login;
