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
  const numbersOnly = price.replace(/[^\d]/g, "");

  if (!numbersOnly) return "";

  return parseInt(numbersOnly).toLocaleString();
};

// URL 유효성 검사
export const validateProductLink = (link: string): string | null => {
  const trimmedLink = link.trim();

  if (!trimmedLink) {
    return "판매 링크를 입력해주세요.";
  }

  // URL 형식 검사 (http:// 또는 https://로 시작)
  const urlPattern = /^https?:\/\/.+/i;

  if (!urlPattern.test(trimmedLink)) {
    return "올바른 URL 형식이 아닙니다. (http:// 또는 https://로 시작해야 합니다)";
  }

  try {
    new URL(trimmedLink);
  } catch {
    return "유효하지 않은 URL입니다.";
  }

  return null;
};

// 상품 필드
export const getProductFields = () => {
  const fields = [
    {
      name: "itemName",
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
      placeholder: "https://example.com",
      required: true,
      validator: validateProductLink,
    },
  ];

  return fields;
};
