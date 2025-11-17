export const getImageUrls = (imageSrc?: string): string[] => {
  if (!imageSrc) return [];

  // 쉼표로 구분된 이미지들을 배열로 변환
  const imageStrings = imageSrc
    .split(",")
    .map((img) => img.trim())
    .filter(Boolean);

  return imageStrings.map((imageString) => {
    // 이미 전체 URL인 경우 그대로 반환
    if (imageString.startsWith("http")) {
      return imageString;
    }

    // API 명세에 따라: uploadFiles/filename.ext → filename.ext 추출 후 URL 조합
    const filename = imageString.includes("/")
      ? imageString.split("/")[1]
      : imageString;
    return `https://dev.wenivops.co.kr/services/mandarin/${filename}`;
  });
};
