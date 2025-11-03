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
import DefaultButton from "./Button";
import { useHeader } from "../../contexts/HeaderContext";

function Header() {
  const { config } = useHeader();

  // Header를 숨길 경우 아무것도 렌더링하지 않음
  if (!config.show) {
    return null;
  }

  return (
    <HeaderContainer>
      <h1 className="sr-only">물고기 마켓</h1>

      {/* 피드 */}
      {(!config.type || config.type === "feed") && (
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
          <SearchForm>
            <BackButton onClick={config.onBackClick}>
              <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
            </BackButton>
            <SearchInput type="text" placeholder="계정 검색" autoFocus />
          </SearchForm>
        </Section>
      )}

      {/* 팔로워 목록 */}
      {config.type === "followers" && (
        <SectionCombine>
          <BackButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </BackButton>
          <SubTitle>{config.title || "Followers"}</SubTitle>
        </SectionCombine>
      )}

      {/* 프로필 */}
      {config.type === "profile" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <IconButton onClick={config.onMoreClick}>
            <img src="/img/icon-more-vertical.svg" alt="더보기" />
          </IconButton>
        </Section>
      )}

      {/* 프로필 수정 */}
      {config.type === "edit" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <DefaultButton
            text="저장"
            width={90}
            disabled={!config.inputState}
            onClick={config.onButtonClick}
          />
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
            disabled={!config.inputState}
            onClick={config.onButtonClick}
          />
        </Section>
      )}

      {/* 채팅 목록 */}
      {config.type === "chatList" && (
        <Section>
          <IconButton onClick={config.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <IconButton onClick={config.onMoreClick}>
            <img src="/img/icon-more-vertical.svg" alt="더보기" />
          </IconButton>
        </Section>
      )}

      {/* 채팅 */}
      {config.type === "chat" && (
        <Section>
          <ChatUserContainer>
            <IconButton onClick={config.onBackClick}>
              <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
            </IconButton>
            <h2>{config.userName}</h2>
          </ChatUserContainer>
          <IconButton onClick={config.onMoreClick}>
            <img src="/img/icon-more-vertical.svg" alt="더보기" />
          </IconButton>
        </Section>
      )}
    </HeaderContainer>
  );
}

export default Header;
