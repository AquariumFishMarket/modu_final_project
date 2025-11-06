import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Variants } from "framer-motion";
import { SplashContainer, LogoWrapper, LogoImage } from "./Splash.styled";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // API 연동 - 로그인 상태 체크
      // const token = localStorage.getItem('token');
      // if (token) {
      //   try {
      //     const response = await fetch('API_ENDPOINT/user/checktoken', {
      //       headers: { Authorization: `Bearer ${token}` }
      //     });
      //     if (response.ok) {
      //       navigate('/feed');
      //       return;
      //     }
      //   } catch (error) {
      //     console.error('Token validation failed:', error);
      //   }
      // }
      // navigate('/login');

      // 임시: true면 로그인됨, false면 로그인 안됨
      const IS_LOGGED_IN = true; // true/false로 변경해서 테스트

      const timer = setTimeout(() => {
        if (IS_LOGGED_IN) {
          navigate("/feed");
        } else {
          navigate("/login");
        }
      }, 2000); // 2초 애니메이션이 자연스럽게 시작되도록

      return () => clearTimeout(timer);
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // 컨테이너 애니메이션: Fade + Scale
  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  // 로고 애니메이션: Zoom-Out + Fade
  const logoVariants: Variants = {
    initial: { scale: 1.3, opacity: 0, y: -10 },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, delay: 0.3, ease: "easeInOut" },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  return (
    <SplashContainer
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <LogoWrapper>
        <h2 className="sr-only">물고기마켓</h2>
        <LogoImage
          src="/img/fish_logo_full.png"
          alt="물고기마켓 로고"
          variants={logoVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      </LogoWrapper>
    </SplashContainer>
  );
}

export default Splash;
