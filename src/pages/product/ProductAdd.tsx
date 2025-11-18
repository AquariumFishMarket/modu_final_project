import { useNavigate } from "react-router-dom";
import CreateForm from "../../components/common/form/CreateForm";
import {
  FormData,
  ProductRequest,
  CommonFormRef,
} from "../../components/common/form/types";
import { useHeader } from "../../contexts/HeaderContext";
import { useEffect, useRef, useState } from "react";
import { getProductFields } from "../../utils/validation/productValidation";
import { fetchProductUpload } from "../../services/productService";
import { uploadImage } from "../../services/imageService";
import { useToastStore } from "../../contexts/useToastStore";

export default function ProductAdd() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const formRef = useRef<CommonFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToast } = useToastStore();
  const productFields = getProductFields();

  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "product",
      title: isSubmitting ? "등록 중..." : "등록",
      pageTitle: "상품 등록",
      inputState: isFormValid && !isSubmitting,
      onBackClick: () => {
        if (isSubmitting) return;
        navigate(-1);
      },
      onButtonClick: () => {
        if (isSubmitting) return;
        // 실제 폼 제출 로직
        if (formRef.current) {
          formRef.current.submitForm();
        }
      },
    });
  }, [isFormValid, isSubmitting, navigate, setHeaderConfig]);

  // 폼 유효성 변경 핸들러
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let imageUrl = "";

      if (data.itemImage) {
        imageUrl = await uploadImage(data.itemImage as File);
      }

      const productData: ProductRequest = {
        itemName: data.itemName as string,
        price: Number((data.price as string)?.replace(/,/g, "") || 0),
        link: data.link as string,
        itemImage: imageUrl,
      };

      const newProduct = await fetchProductUpload(productData);

      setToast("상품 등록이 완료됐습니다😊", () => {
        navigate(`/product/${newProduct.id}`);
      });
    } catch (error) {
      console.error("상품 등록 실패: ", error);
      setToast("상품 등록에 실패했습니다😭");
    }
  };

  return (
    <CreateForm
      ref={formRef}
      formType="product"
      fields={productFields}
      onSubmit={handleSubmit}
      onValidationChange={handleValidationChange}
      imageRequired={true}
    />
  );
}
