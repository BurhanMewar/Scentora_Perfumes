import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Cookies cleared successfully' 
    });
    
    // Clear all cookies by setting them to expire immediately
    const cookieNames = [
      'user_id', 'user_name', 'email', 'phone', 'full_name', "role_id",
      'access_token', 'refresh_token', 'refresh_token_expiry', 
      'balance', 'is_wallet', 'is_authenticated', 'record_status', 
      'is_active', 'created_by', 'created_date', 'updated_by', 'updated_date',
      'currency_code', 'permissions'
    ];
    
    cookieNames.forEach(name => {
      response.cookies.set(name, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
      
    });
    
   
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to clear cookies' },
      { status: 500 }
    );
  }
}

