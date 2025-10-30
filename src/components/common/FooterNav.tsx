import React from "react";
import { NavLinkRenderProps } from "react-router-dom";
import {
  NavContainer,
  NavList,
  NavItem,
  StyledNavLink,
  IconWrapper,
  NavLabel,
} from "./FooterNav.styled";

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
    activeIcon: "/src/assets/icons/icon-home-fill.svg",
  },
  {
    label: "채팅",
    path: "/chat" /* 수정 필요 */,
    icon: "/src/assets/icons/icon-message-circle.svg",
    activeIcon: "/src/assets/icons/icon-message-circle-fill.svg",
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
    activeIcon: "/src/assets/icons/icon-user-fill.svg",
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
                    <img
                      src={isActive ? item.activeIcon || item.icon : item.icon}
                      alt={item.label}
                    />
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
