const API_BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

// 프로필, 상품 단일 이미지
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/image/uploadfile`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드 실패");
  }

  const data = await response.json();
  return `${API_BASE_URL}/${data.filename}`;
};
