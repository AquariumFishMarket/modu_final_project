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

// 타입별로 필요한 props를 명확히 정의 (discriminated union)
type HeaderProps =
  | { type?: "feed"; onBackClick?: () => void; onSearchClick?: () => void }
  | { type: "search"; onBackClick?: () => void }
  | { type: "followers"; onBackClick?: () => void }
  | { type: "profile"; onBackClick?: () => void; onMoreClick?: () => void }
  | {
      type: "edit";
      inputState: boolean;
      onButtonClick: () => void;
      onBackClick?: () => void;
    }
  | {
      type: "post";
      inputState: boolean;
      onButtonClick: () => void;
      onBackClick?: () => void;
    }
  | { type: "chatList"; onBackClick?: () => void; onMoreClick?: () => void }
  | {
      type: "chat";
      userName: string;
      onBackClick?: () => void;
      onMoreClick?: () => void;
    };

// 타입 가드 함수들
const isFeedType = (
  props: HeaderProps
): props is Extract<HeaderProps, { type?: "feed" }> => {
  return !props.type || props.type === "feed";
};

const isSearchType = (
  props: HeaderProps
): props is Extract<HeaderProps, { type: "search" }> => {
  return props.type === "search";
};

const isFollowersType = (
  props: HeaderProps
): props is Extract<HeaderProps, { type: "followers" }> => {
  return props.type === "followers";
};

const isProfileType = (
  props: HeaderProps
): props is Extract<HeaderProps, { type: "profile" }> => {
  return props.type === "profile";
};

const isEditType = (
  props: HeaderProps
): props is Extract<HeaderProps, { type: "edit" }> => {
  return props.type === "edit";
};

const isPostType = (
  props: HeaderProps
): props is Extract<HeaderProps, { type: "post" }> => {
  return props.type === "post";
};

const isChatListType = (
  props: HeaderProps
): props is Extract<HeaderProps, { type: "chatList" }> => {
  return props.type === "chatList";
};

const isChatType = (
  props: HeaderProps
): props is Extract<HeaderProps, { type: "chat" }> => {
  return props.type === "chat";
};

function Header(props: HeaderProps) {
  return (
    <HeaderContainer>
      <h1 className="sr-only">물고기 마켓</h1>

      {/* 피드 */}
      {isFeedType(props) && (
        <Section>
          <Title>물고기마켓 피드</Title>
          <IconButton onClick={props.onSearchClick}>
            <img src="/img/icon-search.svg" alt="검색열기" />
          </IconButton>
        </Section>
      )}

      {/* 검색 */}
      {isSearchType(props) && (
        <Section>
          <AllyHiddenTitle>검색</AllyHiddenTitle>
          <SearchForm>
            <BackButton onClick={props.onBackClick}>
              <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
            </BackButton>
            <SearchInput type="text" placeholder="계정 검색" autoFocus />
          </SearchForm>
        </Section>
      )}

      {/* 팔로워 목록 */}
      {isFollowersType(props) && (
        <SectionCombine>
          <BackButton onClick={props.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </BackButton>
          <SubTitle>Followers</SubTitle>
        </SectionCombine>
      )}

      {/* 프로필 */}
      {isProfileType(props) && (
        <Section>
          <IconButton onClick={props.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <IconButton onClick={props.onMoreClick}>
            <img src="/img/icon-more-vertical.svg" alt="더보기" />
          </IconButton>
        </Section>
      )}

      {/* 프로필 수정 */}
      {isEditType(props) && (
        <Section>
          <IconButton onClick={props.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <DefaultButton
            text="저장"
            width={90}
            disabled={!props.inputState}
            onClick={props.onButtonClick}
          />
        </Section>
      )}

      {/* 게시글 작성 */}
      {isPostType(props) && (
        <Section>
          <IconButton onClick={props.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <DefaultButton
            text="업로드"
            width={90}
            disabled={!props.inputState}
            onClick={props.onButtonClick}
          />
        </Section>
      )}

      {/* 채팅 목록 */}
      {isChatListType(props) && (
        <Section>
          <IconButton onClick={props.onBackClick}>
            <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
          </IconButton>
          <IconButton onClick={props.onMoreClick}>
            <img src="/img/icon-more-vertical.svg" alt="더보기" />
          </IconButton>
        </Section>
      )}

      {/* 채팅 */}
      {isChatType(props) && (
        <Section>
          <ChatUserContainer>
            <IconButton onClick={props.onBackClick}>
              <img src="/img/icon-arrow-left.svg" alt="이전 페이지로 이동" />
            </IconButton>
            <h2>{props.userName}</h2>
          </ChatUserContainer>
          <IconButton onClick={props.onMoreClick}>
            <img src="/img/icon-more-vertical.svg" alt="더보기" />
          </IconButton>
        </Section>
      )}
    </HeaderContainer>
  );
}

export default Header;
