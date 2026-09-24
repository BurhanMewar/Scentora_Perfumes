import { NextRequest, NextResponse } from 'next/server';
import { getPermissionsFromCookie, getCookieFromRequest } from '@/utils/cookieUtils';
import { COOKIE_NAMES } from '@/utils/cookieConstants';

export async function GET(request: NextRequest) {
  try {
    
    // Check if this is an internal request from middleware
    const isInternalRequest = request.headers.get('X-Internal-Request') === 'middleware';
    console.log('Get-permissions API called', isInternalRequest ? '(internal from middleware)' : '(external)');
    
    // Get required cookie values using proper Next.js cookie utilities
    const userId = await getCookieFromRequest(COOKIE_NAMES.USER_ID);
    const accessToken = await getCookieFromRequest(COOKIE_NAMES.ACCESS_TOKEN);
    
   
    if (!userId || !accessToken) {
      console.log('Missing required cookies: userId or accessToken');
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get permissions using the proper cookie utility
    const permissions = await getPermissionsFromCookie();
    
    return NextResponse.json({ 
      success: true, 
      permissions: permissions,
      userId: parseInt(userId)
    });
  } catch (error) {
    console.error('Error getting permissions from cookies:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get permissions data' },
      { status: 500 }
    );
  }
}
