import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Variants } from "framer-motion";
import { SplashContainer, LogoWrapper, LogoImage } from "./Splash.styled";
import { useAuth } from "../../contexts/AuthContext";

function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
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
