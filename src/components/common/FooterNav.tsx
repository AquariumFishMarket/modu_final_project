import React from "react";
import { NavLink, NavLinkRenderProps } from "react-router-dom";
import styled from "styled-components";

const NavContainer = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  padding: 0 6px;
  border-top: 1px solid var(--color-gray-medium);
  z-index: 1000;
`;

const NavList = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
`;

const NavItem = styled.li`
  flex: 1;
  display: flex;
  justify-content: center;
  height: 100%;
`;

const StyledNavLink = styled(NavLink)`
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

const IconWrapper = styled.div`
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

const NavLabel = styled.span`
  font-size: var(--font-size-sm);
`;

interface NavItemType {
  label: string;
  path: string;
  icon: string;
  activeIcon?: string;
}

const navItems: NavItemType[] = [
  {
    label: "홈",
    path: "/",
    icon: "/src/assets/icons/icon-home.svg",
    activeIcon: "/src/assets/icons/icon-home-active.svg",
  },
  {
    label: "채팅",
    path: "/chat" /* 수정 필요 */,
    icon: "/src/assets/icons/icon-message-circle.svg",
    activeIcon: "/src/assets/icons/icon-chat-active.svg",
  },
  {
    label: "게시물 작성",
    path: "/post" /* 수정 필요 */,
    icon: "/src/assets/icons/icon-edit.svg",
  },
  {
    label: "프로필",
    path: "/profile" /* 수정 필요 */,
    icon: "/src/assets/icons/icon-user.svg",
    activeIcon: "/src/assets/icons/icon-user-active.svg",
  },
];

const FooterNav = () => {
  return (
    <NavContainer>
      <NavList>
        {navItems.map((item: NavItemType) => (
          <NavItem key={item.path}>
            <StyledNavLink to={item.path} end={item.path === "/"}>
              {({ isActive }: NavLinkRenderProps): React.ReactNode => (
                <>
                  <IconWrapper>
                    {isActive ? item.activeIcon || item.icon : item.icon}
                  </IconWrapper>
                  <NavLabel>{item.label}</NavLabel>
                </>
              )}
            </StyledNavLink>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default FooterNav;
