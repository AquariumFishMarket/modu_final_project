import { useState, useRef, useEffect } from "react";
import { getAuthHeaders } from "../utils/tokenManager";
import { useAuth } from "../contexts/AuthContext"; // 🔥 추가

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// API 응답 형식
export interface UserData {
  _id: string;
  username: string;
  accountname: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: string[];
  follower: string[];
  followerCount: number;
  followingCount: number;
}

// 사용자 검색 커스텀 훅
export function useSearch() {
  const { currentUser } = useAuth(); // 🔥 로그인한 내 정보 추가

  /* 검색 결과 목록 */
  const [searchResults, setSearchResults] = useState<UserData[]>([]);

  /* 로딩 상태 */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* 검색을 한 번이라도 수행했는지 여부 */
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  /* 현재 검색 키워드 */
  const [currentKeyword, setCurrentKeyword] = useState<string>("");

  /* 입력창 value 상태 */
  const [inputValue, setInputValue] = useState<string>("");

  /* 에러 상태 */
  const [error, setError] = useState<string | null>(null);

  /* 디바운스 타이머 */
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* 검색 요청 ID */
  const searchIdRef = useRef<number>(0);

  /* AbortController (요청 중단용) */
  const abortControllerRef = useRef<AbortController | null>(null);

  // 검색 API 호출 함수
  const fetchUsers = async (
    keyword: string,
    requestId: number
  ): Promise<UserData[] | null> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(
        `${API_BASE_URL}/user/searchuser/?keyword=${encodeURIComponent(
          keyword
        )}`,
        {
          headers: getAuthHeaders(),
          signal: controller.signal,
        }
      );

      if (requestId !== searchIdRef.current) return null;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "검색 실패");
      }

      const data = await response.json();

      if (Array.isArray(data)) return data as UserData[];
      if (data.users && Array.isArray(data.users))
        return data.users as UserData[];

      console.error("예상치 못한 API 응답 형식:", data);
      return [];
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return null;
      throw error;
    }
  };

  // 🔥 실제 검색 실행 함수 (여기에 내 계정 제외 로직 포함)
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
    setError(null);

    searchIdRef.current += 1;
    const currentRequestId = searchIdRef.current;

    try {
      const results = await fetchUsers(keyword, currentRequestId);

      if (results === null) return;

      // 🔥 여기에서 내 계정 제외 필터링
      const filtered = results.filter((user) => user._id !== currentUser?._id);

      setSearchResults(filtered);
      setError(null);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setSearchResults([]);
      setError("검색 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 입력 핸들러 (디바운스 포함)
  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setCurrentKeyword("");
      setIsLoading(false);
      setError(null);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    if (value.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      setIsLoading(false);
      setError(null);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // 입력값 초기화
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

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return {
    searchResults,
    isLoading,
    hasSearched,
    currentKeyword,
    inputValue,
    error,
    handleInputChange,
    clearSearch,
  };
}
