import { useState, useRef, useEffect } from "react";
import { getAuthHeaders } from "../utils/tokenManager";
import { useAuthStore } from "../contexts/useAuthStore";

const API_BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

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

export function useSearch() {
  const currentUser = useAuthStore((s) => s.user);

  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [currentKeyword, setCurrentKeyword] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 검색 API 요청
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

      // 최신 요청만 처리
      if (requestId !== searchIdRef.current) return null;

      const errData = await response
        .clone()
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        // 서버가 빈 결과도 오류로 보내는 경우 처리
        if (
          errData?.message === "검색 결과가 없습니다" ||
          errData?.message === "User not found" ||
          errData?.message === "사용자를 찾을 수 없습니다"
        ) {
          return [];
        }

        throw new Error(errData?.message || "검색 실패");
      }

      const data = await response.json();

      // 배열로 오는 경우
      if (Array.isArray(data)) return data;

      if (data.users && Array.isArray(data.users)) return data.users;

      console.warn("예기치 않은 응답:", data);
      return [];
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return null;
      }
      throw error;
    }
  };

  // 검색 실행
  const performSearch = async (keyword: string) => {
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

      if (Array.isArray(results) && results.length === 0) {
        setSearchResults([]);
        setError(null);
        return;
      }

      const filtered = results.filter((user) => user._id !== currentUser?._id);

      setSearchResults(filtered);
      setError(null);
    } catch (err) {
      console.error("검색 중 오류:", err);
      setError("검색 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 입력 + 디바운싱 처리
  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (!value.trim() || value.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      setIsLoading(false);
      setCurrentKeyword("");
      setError(null);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // 검색 초기화
  const clearSearch = () => {
    setInputValue("");
    setSearchResults([]);
    setHasSearched(false);
    setCurrentKeyword("");
    setIsLoading(false);
    setError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  // 언마운트 정리
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
