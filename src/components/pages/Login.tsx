import styled from "styled-components";
import { Link } from "react-router-dom";
import SocialButton from "../common/SocialButton";

const LoginContainer = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: var(--color-primary-600);
`;

const LogoArea = styled.div`
  margin-bottom: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.img`
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
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 클릭!");
  };

  const handleGoogleLogin = () => {
    console.log("구글 로그인 클릭!");
  };

  const handleFacebookLogin = () => {
    console.log("페이스북 로그인 클릭!");
  };

  return (
    <LoginContainer>
      <LogoArea>
        {" "}
        <LogoImage src="/src/assets/icons/fish-logo.svg" alt="생선마켓 로고" />
      </LogoArea>

      <LoginSection>
        {/* 카카오 로그인 버튼 */}
        <SocialButton
          width={322}
          text="카카오 계정으로 로그인"
          onClick={handleKakaoLogin}
          borderColor="#F2C94C"
          icon="/src/assets/icons/kakao-logo.svg"
        />

        {/* 구글 로그인 버튼 */}
        <SocialButton
          width={322}
          text="구글 계정으로 로그인"
          onClick={handleGoogleLogin}
          borderColor="var(--color-gray-dark)"
          icon="/src/assets/icons/google-logo.svg"
        />

        {/* 페이스북 로그인 버튼 */}
        <SocialButton
          width={322}
          text="페이스북 계정으로 로그인"
          onClick={handleFacebookLogin}
          borderColor="#2D9CDB"
          icon="/src/assets/icons/facebook-logo.svg"
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
