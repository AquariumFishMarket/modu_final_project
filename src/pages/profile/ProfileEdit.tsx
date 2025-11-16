import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../../contexts/HeaderContext";
// import { useAuth } from "../../contexts/AuthContext";
import { useAuthStore } from "../../contexts/useAuthStore";
import EditForm from "../../components/common/form/EditForm";
import {
  CommonFormRef,
  ProfileFormData,
} from "../../components/common/form/types";
import { getProfileFields } from "../../utils/validation/userValidation";
import { fetchProfile, updateProfile } from "../../services/profileService";
import { uploadImage } from "../../services/imageService";
import { getToken } from "../../utils/tokenManager";
import { useToastStore } from "../../contexts/useToastStore";

// 사용자 프로필 타입 정의
interface UserProfile {
  username: string;
  accountname: string;
  intro: string;
  image: string;
}

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const formRef = useRef<CommonFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const { setToast } = useToastStore();

  // 상태
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const { refreshUserInfo } = useAuth();
  const refreshUserInfo = useAuthStore((s) => s.refreshUser);

  const profileFields = getProfileFields();

  // 기존 프로필 데이터 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getToken();

        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const start = Date.now();
        const data = await fetchProfile();

        if (!data) throw new Error("프로필 정보를 불러올 수 없습니다.");

        setProfileData({
          username: data.username,
          accountname: data.accountname,
          intro: data.intro || "",
          image: data.image,
        });

        // 최소 0.8초 로딩 화면 유지
        const elapsed = Date.now() - start;
        const minDelay = 800;
        if (elapsed < minDelay) {
          setTimeout(() => setLoading(false), minDelay - elapsed);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("프로필 로딩 실패:", error);
        setError(
          error instanceof Error ? error.message : "오류가 발생했습니다."
        );

        setTimeout(() => navigate("/profile"), 2000);
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    setHeaderConfig({
      show: true,
      type: "edit",
      title: "프로필 수정",
      inputState: isFormValid,
      onBackClick: () => navigate("/profile"),
      onButtonClick: () => {
        // 실제 폼 제출 로직
        if (formRef.current && isFormValid) {
          formRef.current.submitForm();
        }
      },
    });

    // 컴포넌트 언마운트 시 헤더 초기화
    return () => {
      setHeaderConfig({ show: false });
    };
  }, [isFormValid, setHeaderConfig, navigate]);

  // 폼 유효성 변경 핸들러
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (data: ProfileFormData) => {
    try {
      //console.log("📤 제출 데이터:", data);

      const token = getToken();
      if (!token) {
        throw new Error("로그인이 필요합니다."); // ☑️ 예외처리 필요
      }

      let imageUrl = "";

      if (data.image instanceof File) {
        imageUrl = await uploadImage(data.image);
      } else if (typeof data.image === "string" && data.image) {
        imageUrl = data.image;
      } else {
        imageUrl = "/img/empty-profile.png";
      }

      await updateProfile(
        data.username,
        data.accountname,
        data.intro || "",
        imageUrl
      );

      //console.log("✅ 프로필 수정 성공");

      // AuthContext 업데이트 - 서버에서 최신 정보 가져오기
      await refreshUserInfo();
      setToast("프로필이 수정되었습니다😎", () =>
        navigate("/profile", { replace: true })
      );

      //navigate("/profile", { replace: true });
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      setToast("프로필 수정을 실패했습니다😭");
    }
  };

  // 🆕 로딩 상태 -> 처리 어떻게 할지
  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>프로필 정보를 불러오는 중...</div>
    );
  }

  // 🆕 에러 상태 -> 처리 어떻게 할지
  if (error) {
    return (
      <div>
        {error}
        <br />
        <small>잠시 후 프로필 페이지로 이동합니다...</small>
      </div>
    );
  }

  // 🆕 데이터 없음 -> 처리 어떻게 할지
  if (!profileData) {
    return <div>프로필 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <EditForm
      ref={formRef}
      formType="profile"
      fields={profileFields}
      onSubmit={handleSubmit}
      onValidationChange={handleValidationChange}
      initialValues={{
        username: profileData.username,
        accountname: profileData.accountname,
        intro: profileData.intro,
      }}
      initialImageUrl={profileData.image}
    />
  );
}
