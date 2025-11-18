import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { NavLinkRenderProps } from "react-router-dom";
import HOME from "../../json/home.json";
import HOMEACTIVE from "../../json/home-active.json";
import CHAT from "../../json/chat.json";
import CHATACTIVE from "../../json/chat-active.json";
import WRITE from "../../json/write.json";
import WRITEACTIVE from "../../json/write-active.json";
import PROFILE from "../../json/profile.json";
import PROFILEACTIVE from "../../json/profile-active.json";

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
  icon: Record<string, any>;
  activeIcon?: Record<string, any>;
}

const navItems: NavItemType[] = [
  {
    label: "홈",
    path: "/feed",
    icon: HOME,
    activeIcon: HOMEACTIVE,
  },
  {
    label: "채팅",
    path: "/chat-list",
    icon: CHAT,
    activeIcon: CHATACTIVE,
  },
  {
    label: "게시물 작성",
    path: "/post",
    icon: WRITE,
    activeIcon: WRITEACTIVE,
  },
  {
    label: "프로필",
    path: "/profile",
    icon: PROFILE,
    activeIcon: PROFILEACTIVE,
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
                    <Player
                      src={isActive ? item.activeIcon || item.icon : item.icon}
                      autoplay={isActive ? true : false}
                      style={{ width: "30px", height: "30px" }}
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
