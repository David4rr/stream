'use server';

import { registerSchema, registerApiSchema } from '@/lib/schemas/auth';
import {
  getApiBaseUrl,
  formatZodErrors,
  handleAuthResponse,
  syncAuthCookies,
  normalizeUserData,
  AuthResponseData,
} from '@/lib/auth-utils';

export interface RegisterSuccessResponse {
  success: true;
  data: {
    user: AuthResponseData['user'];
  };
}

export interface RegisterErrorResponse {
  success: false;
  error: string;
  fields?: Record<string, string>;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const validatedData = registerSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Validasi gagal. Silakan periksa input Anda.',
      fields: formatZodErrors(validatedData.error),
    };
  }

  const derivedUsername = validatedData.data.name.replace(/\s+/g, '').toLowerCase();

  const apiPayload = {
    username: derivedUsername,
    email: validatedData.data.email,
    password: validatedData.data.password,
  };

  const apiValidation = registerApiSchema.safeParse(apiPayload);
  if (!apiValidation.success) {
    return {
      success: false,
      error: 'Username yang diturunkan dari nama tidak valid. Gunakan nama tanpa karakter spesial.',
      fields: formatZodErrors(apiValidation.error),
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiValidation.data),
    });

    const errorResult = await handleAuthResponse(
      response,
      'Registrasi gagal. Silakan coba lagi.',
    );
    if (errorResult) {
      return errorResult;
    }

    const result = await response.json();
    const userData = normalizeUserData(
      result,
      apiValidation.data.username,
      validatedData.data.email,
    );

    await syncAuthCookies(response, userData);

    return {
      success: true,
      data: {
        user: userData,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan. Silakan coba lagi.',
    };
  }
}
