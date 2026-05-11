'use server';

import { loginSchema } from '@/lib/schemas/auth';
import {
  getApiBaseUrl,
  formatZodErrors,
  handleAuthResponse,
  syncAuthCookies,
  normalizeUserData,
  AuthResponseData,
} from '@/lib/auth-utils';

export interface LoginSuccessResponse {
  success: true;
  data: {
    user: AuthResponseData['user'];
  };
}

export interface LoginErrorResponse {
  success: false;
  error: string;
  fields?: Record<string, string>;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export async function login(data: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const validatedData = loginSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Validasi gagal. Silakan periksa input Anda.',
      fields: formatZodErrors(validatedData.error),
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: validatedData.data.username,
        password: validatedData.data.password,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let result;
    try {
      const responseText = await response.text();
      result = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: 'Username atau password salah.',
      };
    }

    if (!response.ok) {
      const errorResult = await handleAuthResponse(
        response,
        'Username atau password salah.',
      );
      if (errorResult) {
        return errorResult;
      }
    }

    await syncAuthCookies(response);

    const userData = normalizeUserData(result, validatedData.data.username);

    return {
      success: true,
      data: {
        user: userData,
      },
    };
  } catch (error) {
    // Generic user-friendly error message
    return {
      success: false,
      error: 'Username atau password salah.',
    };
  }
}
