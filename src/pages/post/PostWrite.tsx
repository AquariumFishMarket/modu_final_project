import { useEffect, useRef, useState } from "react";
import ProfileImg from "../../components/common/ProfileImg";
import ImageUpButton from "../../components/common/imageUpload/UploadButton";
import ImageContainer from "../../components/common/imageUpload/ImageContainer";
import styled from "styled-components";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../../contexts/HeaderContext";
import { ToastContainer, toast } from "react-toastify";

const PostContainer = styled.div`
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
  const { setHeaderConfig } = useHeader();
  const [imgArr, setImgArr] = useState<File[]>([]); //file 배열이 필요할 경우 넣어주세요
  const [content, setContent] = useState("");
  const [deleteIndex, setDeleteIdx] = useState<number | undefined>();
  const [textPlaceholder, setTextPlaceholder] = useState("게시글 입력하기..");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // 폼 유효성 검사 (텍스트가 있거나 이미지가 있으면 유효)
  const isFormValid = content.trim().length > 0 || imgArr.length > 0;

  //toast 알림
  const notify = (msg:string) => toast(msg,{
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    style: {
      justifyContent: "center",
    },
    onClose: () => {
      //navigate('/')
    }
    });


  // 헤더 설정
  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "post",
      title: "게시글 작성",
      inputState: isFormValid,
      onBackClick: () => navigate("/"),
      onButtonClick: () => {
        if (isFormValid) {
          handleSubmit();
        }
      },
    });

    return () => {
      setHeaderConfig({ show: false });
    };
  }, [isFormValid]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // 토큰 불러오기
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("토큰이 없습니다. 로그인 해주세요.");
        return;
      }

      let uploadedImagePath = "";

      // 이미지 업로드 (선택한 이미지가 있으면)
      if (imgArr.length > 0) {
        const formData = new FormData();
        formData.append("image", imgArr[0]); // 첫 번째 이미지만 업로드 예시

        const uploadRes = await fetch("https://dev.wenivops.co.kr/services/mandarin/image/uploadfiles", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.info?.length > 0) {
          uploadedImagePath = uploadData.info[0].path; // 서버에서 반환한 이미지 경로
        } else {
          alert("이미지 업로드 실패");
          return;
        }
      }

      // 게시글 작성
      const postRes = await fetch("https://dev.wenivops.co.kr/services/mandarin/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: {
            content: content,           // textarea state
            image: uploadedImagePath,   // 업로드된 이미지 경로
          },
        }),
      });

      const postData = await postRes.json();

      if (postRes.ok) {
        console.log("게시글 작성 성공:", postData);
        notify('게시글 작성이 완료됐어요! 😊');
        setContent("");  // textarea 초기화
        setImgArr([]);   // 이미지 초기화
      } else {
        notify('게시글 작성이 실패했어요 🥲');
        console.log(postData.message || "게시글 작성 실패");
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <ToastContainer />
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ height: "100%" }}
      >
        <PostContainer>
          <ImageUploadContainer>
            <ImageUpButtonContainer>
              <ImageUpButton
                multiple={true}
                colortype="color"
                size="small"
                imgArr={imgArr}
                setImgArr={setImgArr}
              />
              <p>{imgArr.length}/10</p>
            </ImageUpButtonContainer>
            <ImageContainer imgArr={imgArr} setDeleteIdx={setDeleteIdx} />
          </ImageUploadContainer>
          <Contents>
            <ProfileImg width={42} thumbimg={false}></ProfileImg>
            <WriteZone>
              <TextArea
                ref={textAreaRef}
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
