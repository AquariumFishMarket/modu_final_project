import { useNavigate } from "react-router-dom";
import CreateForm from "../../components/common/form/CreateForm";
import { FormData, ProductRequest, CommonFormRef } from "../../components/common/form/types";
import { useHeader } from "../../contexts/HeaderContext";
import { useEffect, useRef, useState } from "react";
import { getProductFields } from "../../utils/validation/productValidation";
import { fetchProductUpload } from "../../services/productService";
import { uploadImage } from "../../services/imageService";

export default function ProductAdd() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const formRef = useRef<CommonFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성 상태

  const productFields = getProductFields();

  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "product",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormValid, navigate, setHeaderConfig]);

  // 폼 유효성 변경 핸들러
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (data: FormData) => {
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

      console.log("상품 등록 완료 :", newProduct);

      // 등록된 상품 상세 페이지로 이동
      navigate(`/product/${newProduct.id}`);

      //
    } catch (error) {
      console.error("상품 등록 실패: ", error);
      alert("상품 등록에 실패했습니다.");
    }
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
