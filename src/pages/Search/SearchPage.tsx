import { useState } from "react";

import UserCard from "./components/UserCard";
import {
  SearchSection,
  EmptyResultSection,
  LoadingSection,
  SearchText,
} from "./SearchPage.styled";

export interface UserData {
  /* 사용자 이름 */
  userName: string;
  /* 사용자 ID (accountname) */
  userId: string;
  /* 프로필 이미지 URL */
  userImage: string;
}

function SearchPage() {
  /* 검색 결과 목록 */
  const [searchResults, setSearchResults] = useState<UserData[]>([]);

  /* 로딩 상태 */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* 검색을 한 번이라도 수행했는지 여부 */
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // 사용자 검색 API 호출 함수
  // 실제 API 엔드포인트로 교체 필요

  const fetchUsers = async (keyword: string): Promise<UserData[]> => {
    // 실제 API 호출로 교체
    // const response = await fetch(`/api/user/search?keyword=${keyword}`);
    // const data = await response.json();
    // return data.users;

    // 임시: 테스트용
    // API 연동 전에는 빈 배열 반환
    console.log("검색 키워드:", keyword);
    return [];
  };

  //   검색 실행 함수
  //   Header 컴포넌트 수정 후 SearchInput의 onChange 이벤트에 연결 필요

  const handleSearch = async (keyword: string): Promise<void> => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await fetchUsers(keyword);
      setSearchResults(results);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <>
        <LoadingSection>
          <p>검색 중...</p>
        </LoadingSection>
      </>
    );
  }

  return (
    <>
      {/* 검색 헤더 */}

      <SearchSection>
        <h2 className="sr-only">검색 결과</h2>

        {/* 검색 결과가 있을 때 */}
        {searchResults.length > 0 && (
          <>
            {searchResults.map((user) => (
              <UserCard
                key={user.userId}
                userName={user.userName}
                userId={user.userId}
                userImage={user.userImage}
              />
            ))}
          </>
        )}

        {/* 검색을 했지만 결과가 없을 때 */}
        {hasSearched && searchResults.length === 0 && (
          <EmptyResultSection>
            <SearchText>
              앗, 찾으시는 계정이 아직 없나 봐요. 다른 이름으로 검색해 볼까요?
            </SearchText>
          </EmptyResultSection>
        )}

        {/* 아직 검색을 하지 않았을 때 */}
        {!hasSearched && (
          <EmptyResultSection>
            <SearchText>유저를 검색해주세요!</SearchText>
          </EmptyResultSection>
        )}
      </SearchSection>
    </>
  );
}

export default SearchPage;
