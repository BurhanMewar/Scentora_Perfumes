import { ApiResponse, ApiStatusCodes, ApiErrorResponse } from '../types';

/**
 * Type guard to check if an API response is successful
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true } {
  return response.success === true && response.statusCode === ApiStatusCodes.SUCCESS;
}

/**
 * Type guard to check if an API response is an error
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: false; result: null } {
  return response.success === false || response.statusCode !== ApiStatusCodes.SUCCESS;
}

/**
 * Extract the result from a successful API response
 */
export function extractApiResult<T>(response: ApiResponse<T>): T {
  if (isApiSuccess(response)) {
    return response.result;
  }
  throw new Error(response.message || 'API request failed');
}

/**
 * Handle API response and return result or throw error
 */
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (isApiSuccess(response)) {
    return response.result;
  }
  
  const errorMessage = response.message || 'API request failed';
  const error = new Error(errorMessage);
  (error as any).statusCode = response.statusCode;
  (error as any).apiResponse = response;
  
  throw error;
}

/**
 * Create a standardized error response
 */
export function createApiError(
  message: string, 
  statusCode: number = ApiStatusCodes.INTERNAL_SERVER_ERROR,
  errors?: Record<string, string[]>
): ApiErrorResponse {
  return {
    success: false,
    result: null,
    message,
    statusCode,
    errors,
  };
}

/**
 * Create a standardized success response
 */
export function createApiSuccess<T>(result: T, message: string = 'Success'): ApiResponse<T> {
  return {
    success: true,
    result,
    message,
    statusCode: ApiStatusCodes.SUCCESS,
  };
}

/**
 * Check if an API response has pagination
 */
export function hasPagination<T>(response: ApiResponse<T>): boolean {
  return response.result && 
         typeof response.result === 'object' && 
         'items' in response.result && 
         'totalCount' in response.result;
}

/**
 * Get pagination info from a paginated response
 */
export function getPaginationInfo<T>(response: ApiResponse<T>) {
  if (hasPagination(response)) {
    const paginatedResult = response.result as any;
    return {
      items: paginatedResult.items,
      totalCount: paginatedResult.totalCount,
      pageNumber: paginatedResult.pageNumber,
      pageSize: paginatedResult.pageSize,
      totalPages: paginatedResult.totalPages,
      hasPreviousPage: paginatedResult.hasPreviousPage,
      hasNextPage: paginatedResult.hasNextPage,
    };
  }
  return null;
}

/**
 * Validate API response structure
 */
export function validateApiResponse<T>(response: any): response is ApiResponse<T> {
  return (
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'result' in response &&
    'message' in response &&
    'statusCode' in response
  );
}
