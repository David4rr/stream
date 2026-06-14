import { ZodError } from 'zod';
import { cookies, headers } from 'next/headers';

export interface AuthResponseData {
  user: {
    id: string;
    username: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    isActive?: number;
    isFree?: boolean;
    subscriptionType?: string | null;
    subscriptionStart?: string | null;
    subscriptionEnd?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface AuthErrorResponse {
  success: false;
  error: string;
  fields?: Record<string, string>;
}

export interface ApiResponseResult {
  user?: {
    id?: string;
    username?: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    isActive?: number;
    isFree?: boolean;
    subscriptionType?: string | null;
    subscriptionStart?: string | null;
    subscriptionEnd?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
  data?: {
    user?: {
      id?: string;
      username?: string;
      email?: string;
      displayName?: string;
      avatarUrl?: string;
      isActive?: number;
      isFree?: boolean;
      subscriptionType?: string | null;
      subscriptionStart?: string | null;
      subscriptionEnd?: string | null;
      createdAt?: string;
      updatedAt?: string;
    };
  };
}

interface CookieOptions {
  httpOnly: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  secure: boolean;
  path: string;
  domain?: string;
  maxAge?: number;
}

export function formatZodErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((err) => {
    if (err.path[0]) {
      fields[err.path[0] as string] = err.message;
    }
  });
  return fields;
}

export function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('API_BASE_URL environment variable is missing');
  }
  return apiBaseUrl;
}

export function normalizeUserData(
  result: ApiResponseResult,
  fallbackUsername?: string,
  fallbackEmail?: string,
): AuthResponseData['user'] {
  const apiUser = result.user || result.data?.user;

  return {
    id: apiUser?.id || '',
    username: apiUser?.username || fallbackUsername || '',
    email: apiUser?.email || fallbackEmail || '',
    displayName: apiUser?.displayName,
    avatarUrl: apiUser?.avatarUrl,
    isActive: apiUser?.isActive,
    isFree: apiUser?.isFree,
    subscriptionType: apiUser?.subscriptionType,
    subscriptionStart: apiUser?.subscriptionStart,
    subscriptionEnd: apiUser?.subscriptionEnd,
    createdAt: apiUser?.createdAt,
    updatedAt: apiUser?.updatedAt,
  };
}

export async function syncAuthCookies(response: Response, userData?: AuthResponseData['user']): Promise<void> {
  const cookieStore = await cookies();

  const setCookieHeader = response.headers.get('set-cookie');
  console.log('[syncAuthCookies] Set-Cookie header:', setCookieHeader ? 'present' : 'missing');

  if (setCookieHeader) {
    const cookiesToSet = setCookieHeader.split(/,\s*/).filter(c => c.includes('sid='));
    console.log('[syncAuthCookies] Found', cookiesToSet.length, 'sid cookies');

    cookiesToSet.forEach(cookieStr => {
      const [cookieValue, ...attributes] = cookieStr.split(';');
      const [name, value] = cookieValue.trim().split('=');
      if (name === 'sid') {
        console.log('[syncAuthCookies] Setting sid cookie:', value.substring(0, 10) + '...');

        const cookieOptions: CookieOptions = {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        };

        attributes.forEach(attr => {
          const [key, val] = attr.trim().split('=');
          const lowerKey = key.toLowerCase();
          if (lowerKey === 'max-age' && val) {
            cookieOptions.maxAge = parseInt(val, 10);
            if (cookieOptions.maxAge && cookieOptions.maxAge > 86400) {
              cookieOptions.maxAge = 86400; // cap at 24 hours
            }
          } else if (lowerKey === 'domain' && val) {
            cookieOptions.domain = val;
          } else if (lowerKey === 'path' && val) {
            cookieOptions.path = val;
          } else if (lowerKey === 'samesite' && val) {
            if (val === 'strict' || val === 'lax' || val === 'none') {
              cookieOptions.sameSite = val;
            }
          } else if (lowerKey === 'secure') {
            cookieOptions.secure = true;
          } else if (lowerKey === 'httponly') {
            cookieOptions.httpOnly = true;
          }
        });

        cookieStore.set('sid', value, cookieOptions);
        console.log('[syncAuthCookies] Cookie set successfully');
      }
    });
  } else {
    console.log('[syncAuthCookies] No set-cookie header found');
  }
}

export async function handleAuthResponse(response: Response, defaultMessage: string): Promise<AuthErrorResponse | null> {
  if (response.ok) {
    return null;
  }

  const errorData = await response.json().catch(() => ({}));

  if (response.status === 401 || response.status === 400) {
    return {
      success: false,
      error: errorData.message || defaultMessage,
      fields: errorData.fields || {},
    };
  }

  if (response.status === 409) {
    return {
      success: false,
      error: errorData.message || 'Email sudah terdaftar',
      fields: { email: 'Email sudah terdaftar' },
    };
  }

  return {
    success: false,
    error: errorData.message || defaultMessage,
  };
}

// ============================================================================
// Google OAuth Helpers (Backend Callback Mode)
// ============================================================================

export interface GoogleAuthUrlResponse {
  success: true;
  authUrl: string;
}

export interface GoogleAuthUrlError {
  success: false;
  error: string;
}

export type GoogleAuthUrlResult = GoogleAuthUrlResponse | GoogleAuthUrlError;

/**
 * Get Google OAuth URL from backend (Backend Callback Mode).
 *
 * Flow:
 * 1. Frontend calls GET /auth/google with redirect_url
 * 2. Backend returns authUrl
 * 3. User is redirected to Google
 * 4. Google redirects to backend callback: /auth/google/callback
 * 5. Backend handles code exchange, sets cookies, and redirects to frontend
 */
/**
 * Get Google OAuth URL from backend (Backend Callback Mode).
 *
 * Flow:
 * 1. Frontend calls GET /auth/google with frontend redirect URL
 * 2. Backend returns authUrl with redirect_uri pointing to backend callback
 * 3. User is redirected to Google
 * 4. Google redirects to BACKEND callback with code & state
 * 5. Backend sets cookie and redirects to frontend
 * 6. Frontend receives the redirect and syncs the cookie
 */
export async function getGoogleAuthUrl(): Promise<GoogleAuthUrlResult> {
  try {
    const apiBaseUrl = getApiBaseUrl();
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;

    if (!appUrl || appUrl.includes('localhost')) {
      try {
        const headersList = await headers();
        const host = headersList.get('x-forwarded-host') || headersList.get('host');
        const proto = headersList.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
        if (host) {
          appUrl = `${proto}://${host}`;
        }
      } catch (e) {
        // Fallback to environment variable if headers() fails
      }
    }

    // Frontend callback URL - Google akan redirect ke sini setelah user approve
    const callbackUrl = `${appUrl}/auth/callback`;

    const fullUrl = `${apiBaseUrl}/auth/google/frontend?callback_url=${encodeURIComponent(callbackUrl)}`;


    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: 'Gagal mendapatkan URL autentikasi Google' };
    }

    const result = await response.json();

    if (!result.data?.authUrl) {
      return { success: false, error: 'Respons autentikasi Google tidak valid' };
    }

    return {
      success: true,
      authUrl: result.data.authUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan',
    };
  }
}

/**
 * Exchange Google OAuth code with backend
 */
export interface GoogleExchangeResult {
  success: true;
  user: {
    id: string;
    username: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export type GoogleExchangeError = { success: false; error: string };

export async function exchangeGoogleCode(
  code: string,
  state: string,
): Promise<GoogleExchangeResult | GoogleExchangeError> {
  try {
    const apiBaseUrl = getApiBaseUrl();
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;

    if (!appUrl || appUrl.includes('localhost')) {
      try {
        const headersList = await headers();
        const host = headersList.get('x-forwarded-host') || headersList.get('host');
        const proto = headersList.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
        if (host) {
          appUrl = `${proto}://${host}`;
        }
      } catch (e) {
        // Fallback
      }
    }
    const redirectUri = `${appUrl}/auth/callback`;


    const response = await fetch(`${apiBaseUrl}/auth/google/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: 'Gagal menukar kode autentikasi Google' };
    }

    const result = await response.json();

    if (!result.data?.user) {
      return { success: false, error: 'Respons pengguna Google tidak valid' };
    }

    // Sync cookies from backend response
    await syncAuthCookies(response);

    return {
      success: true,
      user: result.data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan',
    };
  }
}

// ============================================================================
// Google OAuth - Get Current User
// ============================================================================

export interface GoogleUser {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  isActive?: number;
  isFree?: boolean;
  subscriptionType?: string | null;
  subscriptionStart?: string | null;
  subscriptionEnd?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoogleMeResult {
  success: true;
  user: GoogleUser;
}

export type GoogleMeError = { success: false; error: string };

/**
 * Fetch current Google OAuth user info from backend
 * GET /api/auth/google/me
 */
export async function getGoogleMe(): Promise<GoogleMeResult | GoogleMeError> {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const cookieStore = await cookies();

    // Get the sid cookie
    const sidCookie = cookieStore.get('sid');
    const cookieHeader = sidCookie ? `sid=${sidCookie.value}` : '';


    const response = await fetch(`${apiBaseUrl}/auth/google/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: 'Gagal mengambil data pengguna Google' };
    }

    const result = await response.json();

    if (!result.data?.user) {
      return { success: false, error: 'Respons pengguna Google tidak valid' };
    }

    return {
      success: true,
      user: result.data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan',
    };
  }
}

/**
 * Logout from Google OAuth
 * POST /api/auth/google/logout
 */
export async function googleLogout(): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const cookieStore = await cookies();

    // Get the sid cookie
    const sidCookie = cookieStore.get('sid');
    const cookieHeader = sidCookie ? `sid=${sidCookie.value}` : '';


    const response = await fetch(`${apiBaseUrl}/auth/google/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: 'Gagal logout dari Google' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan',
    };
  }
}
