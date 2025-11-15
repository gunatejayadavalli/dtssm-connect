import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;
 
  const isPublicPage = [
    '/login',
    '/register',
    '/awaiting-approval'
  ].includes(pathname);

  // Allow requests for static files, API routes, and special Next.js paths
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }
 
  // If user is authenticated
  if (authToken) {
    // And they are trying to access a public page (like /login), redirect them to /home
    if (isPublicPage) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    // Otherwise, let them proceed
    return NextResponse.next();
  }
 
  // If user is not authenticated and not on a public page, redirect to login
  if (!authToken && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  // If user is not authenticated but is on a public page, let them proceed
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
