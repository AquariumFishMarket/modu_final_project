import { useNavigate, useParams } from "react-router-dom";
import CommonForm, {
  FormSubmissionData,
  FormFieldConfig,
} from "../../components/common/CommonForm";
import { useHeader } from "../../contexts/HeaderContext";
import { useEffect, useRef, useState } from "react";
import { Product } from "../../types/product";
import { getProductById } from "../../data/mockProducts";

/* 유효성 검사 (ProductAdd와 동일) */
const validateProductName = (productName: string): string | null => {
  if (productName.length < 2) {
    return "상품명은 2자 이상 입력해주세요.";
  }
  if (productName.length > 10) {
    return "상품명은 10자 이하로 입력해주세요.";
  }
  return null;
};

const validatePrice = (price: string): string | null => {
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

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // 🆕 URL에서 상품 ID 가져오기
  const { setHeaderConfig } = useHeader();
  const formRef = useRef<{ submitForm: () => void }>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [product, setProduct] = useState<Product | null>(null); // 🆕 기존 상품 데이터
  const [isLoading, setIsLoading] = useState(true); // 🆕 로딩 상태

  // 🆕 기존 상품 데이터 불러오기
  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // 상품을 찾을 수 없으면 상품 상세 페이지로 이동
        navigate(`/product/${id}`);
        return;
      }
      setIsLoading(false);
    }
  }, [id, navigate]);

  // 헤더 설정
  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "edit", // 🆕 edit 타입 사용
      title: "상품 수정",
      inputState: isFormValid,
      onBackClick: () => navigate(`/product/${id}`), // 🆕 상품 상세로 돌아가기
      onButtonClick: () => {
        if (formRef.current && isFormValid) {
          formRef.current.submitForm();
        }
      },
    });

    return () => {
      setHeaderConfig({ show: false });
    };
  }, [isFormValid, id]);

  // 폼 유효성 변경 핸들러
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // 폼 제출 핸들러
  const handleSubmit = (data: FormSubmissionData) => {
    console.log("상품 수정 완료:", data);
    console.log("상품명:", data.formValues.productname);
    console.log("가격:", data.formValues.price);
    console.log("설명:", data.formValues.description);
    console.log("링크:", data.formValues.link);
    console.log("이미지 파일들:", data.imageFiles);

    // 🆕 수정 완료 후 상품 상세 페이지로 이동
    navigate(`/product/${id}`);
  };

  // 🆕 기존 데이터를 폼 초기값으로 변환
  const getInitialValues = () => {
    if (!product) return {};

    return {
      productname: product.itemName,
      price: product.price.toString(),
      link: product.link || "",
      description: product.description,
    };
  };

  const getInitialImages = (): File[] => {
    // 실제로는 URL을 File로 변환하는 로직이 필요하지만,
    // 여기서는 간단히 빈 배열 반환
    return [];
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <CommonForm
      ref={formRef}
      formType="product"
      fields={productFields}
      showButton={false}
      onSubmit={handleSubmit}
      onValidationChange={handleValidationChange}
      initialValues={getInitialValues()} // 🆕 기존 데이터로 초기화
      initialImages={getInitialImages()} // 🆕 기존 이미지로 초기화
    />
  );
}
