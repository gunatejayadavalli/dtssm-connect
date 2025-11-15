import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // In a real app, you would validate the user's credentials here.
  // For this mock implementation, we'll just set a cookie.
  
  const cookieStore = cookies();
  
  // Set a mock authentication token
  cookieStore.set('auth_token', 'mock_user_logged_in', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return NextResponse.json({ success: true, message: 'Logged in successfully' });
}
