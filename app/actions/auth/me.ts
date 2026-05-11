'use server';

import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL environment variable is missing');
}

export interface MeSuccessResponse {
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

export interface MeErrorResponse {
  success: false;
  error: string;
}

export type MeResponse = MeSuccessResponse | MeErrorResponse;

export async function me(): Promise<MeResponse> {
  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get("sid");

    if (!sidCookie) {
      return { success: false, error: 'Not authenticated' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const url = `${API_BASE_URL}/user/me`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sid=${sidCookie.value}`,
      },
      cache: 'no-store',
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch user data' };
    }

    const result = await response.json();

    // Response structure: { message: "Success", data: { id, username, ... } }
    const userData = result.data;

    if (!userData || !userData.id) {
      return { success: false, error: 'Invalid user data' };
    }

    return {
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        displayName: userData.displayName,
        avatarUrl: userData.avatarUrl,
        isActive: userData.isActive,
        isFree: userData.isFree,
        subscriptionType: userData.subscriptionType,
        subscriptionStart: userData.subscriptionStart,
        subscriptionEnd: userData.subscriptionEnd,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch user data' };
  }
}
