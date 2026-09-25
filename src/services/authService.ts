import { AUTH_ENDPOINTS } from '../constants';
import { ApiResponse, User, LoginCredentials, RegisterData } from '../types';
import { handleApiResponse, createApiError, validateApiResponse } from '../utils';
import proxyService from '../utils/proxyService';

/**
 * Authentication Service
 * Updated to use proxy service for automatic token handling
 */
export class AuthService {
  /**
   * Login user with proper API response handling
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const data = await proxyService.post(AUTH_ENDPOINTS.LOGIN, credentials);

      // Validate the response structure
      if (!validateApiResponse<User>(data)) {
        throw new Error('Invalid API response structure');
      }

      // Handle the response using utility function
      return handleApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  }

  /**
   * Register user with proper API response handling
   */
  async register(userData: RegisterData): Promise<User> {
    try {
      const data = await proxyService.post(AUTH_ENDPOINTS.REGISTER, userData);

      if (!validateApiResponse<User>(data)) {
        throw new Error('Invalid API response structure');
      }

      return handleApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<boolean> {
    try {
      const data = await proxyService.post(AUTH_ENDPOINTS.LOGOUT, {});

      if (!validateApiResponse<boolean>(data)) {
        throw new Error('Invalid API response structure');
      }

      return handleApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Logout failed');
    }
  }

  /**
   * Refresh user token
   */
  // async refreshToken(refreshToken: string): Promise<User> {
  //   try {
  //     const data = await proxyService.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });

  //     if (!validateApiResponse<User>(data)) {
  //       throw new Error('Invalid API response structure');
  //     }

  //     return handleApiResponse(data);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     }
  //     throw new Error('Token refresh failed');
  //   }
  // }

  /**
   * Verify user token
   */
  async verifyToken(): Promise<User> {
    try {
      const data = await proxyService.post(AUTH_ENDPOINTS.VERIFY_TOKEN, {});

      if (!validateApiResponse<User>(data)) {
        throw new Error('Invalid API response structure');
      }

      return handleApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const data = await proxyService.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });

      if (!validateApiResponse<{ message: string }>(data)) {
        throw new Error('Invalid API response structure');
      }

      return handleApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Forgot password request failed');
    }
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const data = await proxyService.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });

      if (!validateApiResponse<{ message: string }>(data)) {
        throw new Error('Invalid API response structure');
      }

      return handleApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Password reset failed');
    }
  }
}

// Export a default instance
export const authService = new AuthService();

