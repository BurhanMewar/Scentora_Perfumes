// Common API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  result: T;
  message: string;
  statusCode: number;
}

// Generic API Response with specific result type
export type ApiResult<T> = ApiResponse<T>;

// Common Error Response
export interface ApiErrorResponse {
  success: false;
  result: null;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Success Response Helper
export type ApiSuccessResponse<T> = ApiResponse<T> & {
  success: true;
};

// Pagination Response (for list endpoints)
export interface PaginatedResult<T> {
  result: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Paginated API Response
export type PaginatedApiResponse<T> = ApiResponse<PaginatedResult<T>>;

// Common HTTP Status Response
export interface HttpStatusResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

// API Response Status Codes
export enum ApiStatusCodes {
  SUCCESS = 0,
  VALIDATION_ERROR = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

// Helper type for API responses that might be paginated
export type ApiResponseOrPaginated<T> = ApiResponse<T> | PaginatedApiResponse<T>;

// Utility type to extract result type from API response
export type ExtractApiResult<T> = T extends ApiResponse<infer R> ? R : never;

// User interface for authentication
export interface User {
  userId: number;
  userName: string;
  emailAddress: string;
  phoneNumber: string;
  fullName: string;
  isActive: boolean;
  recordStatus: number;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  balance: number;
  isWallet: boolean;
}

// Login credentials interface
export interface LoginCredentials {
  Username: string;
  Password: string;
}

// Register data interface
export interface RegisterData {
  userName: string;
  emailAddress: string;
  phoneNumber: string;
  countryCode?: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}
