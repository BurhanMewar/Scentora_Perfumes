import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, AUTH_ENDPOINTS } from '@/constants/apiConstants';
import { setUserHttpOnlyCookies, clearUserHttpOnlyCookies } from '@/utils/cookieUtils';

// export async function GET(request: NextRequest) {
//   try {
//     const url = new URL(request.url);
//     // const refreshToken = url.searchParams.get('refreshToken');
//     const redirectPath = url.searchParams.get('redirect') || '/';
    
//     // if (!refreshToken) {
//     //   console.log('❌ No refresh token provided in GET request');
//     //   return NextResponse.redirect(new URL('/auth/login', request.url));
//     // }
    
//     console.log('🔄 Processing refresh token via GET request');
    
//     // Call the backend refresh token endpoint
//     // const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify({ refreshToken }),
//     // });
    
//     // const responseText = await response.text();
    
//     let result;
//     try {
//       // result = JSON.parse(responseText);
//     } catch (parseError) {
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }
    
    
//     if (result.success) {
//       console.log('Backend API success, clearing old cookies and updating with new data...');
      
//       // Clear all existing cookies first to ensure no old data remains
//       try {
//         await clearUserHttpOnlyCookies();
//         console.log('Old cookies cleared successfully');
//       } catch (clearError) {
//         console.error('Error clearing old cookies:', clearError);
//         // Continue with setting new cookies even if clearing fails
//       }
      
//       // Update cookies with new token data using the same utility as AuthSlice
//       try {
//         await setUserHttpOnlyCookies(result.result);
//         console.log('New cookies set successfully');
//       } catch (cookieError) {
//         console.error('Failed to update cookies after token refresh:', cookieError);
//         // Continue with the response even if cookie setting fails
//       }
      
//       return NextResponse.redirect(new URL(redirectPath, request.url));
//     }
    
//     console.log('Backend API returned success: false');
//     return NextResponse.redirect(new URL('/auth/login', request.url));
    
//   } catch (error) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // const { refreshToken } = body;

    // console.log('Refresh token API called with:', { refreshToken: refreshToken ? 'present' : 'missing' });

    // if (!refreshToken) {
    //   console.log('No refresh token provided');
    //   return NextResponse.json(
    //     { success: false, message: 'Refresh token is required' },
    //     { status: 400 }
    //   );
    // }

    console.log('Calling backend API:', `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`);

    // Call the backend API to refresh the token
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log('Backend API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Backend API error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Token refresh failed', error: errorText },
        { status: response.status }
      );
    }

    // First, let's see the raw response text
    const responseText = await response.text();
    console.log('Backend API raw response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Backend API parsed response:', result);
    } catch (parseError) {
      console.error('Failed to parse backend response as JSON:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid response format from backend', rawResponse: responseText },
        { status: 400 }
      );
    }

    if (result.success) {
      console.log('Backend API success, clearing old cookies and updating with new data...');
      
      // Clear all existing cookies first to ensure no old data remains
      try {
        await clearUserHttpOnlyCookies();
        console.log('Old cookies cleared successfully');
      } catch (clearError) {
        console.error('Error clearing old cookies:', clearError);
        // Continue with setting new cookies even if clearing fails
      }
      
      // Update cookies with new token data using the same utility as AuthSlice
      try {
        await setUserHttpOnlyCookies(result.result);
        console.log('New cookies set successfully');
      } catch (cookieError) {
        console.error('Failed to update cookies after token refresh:', cookieError);
        // Continue with the response even if cookie setting fails
      }

      return NextResponse.json({
        success: true,
        result: result.result,
      });
    }

    console.log('Backend API returned success: false');
    return NextResponse.json(
      { success: false, message: 'Failed to refresh token', backendResponse: result },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in refresh token API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
