import ProfileForm from "../../components/common/ProfileForm";

export default function ProfileSetup() {
  return (
    <ProfileForm
      showTitle={true}
      buttonText="시작하기"
      onSubmit={() => console.log("프로필 설정 완료")}
    />
  );
}
