import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rate limiting: Server Actions POST to the page URL with a Next-Action header
  // This correctly intercepts login attempts before the server action runs.
  const isLoginAction =
    pathname === '/login' &&
    request.method === 'POST' &&
    !!request.headers.get('next-action');

  if (isLoginAction) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 },
      );
    }
  }

  const isAuthenticated = request.cookies.has('sid');

  // Protected routes
  const protectedRoutes = ['/beranda', '/drama', '/anime', '/movies', '/manga', '/favorites', '/profile'];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // If accessing protected route, check authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login/register while already authenticated, redirect to home
  if ((pathname === '/login' || pathname === '/register') && isAuthenticated) {
    return NextResponse.redirect(new URL('/beranda', request.url));
  }

  // If accessing onboarding while already authenticated, redirect to home
  if (pathname === '/onboarding' && isAuthenticated) {
    return NextResponse.redirect(new URL('/beranda', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
