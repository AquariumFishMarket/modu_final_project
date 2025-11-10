import styled from "styled-components";
import { Link } from "react-router-dom";

export const UserCard = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.6rem;
  padding: 1.6rem 0;
  border-bottom: 1px solid var(--color-gray-light, #f2f2f2);

  &:last-child {
    border-bottom: none;
  }
`;

export const UserProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex: 1;
  text-decoration: none;
  color: inherit;
  min-width: 0;

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
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.h2`
  font-size: var(--font-size-md);
  font-family: "font-medium", "sans-serif";
  color: var(--color-black);
`;

export const UserIntro = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  line-height: 1.4;
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
