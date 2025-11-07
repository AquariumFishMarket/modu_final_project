// 상품명 유효성 검사 (2-10자)
export const validateProductName = (productName: string): string | null => {
  const trimmedName = productName.trim();

  if (!trimmedName) {
    return "상품명을 입력해주세요.";
  }

  if (trimmedName.length < 2) {
    return "상품명은 2자 이상 입력해주세요.";
  }

  if (trimmedName.length > 20) {
    return "상품명은 20자 이하로 입력해주세요.";
  }

  return null;
};

// 가격 유효성 검사 및 포맷팅
export const validatePrice = (price: string): string | null => {
  // 숫자만 추출 (콤마, 공백 제거)
  const numbersOnly = price.replace(/[^\d]/g, "");

  if (!numbersOnly) {
    return "가격을 입력해주세요.";
  }

  const numericPrice = parseInt(numbersOnly);

  if (numericPrice === 0) {
    return "0원보다 높은 가격을 입력해주세요.";
  }

  if (numericPrice > 100000000) {
    // 1억 원 제한
    return "가격은 1억 원 이하로 입력해주세요.";
  }

  return null;
};

// 가격 포맷팅 함수 (콤마 추가)
export const formatPrice = (price: string): string => {
  // 숫자만 추출
  const numbersOnly = price.replace(/[^\d]/g, "");

  if (!numbersOnly) return "";

  // 숫자를 천 단위로 콤마 추가
  return parseInt(numbersOnly).toLocaleString();
};

// 상품 설명 유효성 검사 (10-500자)
export const validateDescription = (description: string): string | null => {
  const trimmedDesc = description.trim();

  if (!trimmedDesc) {
    return "상품 설명을 입력해주세요.";
  }

  if (trimmedDesc.length < 10) {
    return "상품 설명은 10자 이상 입력해주세요.";
  }

  if (trimmedDesc.length > 500) {
    return "상품 설명은 500자 이하로 입력해주세요.";
  }

  return null;
};

// 상품 필드 설정 객체
export const getProductFields = () => {
  const fields = [
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
      formatter: formatPrice,
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

  return fields;
};
