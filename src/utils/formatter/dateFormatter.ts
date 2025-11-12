// 날짜 포맷팅 유틸리티
export const formatPostDate = (dateString: string): string => {
  const postDate = new Date(dateString);
  const now = new Date();

  // 밀리초 단위 차이
  const diffMs = now.getTime() - postDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 1분 미만
  if (diffMinutes < 1) {
    return "방금 전";
  }

  // 1시간 미만
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  // 24시간 미만
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  // 7일 미만
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  // 올해의 게시글
  if (postDate.getFullYear() === now.getFullYear()) {
    const month = String(postDate.getMonth() + 1).padStart(2, "0");
    const day = String(postDate.getDate()).padStart(2, "0");
    return `${month}월 ${day}일`;
  }

  // 작년 이전
  const year = String(postDate.getFullYear()).slice(-2);
  const month = String(postDate.getMonth() + 1).padStart(2, "0");
  const day = String(postDate.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};
