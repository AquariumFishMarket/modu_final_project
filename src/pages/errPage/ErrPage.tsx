import { useNavigate } from "react-router-dom";
import DefaultButton from "../../components/common/buttons/Button";
import {
  ErrPageSection,
  ErrorImage,
  ErrorContent,
  ErrorMessage,
} from "./ErrPage.styled";

function ErrPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <ErrPageSection>
      <h2 className="sr-only">404페이지</h2>
      <img src="/img/gif/gif.gif" alt="" />
      <ErrorImage src="/img/fish_logo-404.png" alt="" />
      <ErrorContent>
        <ErrorMessage>페이지를 찾을 수 없습니다 :(</ErrorMessage>
        <DefaultButton
          text={"이전 페이지"}
          width={120}
          onClick={handleGoBack}
        />
      </ErrorContent>
    </ErrPageSection>
  );
}
export default ErrPage;
