import ProfileForm from "../../components/common/ProfileForm";

export default function ProfileEdit() {
  return (
    <ProfileForm
      showTitle={false}
      onSubmit={() => console.log("프로필 수정 완료")}
    />
    // 하단 버튼 -> 메뉴 버튼으로 대체
  );
}
