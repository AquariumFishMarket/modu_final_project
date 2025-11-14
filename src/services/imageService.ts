const API_BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

// 프로필, 상품 단일 이미지
export const uploadImage = async (file: File): Promise<string> => {
  console.log("=== 이미지 업로드 시작 ===");
  console.log("📤 파일명:", file.name);
  console.log("📤 파일 타입:", file.type);
  console.log("📤 파일 크기:", (file.size / 1024).toFixed(2), "KB");

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

  // ✅ filename이 없으면 에러
  if (!data.info.filename) {
    console.error("❌ filename이 없습니다:", data);
    throw new Error("이미지 업로드 후 파일명을 받지 못했습니다.");
  }

  // ✅ 이미 전체 URL이면 그대로 반환
  if (data.info.filename.startsWith("http")) {
    console.log("✅ 전체 URL 반환:", data.info.filename);
    return data.info.filename;
  }

  // ✅ 상대 경로면 전체 URL 생성
  const fullUrl = `${API_BASE_URL}/${data.info.filename}`;
  console.log("✅ 생성된 전체 URL:", fullUrl);

  return fullUrl;
};
