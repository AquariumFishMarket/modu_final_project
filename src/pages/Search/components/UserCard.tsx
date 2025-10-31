import {
  UserCard,
  UserInfoWrapper,
  UserTextInfo,
  UserImageWrapper,
  UserImage,
  UserName,
  UserId,
} from "./UserCard.styled";

interface UserCardProps {
  userName: string;
  userId: string;
  userImage: string;
}

function UserCardComponent({ userName, userId, userImage }: UserCardProps) {
  return (
    <UserCard to={`/profile/${encodeURIComponent(userId)}`}>
      <UserInfoWrapper>
        {/* 프로필 이미지 */}
        <UserImageWrapper>
          <UserImage
            src={userImage || "/default-profile.png"}
            alt={`${userName}의 프로필 이미지`}
          />
        </UserImageWrapper>

        {/* 이름 + ID */}
        <UserTextInfo>
          <UserName>{userName}</UserName>
          <UserId>@ {userId}</UserId>
        </UserTextInfo>
      </UserInfoWrapper>
    </UserCard>
  );
}

export default UserCardComponent;
