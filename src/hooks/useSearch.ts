import { useState, useRef, useEffect } from "react";

export interface UserData {
  userName: string;
  userId: string;
  userImage: string;
  isFollowing: boolean; // 팔로우 상태
}

// 더미 사용자 데이터 (API 연동 전까지 임시 사용)
const DUMMY_USERS: UserData[] = [
  {
    userName: "김수산",
    userId: "kim_fish",
    userImage: "/img/fish_profile.png",
    isFollowing: false,
  },
  {
    userName: "이해산",
    userId: "lee_seafood",
    userImage: "/img/fish_profile.png",
    isFollowing: true,
  },
  {
    userName: "박대구",
    userId: "park_codfish",
    userImage: "/img/fish_profile.png",
    isFollowing: false,
  },
  {
    userName: "최광어",
    userId: "choi_flatfish",
    userImage: "/img/fish_profile.png",
    isFollowing: true,
  },
  {
    userName: "정연어",
    userId: "jung_salmon",
    userImage: "/img/fish_profile.png",
    isFollowing: false,
  },
  {
    userName: "강고등어",
    userId: "kang_mackerel",
    userImage: "/img/fish_profile.png",
    isFollowing: false,
  },
  {
    userName: "조참치",
    userId: "cho_tuna",
    userImage: "/img/fish_profile.png",
    isFollowing: true,
  },
  {
    userName: "윤새우",
    userId: "yoon_shrimp",
    userImage: "/img/fish_profile.png",
    isFollowing: false,
  },
  {
    userName: "장게장",
    userId: "jang_crab",
    userImage: "/img/fish_profile.png",
    isFollowing: true,
  },
  {
    userName: "오징어마켓",
    userId: "squid_market",
    userImage: "/img/fish_profile.png",
    isFollowing: false,
  },
  {
    userName: "전복상회",
    userId: "abalone_shop",
    userImage: "/img/fish_profile.png",
    isFollowing: true,
  },
  {
    userName: "해산물왕",
    userId: "seafood_king",
    userImage: "/img/fish_profile.png",
    isFollowing: false,
  },
];

//  사용자 검색 커스텀 훅

// SearchPage에서 사용
//  const { searchResults, isLoading, currentKeyword, handleInputChange, inputValue } = useSearch();

// Header에서 사용 (검색 입력만)
//  const { handleInputChange, inputValue, isLoading } = useSearch();

export function useSearch() {
  /* 검색 결과 목록 */
  const [searchResults, setSearchResults] = useState<UserData[]>([]);

  /* 로딩 상태 */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* 검색을 한 번이라도 수행했는지 여부 */
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  /* 현재 검색 키워드 (하이라이팅용) */
  const [currentKeyword, setCurrentKeyword] = useState<string>("");

  /* 입력창 value 상태 (controlled input) */
  const [inputValue, setInputValue] = useState<string>("");

  /* 에러 상태 */
  const [error, setError] = useState<string | null>(null);

  /* 디바운스 타이머 ref */
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* 검색 요청 ID (race condition 방지) */
  const searchIdRef = useRef<number>(0);

  /* AbortController ref (이전 요청 중단용) */
  const abortControllerRef = useRef<AbortController | null>(null);

  // 사용자 검색 API 호출 함수

  const fetchUsers = async (
    keyword: string,
    requestId: number
  ): Promise<UserData[] | null> => {
    // 이전 요청 중단
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새로운 AbortController 생성
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // 실제 API 호출로 교체 (주석 해제 필요)
      // const response = await fetch(
      //   `${API_BASE_URL}/user/search?keyword=${encodeURIComponent(keyword)}`,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //     signal: controller.signal,
      //   }
      // );
      // if (!response.ok) throw new Error('검색 실패');
      // const data = await response.json();
      //
      // // Race condition 방지: 최신 요청만 반영
      // if (requestId !== searchIdRef.current) {
      //   return null;
      // }
      //
      // return data.users as UserData[];

      // 임시: 더미 데이터로 필터링 (API 연동 전까지 사용)
      if (!keyword || typeof keyword !== "string") {
        return [];
      }

      const lowerKeyword = keyword.toLowerCase().trim();

      const filteredUsers = DUMMY_USERS.filter((user) => {
        const userName =
          user.userName && typeof user.userName === "string"
            ? user.userName.toLowerCase()
            : "";
        const userId =
          user.userId && typeof user.userId === "string"
            ? user.userId.toLowerCase()
            : "";

        return (
          userName.includes(lowerKeyword) || userId.includes(lowerKeyword)
        );
      });

      // API 응답 시뮬레이션 (로딩 효과)
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Race condition 방지: 최신 요청만 반영
      if (requestId !== searchIdRef.current) {
        return null;
      }

      return filteredUsers;
    } catch (error) {
      // AbortError는 정상적인 중단이므로 무시
      if (error instanceof Error && error.name === "AbortError") {
        return null;
      }
      throw error;
    }
  };

  // 실제 검색 실행 함수 (디바운스 후 호출됨)

  const performSearch = async (keyword: string): Promise<void> => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setCurrentKeyword("");
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setCurrentKeyword(keyword.trim());
    setError(null); // 새 검색 시작 시 에러 초기화

    // 새로운 검색 요청 ID 생성
    searchIdRef.current += 1;
    const currentRequestId = searchIdRef.current;

    try {
      const results = await fetchUsers(keyword, currentRequestId);

      // null이면 이전 요청이므로 무시
      if (results === null) {
        return;
      }

      setSearchResults(results);
      setError(null);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setSearchResults([]);
      setError("검색 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 디바운스가 적용된 검색 입력 핸들러
  // 사용자가 입력을 멈춘 후 300ms 후에 검색 실행

  const handleInputChange = (value: string) => {
    // 입력값 즉시 업데이트 (controlled input)
    setInputValue(value);

    // 공백만 입력된 경우 즉시 초기화
    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setCurrentKeyword("");
      setIsLoading(false);
      setError(null);
      // 이전 타이머 취소
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    // 최소 길이 검증 (2자 미만일 경우 서버 호출하지 않음)
    if (value.trim().length < 2) {
      // UI는 즉시 반영하지만 서버 호출은 보류
      setSearchResults([]);
      setHasSearched(false);
      setIsLoading(false);
      setError(null);
      // 이전 타이머 취소
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    // 이전 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 새 타이머 설정 (300ms 후 검색 실행)
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // 입력창 초기화 함수

  const clearSearch = () => {
    setInputValue("");
    setSearchResults([]);
    setHasSearched(false);
    setCurrentKeyword("");
    setIsLoading(false);
    setError(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  };

  // 언마운트 시 타이머 정리 및 요청 중단
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // 상태
    searchResults,
    isLoading,
    hasSearched,
    currentKeyword,
    inputValue,
    error,
    // 함수
    handleInputChange,
    clearSearch,
  };
}
