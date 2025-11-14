import { useNavigate, useParams } from "react-router-dom";
import EditForm from "../../components/common/form/EditForm";
import {
  CommonFormRef,
  ProductFormData,
} from "../../components/common/form/types";
import { useHeader } from "../../contexts/HeaderContext";
import { useEffect, useRef, useState } from "react";
import { Product } from "../../types/product";
import {
  fetchProductDetail,
  updateProduct,
} from "../../services/productService";
import {
  getProductFields,
  formatPrice,
} from "../../utils/validation/productValidation";

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // URL에서 상품 ID 가져오기
  const { setHeaderConfig } = useHeader();
  const formRef = useRef<CommonFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [product, setProduct] = useState<Product | null>(null); // 기존 상품 데이터

  const productFields = getProductFields();

  // 기존 상품 데이터 불러오기
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const productData = await fetchProductDetail(id);
        setProduct(productData);
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
        navigate(`/product/${id}`);
      }
    };

    loadProduct();
  }, [id, navigate]);

  // 헤더 설정
  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "edit",
      title: "상품 수정",
      inputState: isFormValid,
      onBackClick: () => navigate(`/product/${id}`),
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
  const handleSubmit = async (data: ProductFormData) => {
    if (!id) return;

    try {
      const updatedProductData = {
        itemName: data.itemName,
        price: parseInt(data.price.replace(/,/g, "")),
        link: data.link || "",
        // itemImage: 이미지 업로드 후 string URL로 할당 필요
      };

      await updateProduct(id, updatedProductData);
      navigate(`/product/${id}`);
    } catch (error) {
      console.error("상품 수정 실패:", error);
      alert("상품 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 기존 데이터를 폼 초기값으로 변환
  const getInitialValues = (): { [key: string]: string } => {
    if (!product) return {};

    return {
      productname: product.itemName,
      price: formatPrice(product.price.toString()),
      link: product.link || "",
    };
  };

  return (
    <EditForm<ProductFormData>
      ref={formRef}
      formType="product"
      fields={productFields}
      onSubmit={handleSubmit}
      onValidationChange={handleValidationChange}
      initialValues={getInitialValues()} // 🆕 기존 데이터로 초기화
    />
  );
}
