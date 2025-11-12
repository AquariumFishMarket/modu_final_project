import styled from "styled-components";
import { Link } from "react-router-dom";

export const UserCard = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.6rem;
  padding: 0.8rem 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

export const UserProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex: 1;
  text-decoration: none;
  color: inherit;
  min-width: 0; /* flex 아이템 overflow 방지 */

  &:hover {
    text-decoration: none;
  }
`;

export const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  width: 100%;
  align-items: center;
`;

export const UserTextInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.6rem;
`;

export const UserName = styled.h2`
  font-size: var(--font-size-md);
`;

export const UserId = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
`;

export const UserImageWrapper = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

export const UserImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
