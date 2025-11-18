import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditForm from "../../components/common/form/EditForm";
import {
  CommonFormRef,
  ProductFormData,
} from "../../components/common/form/types";
import { useHeader } from "../../contexts/HeaderContext";
import { Product } from "../../types/product";
import {
  fetchProductDetail,
  updateProduct,
} from "../../services/productService";
import {
  getProductFields,
  formatPrice,
} from "../../utils/validation/productValidation";
import { useToastStore } from "../../contexts/useToastStore";
import { uploadImage } from "../../services/imageService";

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // URL에서 상품 ID 가져오기
  const { setHeaderConfig } = useHeader();
  const formRef = useRef<CommonFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null); // 기존 상품 데이터

  const productFields = getProductFields();
  const { setToast } = useToastStore();

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
  }, [id]);

  // 헤더 설정
  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "edit",
      title: isSubmitting ? "저장 중..." : "저장",
      pageTitle: "상품 수정",
      inputState: isFormValid && !isSubmitting,
      onBackClick: () => {
        if (isSubmitting) return;
        navigate(-1);
      },
      onButtonClick: () => {
        if (isSubmitting) return;

        if (formRef.current && isFormValid) {
          formRef.current.submitForm();
        }
      },
    });

    return () => {
      setHeaderConfig({ show: false });
    };
  }, [isFormValid, isSubmitting, navigate, setHeaderConfig, id]);

  // 폼 유효성 변경 핸들러
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (data: ProductFormData) => {
    if (!id) return;
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let imageUrl = "";

      if (data.image instanceof File) {
        // 새로 업로드한 이미지
        imageUrl = await uploadImage(data.image);
      } else if (typeof data.image === "string" && data.image) {
        // 기존 이미지 그대로 유지
        imageUrl = data.image;
      }

      const updatedProductData = {
        itemName: data.itemName,
        price: parseInt(data.price.replace(/,/g, "")),
        link: data.link || "",
        itemImage: imageUrl,
      };

      await updateProduct(id, updatedProductData);

      setToast("상품 수정을 완료했습니다😀", () => {
        navigate(`/product/${id}`);
      });
    } catch (error) {
      console.error("상품 수정 실패:", error);
      setToast("상품 수정을 실패했습니다😭");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 에러 처리하기
  if (!product) {
    return <div style={{ textAlign: 'center' }}>상품 정보를 불러오는 중...</div>;
  }

  return (
    <EditForm<ProductFormData>
      ref={formRef}
      formType="product"
      fields={productFields}
      onSubmit={handleSubmit}
      onValidationChange={handleValidationChange}
      initialValues={{
        itemName: product.itemName,
        price: formatPrice(product.price.toString()),
        link: product.link || "",
      }}
      initialImageUrl={product.itemImage || ""}
    />
  );
}
