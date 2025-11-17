import { fetchPostDetail } from "../services/postService";

export async function fetchPostMeta(postId: string) {
  try {
    const detail = await fetchPostDetail(postId);

    if (!detail) {
      return {
        heartCount: 0,
        commentCount: 0,
        hearted: false,
        image: "",
      };
    }

    return {
      heartCount: detail.heartCount,
      commentCount: detail.commentCount,
      hearted: detail.hearted,
      image: detail.image,
    };
  } catch (err) {
    console.error("게시글 메타데이터 조회 실패:", err);
    return {
      heartCount: 0,
      commentCount: 0,
      hearted: false,
      image: "",
    };
  }
}
