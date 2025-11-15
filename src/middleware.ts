import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;
 
  // Allow requests for static files, API routes, and public pages to pass through
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/awaiting-approval' ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }
 
  if (!authToken) {
    // Redirect to login if no auth token is found and the page is not public
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  // If the user is authenticated and trying to access login/register, redirect to home
  if (authToken && (pathname === '/login' || pathname === '/register')) {
     return NextResponse.redirect(new URL('/home', request.url));
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
