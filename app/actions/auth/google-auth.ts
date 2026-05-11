'use server';

import { getGoogleAuthUrl } from '@/lib/auth-utils';

export interface GoogleAuthSuccessResponse {
  success: true;
  authUrl: string;
}

export interface GoogleAuthErrorResponse {
  success: false;
  error: string;
}

export type GoogleAuthResponse = GoogleAuthSuccessResponse | GoogleAuthErrorResponse;

/**
 * Get Google OAuth URL for client-side redirect
 */
export async function getGoogleOAuthUrl(): Promise<GoogleAuthResponse> {
  const result = await getGoogleAuthUrl();

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    authUrl: result.authUrl,
  };
}
