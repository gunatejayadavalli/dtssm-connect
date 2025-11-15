import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  
  // Clear the authentication token
  cookieStore.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  // Redirect to the login page
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect') || '/login';
  
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
