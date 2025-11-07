import styled from "styled-components";

export const PostHeader = styled.section`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UserInfo = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;

export const UserAvatar = styled.img`
  width: 4.2rem;
  height: 4.2rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.strong`
  font-size: 1.4rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 2px;
  vertical-align: bottom;
`;

export const UserId = styled.p`
  font-size: 1.2rem;
  color: var(--color-gray-dark);
  margin: 0;
  vertical-align: bottom;
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin: -8px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  img {
    width: 1.8rem;
    height: 1.8rem;
  }
`;
