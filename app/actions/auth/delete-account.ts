'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL environment variable is missing');
}

export interface DeleteAccountSuccessResponse {
  success: true;
  message: string;
}

export interface DeleteAccountErrorResponse {
  success: false;
  error: string;
}

export type DeleteAccountResponse = DeleteAccountSuccessResponse | DeleteAccountErrorResponse;

export async function deleteAccount(userId: string): Promise<DeleteAccountResponse> {
  if (!userId) {
    return { success: false, error: 'User ID tidak ditemukan' };
  }

  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get('sid');
    const cookieHeader = sidCookie ? `sid=${sidCookie.value}` : '';

    const response = await fetch(`${API_BASE_URL}/user/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Gagal menghapus akun',
      };
    }

    return {
      success: true,
      message: result.message || 'Akun berhasil dihapus',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan',
    };
  }
}
