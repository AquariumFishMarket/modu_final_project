const BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

// 프로필, 상품 단일 이미지
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${BASE_URL}/image/uploadfile`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드 실패");
  }

  const data = await response.json();

  // filename이 없으면 에러
  if (!data.info.filename) {
    throw new Error("이미지 업로드 후 파일명을 받지 못했습니다.");
  }

  // 이미 전체 URL이면 그대로 반환
  if (data.info.filename.startsWith("http")) {
    return data.info.filename;
  }

  // 상대 경로면 전체 URL 생성
  const fullUrl = `${BASE_URL}/${data.info.filename}`;

  return fullUrl;
};
