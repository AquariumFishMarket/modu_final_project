import { useNavigate } from "react-router-dom";
import CreateForm from "../../components/common/form/CreateForm";
import { FormSubmissionData } from "../../components/common/form/types";
import { useHeader } from "../../contexts/HeaderContext";
import { useEffect, useRef, useState } from "react";
import { getProductFields } from "../../utils/validation/productValidation";

export default function ProductAdd() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const formRef = useRef<{ submitForm: () => void }>(null);
  const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성 상태

  const productFields = getProductFields();

  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "productAdd",
      title: "상품 등록",
      inputState: isFormValid,
      onBackClick: () => navigate("/profile"),
      onButtonClick: () => {
        // 실제 폼 제출 로직
        if (formRef.current) {
          formRef.current.submitForm();
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormValid]);

  // 폼 유효성 변경 핸들러
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // 폼 제출 핸들러 정의
  const handleSubmit = (data: FormSubmissionData) => {
    console.log("상품 등록 완료:", data);
    console.log("상품명:", data.formValues.productname);
    console.log("가격:", data.formValues.price);
    console.log("설명:", data.formValues.description);
    console.log("링크:", data.formValues.link);
    console.log("이미지 파일들:", data.imageFiles);

    // 🆕 등록 완료 후 상품 상세 페이지나 홈으로 이동
    // navigate(`/product/${newProductId}`);
    navigate("/");
  };
  return (
    <CreateForm
      ref={formRef}
      formType="product"
      fields={productFields}
      onSubmit={handleSubmit}
      onValidationChange={handleValidationChange}
    />
  );
}
