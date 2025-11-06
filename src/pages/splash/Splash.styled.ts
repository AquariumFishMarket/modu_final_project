import styled from "styled-components";
import { motion } from "framer-motion";

export const SplashContainer = styled(motion.section)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  overflow: hidden;
`;

export const LogoWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  padding: 0 20px;
`;

export const LogoImage = styled(motion.img)`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

export const BrandText = styled(motion.h1)`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-top: 20px;
  text-align: center;
  letter-spacing: -0.5px;
`;
