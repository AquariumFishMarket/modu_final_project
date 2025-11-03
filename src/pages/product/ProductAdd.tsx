import CommonForm, {
  FormSubmissionData,
} from "../../components/common/CommonForm";

// 상품명 유효성 검사
const validateProductName = (productName: string): string | null => {
  if (productName.length < 2) {
    return "상품명은 2자 이상 입력해주세요.";
  }

  if (productName.length > 10) {
    return "상품명은 10자 이하로 입력해주세요.";
  }

  return null;
};

// 가격 유효성 검사
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

const productFields = [
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
    required: true,
  },
];

export default function ProductAdd() {
  // 폼 제출 핸들러 정의
  const handleSubmit = (data: FormSubmissionData) => {
    console.log("상품 등록 완료:", data);
    // 실제 API 호출이나 다음 페이지 이동 로직 추가
  };
  return (
    <CommonForm
      formType="product"
      fields={productFields}
      showButton={false} // 헤더 버튼 사용
      onSubmit={handleSubmit}
    />
  );
}
