import styled from "styled-components";
import { Link } from "react-router-dom";

export const UserCard = styled(Link)`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.05);
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
  font-family: "font-medium", "sans-serif";
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
