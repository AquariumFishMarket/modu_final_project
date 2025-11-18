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
    // 이전 요청 중단
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const headers = getAuthHeaders();

      // 토큰 없으면 로그인 필요
      if (!headers || !("Authorization" in headers)) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(
        `${API_BASE_URL}/user/searchuser/?keyword=${encodeURIComponent(
          keyword
        )}`,
        {
          headers,
          signal: controller.signal,
        }
      );

      // 최신 요청이 아니면 무시
      if (requestId !== searchIdRef.current) return null;

      // 에러 응답 미리 파싱
      const errData = await response
        .clone()
        .json()
        .catch(() => ({} as any));

      const rawMessage: string =
        errData?.message ||
        errData?.error ||
        (Array.isArray(errData?.errors) ? errData.errors[0] : "") ||
        "";

      // 서버 응답 에러 처리
      if (!response.ok) {
        const msg = rawMessage || "검색 실패";

        // 토큰 없음
        if (msg.includes("토큰이 없습니다") || response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        }

        // 검색 결과 없음
        if (
          msg.includes("사용자를 찾을 수 없") ||
          msg.includes("User not found") ||
          msg.includes("검색 결과가 없습니다") ||
          response.status === 404
        ) {
          return [];
        }

        // 그 외 진짜 에러만 throw
        throw new Error(msg);
      }

      const data = await response.json();

      if (Array.isArray(data)) return data;
      if (data.users && Array.isArray(data.users)) return data.users;

      return [];
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return null;
      }
      throw err;
    }
  };

  // 실제 검색 실행
  const performSearch = async (keyword: string) => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      setSearchResults([]);
      setHasSearched(false);
      setCurrentKeyword("");
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setCurrentKeyword(trimmed);
    setError(null);

    searchIdRef.current += 1;
    const currentRequestId = searchIdRef.current;

    try {
      const results = await fetchUsers(trimmed, currentRequestId);

      // 중단된 요청
      if (results === null) return;

      // 자기 자신 제외
      const filtered = results.filter((user) => user._id !== currentUser?._id);
      setSearchResults(filtered);
    } catch (err) {
      console.error("검색 중 오류:", err);

      if (err instanceof Error && err.message === "로그인이 필요합니다.") {
        setError("검색 기능은 로그인 후 이용할 수 있습니다.");
      } else {
        setError("검색 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }

      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 입력값 + 디바운스
  const handleInputChange = (value: string) => {
    setInputValue(value);

    const trimmed = value.trim();

    // 2글자 미만이면 검색 안 함
    if (!trimmed || trimmed.length < 2) {
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
      performSearch(trimmed);
    }, 300);
  };

  // 초기화
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
