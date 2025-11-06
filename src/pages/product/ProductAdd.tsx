import { useNavigate } from "react-router-dom";
import CommonForm, {
  FormSubmissionData,
  FormFieldConfig,
} from "../../components/common/CommonForm";
import { useHeader } from "../../contexts/HeaderContext";
import { useEffect, useRef, useState } from "react";

/* 유효성 검사 */
// 상품명
const validateProductName = (productName: string): string | null => {
  if (productName.length < 2) {
    return "상품명은 2자 이상 입력해주세요.";
  }

  if (productName.length > 10) {
    return "상품명은 10자 이하로 입력해주세요.";
  }

  return null;
};

// 가격
const validatePrice = (price: string): string | null => {
  // 숫자만 추출 (콤마 제거)
  const numbersOnly = price.replace(/[^\d]/g, "");

  if (!numbersOnly) {
    return "가격을 입력해주세요.";
  }
  const numericPrice = parseInt(numbersOnly);

  if (numericPrice === 0) {
    return "0원보다 높은 가격을 입력해주세요.";
  }

  return null;
};

// 상품 설명
const validateDescription = (description: string): string | null => {
  if (description.length < 10) {
    return "상품 설명은 10자 이상 입력해주세요.";
  }

  if (description.length > 500) {
    return "상품 설명은 500자 이하로 입력해주세요.";
  }

  return null;
};

const productFields: FormFieldConfig[] = [
  {
    name: "productname",
    label: "상품명",
    placeholder: "2-10자 이내여야 합니다.",
    required: true,
    validator: validateProductName,
  },
  {
    name: "price",
    label: "가격",
    placeholder: "숫자만 입력 가능합니다.",
    required: true,
    validator: validatePrice,
  },
  {
    name: "link",
    label: "판매 링크",
    placeholder: "URL을 입력해 주세요.",
    required: false,
  },
  {
    name: "description",
    label: "상품 설명",
    placeholder: "상품에 대한 자세한 설명을 입력해주세요.",
    required: true,
    validator: validateDescription,
    type: "textarea" as const,
    maxLength: 500,
  },
];

export default function ProductAdd() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const formRef = useRef<{ submitForm: () => void }>(null);
  const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성 상태

  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "productAdd",
      title: "상품 등록",
      inputState: isFormValid,
      onBackClick: () => navigate(-1),
      onButtonClick: () => {
        // 실제 폼 제출 로직
        if (formRef.current) {
          formRef.current.submitForm();
        }
      },
    });

    // 🆕 컴포넌트 언마운트 시 헤더 초기화
    return () => {
      setHeaderConfig({ show: false });
    };
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
    <CommonForm
      ref={formRef}
      formType="product"
      fields={productFields}
      showButton={false}
      onSubmit={handleSubmit}
      onValidationChange={handleValidationChange}
    />
  );
}
