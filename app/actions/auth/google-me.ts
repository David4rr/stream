'use server';

import { getGoogleMe } from '@/lib/auth-utils';

export interface GoogleMeSuccessResponse {
  success: true;
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

export interface GoogleMeErrorResponse {
  success: false;
  error: string;
}

export type GoogleMeResponse = GoogleMeSuccessResponse | GoogleMeErrorResponse;

/**
 * Get current Google OAuth user info
 */
export async function getGoogleUser(): Promise<GoogleMeResponse> {
  const result = await getGoogleMe();

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    user: result.user,
  };
}
