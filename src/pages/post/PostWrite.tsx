import { useEffect, useRef, useState } from "react";
import ProfileImg from "../../components/common/ProfileImg";
import ImageUpButton from "../../components/common/imageUpload/UploadButton";
import ImageContainer from "../../components/common/imageUpload/ImageContainer";
import styled from "styled-components";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { useHeader } from "../../contexts/HeaderContext";
import { toast } from "react-toastify";
import { useToastStore } from "../../contexts/useToastStore";
import { fetchPostDetail, EditPost } from "../../services/postService";
import { useFeedStore } from "../../contexts/useFeedStore";

const PostContainer = styled.section`
  height: 100%;
  margin: 0 auto;
`;
const ImageUploadContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;
const Contents = styled.div`
  height: calc(100% - 100px);
  display: flex;
  gap: 13px;
`;
const WriteZone = styled.div`
  max-width: 100%;
  width: calc(100% - 55px);
  height: 100%;
`;
const TextArea = styled.textarea`
  padding: 12px 12px 30px;
  width: 100%;
  min-height: 1px;
  max-height: 100%;
  border: unset;
  resize: none;
  font-size: var(--font-size-md);
  color: black;
  &:placeholder {
    color: rgba(196, 196, 196, 1);
  }
  &:focus {
    outline: none;
  }
`;
const ImageUpButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  border: 1px solid var(--color-gray-medium);
  > p {
    font-size: var(--font-size-sm);
  }
`;

export default function PostWrite() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>(); // URL에서 postId 추출
  const { setHeaderConfig } = useHeader();
  const [imgArr, setImgArr] = useState<File[]>([]); //file 배열이 필요할 경우 넣어주세요
  const [content, setContent] = useState("");
  const [deleteIndex, setDeleteIdx] = useState<number | undefined>();
  const [textPlaceholder, setTextPlaceholder] = useState("게시글 입력하기..");
  const [isLoading, setIsLoading] = useState(false);
  const [existingImagePath, setExistingImagePath] = useState<string>(""); // 기존 이미지 경로

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // 수정 모드인지 확인
  const isEditMode = !!postId;

  // 폼 유효성 검사 (텍스트가 있거나 이미지가 있으면 유효)
  const isFormValid = content.trim().length > 0 || imgArr.length > 0 || existingImagePath.length > 0;

  //toast 알림
  const { setToast } = useToastStore();
  const notify = (msg:string) => toast(msg,{
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  // 수정 모드: 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (isEditMode && postId) {
      const loadPostData = async () => {
        setIsLoading(true);
        try {
          const postData = await fetchPostDetail(postId);
          if (postData) {
            setContent(postData.content);
            setExistingImagePath(postData.image || "");

            // textarea에 기존 내용 설정
            if (textAreaRef.current) {
              textAreaRef.current.value = postData.content;
              // 높이 자동 조절
              textAreaRef.current.style.height = "auto";
              textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
            }
          }
        } catch (error) {
          notify("게시글을 불러오는데 실패했습니다 🥲");
        } finally {
          setIsLoading(false);
        }
      };
      loadPostData();
    }
  }, [isEditMode, postId]);

  // 헤더 설정
  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "post",
      title: isEditMode ? "게시글 수정" : "게시글 작성",
      inputState: isFormValid,
      onBackClick: () => navigate(-1),
      onButtonClick: () => {
        if (isFormValid) {
          handleSubmit();
        }
      },
    });

    return () => {
      setHeaderConfig({ show: false });
    };
  }, [isFormValid, isEditMode, imgArr, existingImagePath, content]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    const newValue = e.target.value;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    const actualContent = textAreaRef.current?.value || '';
    try {
      // 토큰 불러오기
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("토큰이 없습니다. 로그인 해주세요.");
        return;
      }

      let finalImagePath = existingImagePath;
      if (imgArr.length > 0) {
        const formData = new FormData();

        imgArr.forEach((file) => {
          formData.append("image", file);
        });

        const uploadRes = await fetch("https://dev.wenivops.co.kr/services/mandarin/image/uploadfiles", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.info?.length > 0) {
          const uploadedPaths = uploadData.info.map((img: any) => img.path).join(",");

          if (isEditMode && existingImagePath) {
            finalImagePath = `${existingImagePath},${uploadedPaths}`;
          } else {
            finalImagePath = uploadedPaths;
          }
        } else {
          alert("이미지 업로드 실패");
          return;
        }
      }

      if (isEditMode && postId) {
        const updatedPost = await EditPost(postId, actualContent, finalImagePath);

        if (updatedPost) {
          useFeedStore.getState().updatePost(updatedPost);
          setToast('게시글 수정이 완료됐어요! 😊');
          navigate(`/post/${postId}?updated=${Date.now()}`, { replace: true });
        } else {
          notify('게시글 수정이 실패했어요 🥲');
        }
      } else {
        const postRes = await fetch("https://dev.wenivops.co.kr/services/mandarin/post", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post: {
              content: actualContent,
              image: finalImagePath,
            },
          }),
        });

        const postData = await postRes.json();

        if (postRes.ok) {
          setToast('게시글 작성이 완료됐어요! 😊')
          setContent("");
          setImgArr([]);
          if (textAreaRef.current) {
            textAreaRef.current.value = '';
          }
          navigate('/feed')
        } else {
          notify('게시글 작성이 실패했어요 🥲');
        }
      }
    } catch (err) {
      notify("오류가 발생했습니다 🥲");
    }
  };


  useEffect(() => {
    if (imgArr.length > 0 && textAreaRef.current?.value !== "") {
      setTextPlaceholder("");
    }
  }, [imgArr]);

  useEffect(() => {
    setImgArr((prev) => prev.filter((_, i) => i !== deleteIndex));
    //초기화
    setDeleteIdx(undefined);
  }, [deleteIndex]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ height: "100%" }}
      >
        <PostContainer>
          <h2 className="sr-only">{isEditMode ? "게시물 수정" : "게시물 업로드"}</h2>
          <ImageUploadContainer>
            <ImageUpButtonContainer>
              <ImageUpButton
                multiple={true}
                colortype="color"
                size="small"
                imgArr={imgArr}
                setImgArr={setImgArr}
                existingCount={existingImagePath ? existingImagePath.split(",").filter(p => p.trim()).length : 0}
              />
              <p>{imgArr.length + (existingImagePath ? existingImagePath.split(",").filter(p => p.trim()).length : 0)}/10</p>
            </ImageUpButtonContainer>
            {/* 수정 모드: 기존 이미지 표시 */}
            {isEditMode && existingImagePath && existingImagePath.split(",").filter(p => p.trim()).map((imagePath, index) => (
              <div key={`existing-${index}`} style={{
                position: "relative",
                width: "80px",
                height: "80px",
                borderRadius: "10px",
                overflow: "hidden",
              }}>
                <img
                  src={`https://dev.wenivops.co.kr/services/mandarin/${imagePath.includes("/") ? imagePath.split("/")[1] : imagePath}`}
                  alt={`기존 이미지 ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={() => {
                    // 해당 이미지만 제거
                    const images = existingImagePath.split(",").filter(p => p.trim());
                    images.splice(index, 1);
                    setExistingImagePath(images.join(","));
                  }}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    width: "22px",
                    height: "22px",
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "100%",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <img src="/img/icon-close.svg" alt="닫기" style={{ width: "100%", height: "100%" }} />
                </button>
              </div>
            ))}
            {/* 새로 업로드한 이미지 */}
            <ImageContainer imgArr={imgArr} setDeleteIdx={setDeleteIdx} />
          </ImageUploadContainer>
          <Contents>
            <ProfileImg width={42} thumbimg={false}></ProfileImg>
            <WriteZone>
              <TextArea
                ref={textAreaRef}
                id={'post-upload'}
                placeholder={textPlaceholder}
                onChange={handleTextChange}
              />
            </WriteZone>
          </Contents>
        </PostContainer>
      </motion.div>
    </div>
  );
}
