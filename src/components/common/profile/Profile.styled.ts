import styled from "styled-components";

export const ProfileSection = styled.section`
  width: calc(100% + 30px);
  margin-left: -15px;
  margin-right: -15px;
  margin-top: -68px;
  padding-top: 68px;
  background-color: #ffffff;
  padding-bottom: 2.4rem;
  border-bottom: 6px solid var(--color-gray-light);
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
`;

export const ProfileTopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

export const FollowStatBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;

export const FollowText = styled.p`
  font-size: var(--font-size-xs);
  color: var(--color-gray-semi-dark);
`;

export const FollowerValue = styled.p`
  font-size: var(--font-size-xl);
  font-weight: 700;
`;

export const FollowingValue = styled.p`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-dark);
`;

export const ProfileImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileImage = styled.img`
  width: 11rem;
  height: 11rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  text-align: center;
`;

export const UserName = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #000;
`;

export const UserId = styled.p`
  font-size: var(--font-size-md);
  color: var(--color-gray-semi-dark);
`;

export const UserDescription = styled.p`
  text-align: center;
  margin: 1.6rem 0 2.4rem 0;
  font-size: 1.4rem;
  color: var(--color-gray-semi-dark);
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export const IconButton = styled.button<{ $iconUrl: string }>`
  width: 3.4rem;
  height: 3.4rem;
  background: url(${(props) => props.$iconUrl}) no-repeat center center;
  background-size: 2rem 2rem;
  border: 1px solid #dbdbdb;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-gray-medium);
  }

  &:active {
    background-color: var(--color-gray-dark);
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  padding: 2rem;
`;

// 내 프로필 피드 섹션
export const MyFeedSection = styled.section`
  width: calc(100% + 30px);
  margin-inline: -1.5rem;
`;

export const MyFeedTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1.6rem;
  padding: 0 1.6rem;
`;

export const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1.6rem 2.1rem;
`;

export const EmptyPostMessage = styled.p`
  text-align: center;
  color: var(--color-gray-semi-dark);
  padding: 2rem;
  font-size: 1.4rem;
`;
