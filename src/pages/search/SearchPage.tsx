import UserCard from "./components/UserCard";
import {
  SearchSection,
  EmptyResultSection,
  SearchText,
} from "./SearchPage.styled";
import { useSearchContext } from "../../contexts/SearchContext";
import { toggleFollow } from "../../services/followService";

function SearchPage() {
  // Context에서 검색 상태 가져오기
  const { searchResults, isLoading, hasSearched, currentKeyword, error } =
    useSearchContext();

  // 팔로우/언팔로우 처리
  const handleFollowToggle = async (accountname: string, isFollowing: boolean) => {
    try {
      await toggleFollow(accountname, isFollowing);
    } catch (error) {
      console.error("팔로우 처리 실패:", error);
    }
  };

  return (
    <>
      <SearchSection>
        <h2 className="sr-only">검색 결과</h2>

        {/* 로딩 중일 때 */}
        {isLoading && (
          <EmptyResultSection>
            <SearchText>검색 중입니다...</SearchText>
          </EmptyResultSection>
        )}

        {/* 에러가 발생했을 때 */}
        {!isLoading && error && (
          <EmptyResultSection>
            <SearchText>{error}</SearchText>
          </EmptyResultSection>
        )}

        {/* 검색 결과가 있을 때 */}
        {!isLoading && !error && searchResults.length > 0 && (
          <>
            {searchResults.map((user) => (
              <UserCard
                key={user._id}
                userName={user.username}
                userId={user.accountname}
                userImage={user.image}
                searchKeyword={currentKeyword}
                isFollowing={user.isfollow}
                onFollowToggle={() => handleFollowToggle(user.accountname, user.isfollow)}
              />
            ))}
          </>
        )}

        {/* 검색을 했지만 결과가 없을 때 */}
        {!isLoading && !error && hasSearched && searchResults.length === 0 && (
          <EmptyResultSection>
            <SearchText>
              앗, 찾으시는 계정이 아직 없나 봐요. 다른 이름으로 검색해 볼까요?
            </SearchText>
          </EmptyResultSection>
        )}

        {/* 아직 검색을 하지 않았을 때 */}
        {!isLoading && !error && !hasSearched && (
          <EmptyResultSection>
            <SearchText>유저를 검색해주세요!</SearchText>
          </EmptyResultSection>
        )}
      </SearchSection>
    </>
  );
}

export default SearchPage;
