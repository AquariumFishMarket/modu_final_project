// API 응답 공통 타입 정의

/**
 * 기본 API 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * 페이지네이션이 포함된 API 응답 타입
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
  message?: string;
  error?: string;
}

/**
 * 에러 응답 타입
 */
export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
}

/**
 * API 요청 옵션
 */
export interface ApiRequestOptions extends RequestInit {
  useAuth?: boolean; // 인증 헤더 자동 추가 여부
  timeout?: number; // 타임아웃 (ms)
}
