import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequestCookies, getPermissionsFromCookie } from '@/utils/cookieUtils';

export async function GET(request: NextRequest) {
  try {
    // Use the enhanced cookie utilities with double decoding
    const user: any = await getUserFromRequestCookies();
    
    if (!user) {
      console.log('No user found in cookies');
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get permissions separately and add to user
    const permissions = await getPermissionsFromCookie();
    user.permissions = permissions;
    
    return NextResponse.json({ 
      success: true, 
      user 
    });
  } catch (error) {
   
    return NextResponse.json(
      { success: false, message: 'Failed to get user data' },
      { status: 500 }
    );
  }
}
