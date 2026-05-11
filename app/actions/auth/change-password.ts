'use server';

import { changePasswordSchema } from '@/lib/schemas/auth';
import { formatZodErrors } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL environment variable is missing');
}

export interface ChangePasswordSuccessResponse {
  success: true;
  message: string;
  data?: unknown;
}

export interface ChangePasswordErrorResponse {
  success: false;
  error: string;
  fields?: Record<string, string>;
}

export type ChangePasswordResponse = ChangePasswordSuccessResponse | ChangePasswordErrorResponse;

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ChangePasswordResponse> {
  const validatedData = changePasswordSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Validasi gagal. Silakan periksa input Anda.',
      fields: formatZodErrors(validatedData.error),
    };
  }

  if (validatedData.data.currentPassword === validatedData.data.newPassword) {
    return {
      success: false,
      error: 'Password baru harus berbeda dengan password saat ini',
      fields: { newPassword: 'Password baru harus berbeda' },
    };
  }

  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get('sid');
    const cookieHeader = sidCookie ? `sid=${sidCookie.value}` : '';

    const response = await fetch(`${API_BASE_URL}/user/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      body: JSON.stringify({
        currentPassword: validatedData.data.currentPassword,
        newPassword: validatedData.data.newPassword,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Gagal mengubah password. Silakan coba lagi.',
      };
    }

    return {
      success: true,
      message: result.message || 'Password berhasil diubah',
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan. Silakan coba lagi.',
    };
  }
}
