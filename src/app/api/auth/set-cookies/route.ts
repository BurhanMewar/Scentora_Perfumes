import { NextRequest, NextResponse } from 'next/server';
import { setUserHttpOnlyCookies } from '@/utils/cookieUtils';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // Validate required user data
    if (!userData || !userData.accessToken || !userData.userId) {
      console.log('Missing required fields in userData');
      return NextResponse.json(
        { success: false, message: 'Invalid user data provided' },
        { status: 400 }
      );
    }
    
    // Use the enhanced cookie utilities with double encoding
    await setUserHttpOnlyCookies(userData);
 
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cookies set successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to set cookies' },
      { status: 500 }
    );
  }
}
