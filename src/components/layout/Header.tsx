import {
  HeaderContainer,
  Section,
  SectionCombine,
  Title,
  SubTitle,
  IconButton,
  BackButton,
  SearchForm,
  SearchInput,
  ChatUserContainer,
  AllyHiddenTitle,
} from "./Header.styled";
import DefaultButton from "../common/buttons/Button";

import { useHeader } from "../../contexts/HeaderContext";
import { useSearchContext } from "../../contexts/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const { config } = useHeader();
  const { inputValue, handleInputChange, clearSearch } = useSearchContext();
  const location = useLocation();
  const navigate = useNavigate();

  // URL 기준으로 팔로워 / 팔로잉 페이지 판별
  const isFollowerPage = location.pathname.endsWith("/follower");
  const isFollowingPage = location.pathname.endsWith("/following");

  if (!config.show) return null;

  if (isFollowerPage) {
    return (
      <HeaderContainer>
        <SectionCombine>
          <BackButton onClick={() => navigate(-1)}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </BackButton>
          <SubTitle>팔로워</SubTitle>
        </SectionCombine>
      </HeaderContainer>
    );
  }

  if (isFollowingPage) {
    return (
      <HeaderContainer>
        <SectionCombine>
          <BackButton onClick={() => navigate(-1)}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </BackButton>
          <SubTitle>팔로잉</SubTitle>
        </SectionCombine>
      </HeaderContainer>
    );
  }

  // 그 외 페이지는 기존 로직 유지
  return (
    <HeaderContainer>
      <h1 className="sr-only">{config.pageTitle || "물고기마켓"}</h1>

      {/* 피드 */}
      {config.type === "feed" && (
        <Section>
          <Title>{config.title || "물고기마켓 피드"}</Title>
          <IconButton onClick={config.onSearchClick}>
            <img src="/img/icon-search.svg" alt="검색열기" />
          </IconButton>
        </Section>
      )}

      {/* 검색 */}
      {config.type === "search" && (
        <Section>
          <AllyHiddenTitle>검색</AllyHiddenTitle>
          <SearchForm
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <BackButton
              onClick={() => {
                clearSearch();
                config.onBackClick?.();
              }}
            >
              <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
            </BackButton>
            <SearchInput
              type="text"
              placeholder="계정 검색  (2글자 이상 입력해주세요.)"
              autoFocus
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              onBlur={() => {
                if (!inputValue.trim()) {
                  clearSearch();
                }
              }}
            />
          </SearchForm>
        </Section>
      )}

      {/* 프로필 */}
      {config.type === "profile" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          {config.rightElement}
        </Section>
      )}

      {/* 프로필, 상품 수정 */}
      {config.type === "edit" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <DefaultButton
            text={config.title || "저장"}
            type="button"
            width={90}
            height="medium"
            disabled={!config.inputState}
            onClick={config.onButtonClick}
          />
        </Section>
      )}

      {/* 상품 등록 */}
      {config.type === "product" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <DefaultButton
            text={config.title || ""}
            type="button"
            width={90}
            height="medium"
            disabled={!config.inputState}
            onClick={config.onButtonClick}
          />
        </Section>
      )}

      {/* 상품 상세 */}
      {config.type === "productDetail" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          {config.rightElement}
        </Section>
      )}

      {/* 게시글 작성 */}
      {config.type === "post" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <DefaultButton
            text="업로드"
            width={90}
            height="medium"
            disabled={!config.inputState}
            type={"button"}
            onClick={config.onButtonClick}
          />
        </Section>
      )}

      {/* 게시글 상세 */}
      {config.type === "postDetail" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          {config.rightElement}
        </Section>
      )}

      {/* 채팅 목록 */}
      {config.type === "chatList" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          {config.rightElement}
        </Section>
      )}

      {/* 채팅방 */}
      {config.type === "chat" && (
        <Section>
          <ChatUserContainer>
            <IconButton onClick={config.onBackClick}>
              <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
            </IconButton>
            <h2 style={{ position: "relative", top: "-1px" }}>
              {config.userName}
            </h2>
          </ChatUserContainer>
          {config.rightElement}
        </Section>
      )}
    </HeaderContainer>
  );
}

export default Header;
