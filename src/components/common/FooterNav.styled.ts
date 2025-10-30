import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const NavContainer = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  padding: 0 6px;
  border-top: 1px solid var(--color-gray-medium);
  z-index: 1000;
`;

export const NavList = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
`;

export const NavItem = styled.li`
  flex: 1;
  display: flex;
  justify-content: center;
  height: 100%;
`;

export const StyledNavLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  text-decoration: none;
  color: var(--color-gray-dark);

  &:hover {
    opacity: 0.7;
  }

  &.active {
    color: var(--color-primary-600);
  }
`;

export const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
  }
`;

export const NavLabel = styled.span`
  /* font-size: var(--font-size-xs); */
  font-size: 10px;
`;
