import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL, AUTH_ENDPOINTS } from '@/constants/apiConstants';
import { COOKIE_NAMES } from '@/utils/cookieConstants';
import { clearUserHttpOnlyCookies, setUserHttpOnlyCookies } from '@/utils/cookieUtils';

// Global token refresh lock to prevent multiple concurrent refresh attempts
let refreshPromise: Promise<any> | null = null;
let lastRefreshTime: number = 0;
let refreshAttempts: number = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds cooldown between refresh attempts
const MAX_REFRESH_ATTEMPTS = 3; // Maximum refresh attempts before forcing re-login
const REFRESH_TIMEOUT = 100000; // 10 seconds timeout for refresh requests

// Function to reset refresh state
function resetRefreshState() {
  refreshPromise = null;
  refreshAttempts = 0;
  lastRefreshTime = 0;
}

// Function to perform token refresh
async function performTokenRefresh(refreshToken: string): Promise<any> {
  try {
    // Validate refresh token before making request
    if (!refreshToken || refreshToken.trim().length === 0) {
      return { success: false, error: 'Invalid refresh token: empty or null' };
    }
    
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Refresh request timeout')), REFRESH_TIMEOUT);
    });
    
    // Race between fetch and timeout
    const refreshResponse = await Promise.race([
      fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      }),
      timeoutPromise
    ]);
    
    if (!refreshResponse.ok) {
      const errorText = await refreshResponse.text();
      return { success: false, error: `Token refresh failed: ${refreshResponse.status}` };
    }
    
    const refreshResult = await refreshResponse.json();
    
    if (refreshResult.success) {
      // Reset refresh attempts on successful refresh
      refreshAttempts = 0;
      
      // Update cookies with new token data
      try {
        await clearUserHttpOnlyCookies();
        
        // Fix: If refreshTokenExpiry is missing, calculate a new one (7 days from now)
        const cookieData = { ...refreshResult.result };
        if (!cookieData.refreshTokenExpiry) {
          const newExpiryDate = new Date();
          newExpiryDate.setDate(newExpiryDate.getDate() + 7); // 7 days from now
          cookieData.refreshTokenExpiry = newExpiryDate.toISOString();
        }
        
        await setUserHttpOnlyCookies(cookieData);
      } catch (cookieError) {
        // Continue with the response even if cookie setting fails
      }
      
      return refreshResult;
    } else {
      // Increment refresh attempts
      refreshAttempts++;
      
      // CRITICAL FIX: If refresh token is invalid, clear all cookies to force re-login
      if (refreshResult.message === 'Invalid refresh token' || refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        try {
          await clearUserHttpOnlyCookies();
          // Reset attempts after clearing cookies
          refreshAttempts = 0;
        } catch (clearError) {
          // Ignore clear errors
        }
      }
      
      return { success: false, error: 'Token refresh failed: Invalid response' };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the original request details
    const requestData = await request.json();
    const { url, method, headers = {}, body, params } = requestData;
    
    // Skip token validation for login requests
    const isLoginRequest = url.includes(AUTH_ENDPOINTS.LOGIN || AUTH_ENDPOINTS.REFRESH_TOKEN);
    
    
    if (isLoginRequest) {
      return makeDirectBackendRequest(url, method, headers, body, params);
    }
    
    // Get cookies and validate tokens
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
    const refreshTokenExpiry = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN_EXPIRY)?.value;
    
    // Check if refresh token is expired
    let isRefreshTokenExpired = false;
    if (refreshTokenExpiry) {
      try {
        const expiryDate = new Date(refreshTokenExpiry);
        const currentTime = new Date().getTime();
        const expiryTime = expiryDate.getTime();
        
        if (isNaN(expiryDate.getTime()) || currentTime > expiryTime) {
          isRefreshTokenExpired = true;
        }
      } catch (error) {
        isRefreshTokenExpired = true;
      }
    } else {
      isRefreshTokenExpired = true;
    }
    
    // If refresh token is expired, refresh the access token
    if (isRefreshTokenExpired) {
      const currentTime = Date.now();
      const timeSinceLastRefresh = currentTime - lastRefreshTime;
      
      // Check if we've exceeded maximum refresh attempts
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        try {
          await clearUserHttpOnlyCookies();
          refreshAttempts = 0;
        } catch (clearError) {
          // Ignore clear errors
        }
        
        // Return response to trigger client-side redirect
        return NextResponse.json(
          { 
            success: false, 
            message: 'Session expired - redirecting to login',
            statusCode: 401,
            redirectToLogin: true
          },
          { status: 401 }
        );
      }
      
      // Check if refresh is already in progress or if we're in cooldown period
      if (!refreshPromise && refreshToken && timeSinceLastRefresh > REFRESH_COOLDOWN) {
        lastRefreshTime = currentTime;
        refreshPromise = performTokenRefresh(refreshToken);
      } else if (refreshPromise) {
        // Wait for existing refresh
      } else if (timeSinceLastRefresh <= REFRESH_COOLDOWN) {
        // Return error to force re-login if refresh is failing repeatedly
        try {
          await clearUserHttpOnlyCookies();
        } catch (clearError) {
          // Ignore clear errors
        }
        
        // Return response to trigger client-side redirect
        return NextResponse.json(
          { 
            success: false, 
            message: 'Session expired - redirecting to login',
            statusCode: 401,
            redirectToLogin: true
          },
          { status: 401 }
        );
      } else {
        // Return response to trigger client-side redirect
        return NextResponse.json(
          { 
            success: false, 
            message: 'No refresh token available - redirecting to login',
            statusCode: 401,
            redirectToLogin: true
          },
          { status: 401 }
        );
      }
    } else {
      // Refresh token is valid, use existing access token
      if (!accessToken) {
        // Return response to trigger client-side redirect
        return NextResponse.json(
          { 
            success: false, 
            message: 'No access token available - redirecting to login',
            statusCode: 401,
            redirectToLogin: true
          },
          { status: 401 }
        );
      }
      
      // Make the backend request with existing access token
      const authenticatedHeaders = {
        ...headers,
        'Authorization': `Bearer ${accessToken}`,
      };
      
      return makeDirectBackendRequest(url, method, authenticatedHeaders, body, params);
    }
    
    // Only handle refresh case (when isRefreshTokenExpired is true)
    if (isRefreshTokenExpired) {
      try {
        const refreshResult = await refreshPromise;
        resetRefreshState(); // Reset all refresh state after completion
        
        if (!refreshResult.success) {
          // If refresh token is invalid, redirect to login page
          if (refreshResult.error && refreshResult.error.includes('Invalid refresh token')) {
            try {
              await clearUserHttpOnlyCookies();
            } catch (clearError) {
              // Ignore clear errors
            }
            
            return NextResponse.json(
              { 
                success: false, 
                message: 'Session expired - please login again',
                statusCode: 401,
                redirectToLogin: true
              },
              { status: 401 }
            );
          }
          
          // Return response to trigger client-side redirect
          return NextResponse.json(
            { 
              success: false, 
              message: 'Token refresh failed - redirecting to login',
              statusCode: 401,
              redirectToLogin: true
            },
            { status: 401 }
          );
        }
        
        // Get the new access token
        const newAccessToken = refreshResult.result?.accessToken;
        
        
        if (!newAccessToken) {
          try {
            await clearUserHttpOnlyCookies();
          } catch (clearError) {
            // Ignore clear errors
          }
          
          return NextResponse.json(
            { 
              success: false, 
              message: 'Session expired - please login again',
              statusCode: 401,
              redirectToLogin: true
            },
            { status: 401 }
          );
        }
        
        // Make the original backend request with new access token
        const authenticatedHeaders = {
          ...headers,
          'Authorization': `Bearer ${newAccessToken}`,
        };
        
        return makeDirectBackendRequest(url, method, authenticatedHeaders, body, params);
        
      } catch (refreshError) {
        resetRefreshState(); // Reset all refresh state on error
        
        // If refresh error indicates invalid token, redirect to login
        const errorMessage = refreshError instanceof Error ? refreshError.message : String(refreshError);
        if (errorMessage.includes('Invalid refresh token') || errorMessage.includes('Token refresh failed: Invalid response')) {
          try {
            await clearUserHttpOnlyCookies();
          } catch (clearError) {
            // Ignore clear errors
          }
          
          return NextResponse.json(
            { 
              success: false, 
              message: 'Session expired - please login again',
              statusCode: 401,
              redirectToLogin: true
            },
            { status: 401 }
          );
        }
        
        // Return response to trigger client-side redirect
        return NextResponse.json(
          { 
            success: false, 
            message: 'Token refresh failed - redirecting to login',
            statusCode: 401,
            redirectToLogin: true
          },
          { status: 401 }
        );
      }
    }
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 500 
      },
      { status: 500 }
    );
  }
}

async function makeDirectBackendRequest(
  url: string, 
  method: string, 
  headers: Record<string, string>, 
  body?: any, 
  params?: Record<string, string>
): Promise<NextResponse> {
  try {
    // Build the full URL with query parameters
    let fullUrl = url;
   if (params) {
      const urlObj = new URL(fullUrl);
      Object.entries(params).forEach(([key, value]) => {
        urlObj.searchParams.set(key, value);
      });
      fullUrl = urlObj.toString();
    }
    
    // Make the actual backend request
    const backendResponse = await fetch(fullUrl, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      // If it's a 401 error, redirect directly to login page
      if (backendResponse.status === 401) {
        try {
          await clearUserHttpOnlyCookies();
        } catch (clearError) {
          // Ignore clear errors
        }
        
        // Return response to trigger client-side redirect
        return NextResponse.json(
          { 
            success: false, 
            message: 'Session expired - redirecting to login',
            statusCode: 401,
            redirectToLogin: true
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Backend request failed: ${backendResponse.status}`,
          error: errorText,
          statusCode: backendResponse.status 
        },
        { status: backendResponse.status }
      );
    }
    const responseData = await backendResponse.json();
    
    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 500 
      },
      { status: 500 }
    );
  }
}
