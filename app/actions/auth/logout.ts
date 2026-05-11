'use server';

import { cookies } from 'next/headers';
import { googleLogout } from '@/lib/auth-utils';

export interface LogoutSuccessResponse {
  success: true;
}

export interface LogoutErrorResponse {
  success: false;
  error: string;
}

export type LogoutResponse = LogoutSuccessResponse | LogoutErrorResponse;

export async function logout(): Promise<LogoutResponse> {
  try {
    console.log('[logout] Starting logout process...');

    // Logout dari Google OAuth (jika user login via Google)
    await googleLogout();

    // Hapus cookie sid with explicit options to ensure it's deleted
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get('sid');

    console.log('[logout] Current sid cookie:', sidCookie ? 'exists' : 'none');

    // Delete with multiple options to ensure cookie is removed across different contexts
    cookieStore.delete('sid');
    cookieStore.set('sid', '', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0, // Immediately expire
    });

    console.log('[logout] Cookie deleted');

    return {
      success: true,
    };
  } catch (error) {
    console.error('[logout] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to logout',
    };
  }
}

