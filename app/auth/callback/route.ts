import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Google OAuth Callback Handler (Frontend Callback Mode)
 *
 * Route: /auth/callback
 * Method: GET
 * Query params: code (from Google), state (from Google)
 *
 * Flow:
 * 1. Receive code & state from Google OAuth
 * 2. Exchange with backend API via POST /auth/google/exchange
 * 3. Backend returns user data + Set-Cookie header
 * 4. Sync cookie to frontend domain
 * 5. Redirect to beranda
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');


  let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl || (baseUrl.includes('localhost') && !request.nextUrl.origin.includes('localhost'))) {
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || (forwardedHost?.includes('localhost') ? 'http' : 'https');
    baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin;
  }
  if (!baseUrl) baseUrl = request.nextUrl.origin;

  // Handle user denial or OAuth error
  if (error) {
    const errorMessages: Record<string, string> = {
      access_denied: 'Anda membatalkan login dengan Google',
    };
    const errorMessage = errorMessages[error] || `OAuth Error: ${error}`;
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, baseUrl),
    );
  }

  // Missing code is invalid
  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=missing_code', baseUrl),
    );
  }

  try {
    const apiBaseUrl = process.env.API_BASE_URL;
    const callbackUrl = `${baseUrl}/auth/callback`;


    // Exchange code with backend
    const exchangeResponse = await fetch(`${apiBaseUrl}/auth/google/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirect_uri: callbackUrl,
      }),
    });

    if (!exchangeResponse.ok) {
      const errorText = await exchangeResponse.text();
      return NextResponse.redirect(
        new URL('/login?error=exchange_failed', baseUrl),
      );
    }

    const result = await exchangeResponse.json();

    // Check if backend sent Set-Cookie header
    const setCookieHeader = exchangeResponse.headers.get('set-cookie');

    if (setCookieHeader) {
      // Extract sid from Set-Cookie header
      const sidMatch = setCookieHeader.match(/sid=([^;]+)/);
      if (sidMatch) {
        const cookieStore = await cookies();
        cookieStore.set('sid', sidMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24, // 1 day
        });
      }
    }

    // Success - redirect to beranda with hint for Google auth
    const redirectUrl = new URL('/beranda', baseUrl);
    redirectUrl.searchParams.set('auth', 'google');
    return NextResponse.redirect(redirectUrl);
  } catch (e) {
    return NextResponse.redirect(
      new URL('/login?error=server_error', baseUrl),
    );
  }
}
