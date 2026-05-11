'use server';

import { updateProfileSchema } from '@/lib/schemas/auth';
import { formatZodErrors } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL environment variable is missing');
}

export interface UpdateProfileSuccessResponse {
  success: true;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    isActive: number;
    isFree: boolean;
    subscriptionType?: string | null;
    subscriptionStart?: string | null;
    subscriptionEnd?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface UpdateProfileErrorResponse {
  success: false;
  error: string;
  fields?: Record<string, string>;
}

export type UpdateProfileResponse = UpdateProfileSuccessResponse | UpdateProfileErrorResponse;

export async function updateProfile(data: {
  userId: string;
  username: string;
  email: string;
  displayName: string;
}): Promise<UpdateProfileResponse> {
  const { userId, ...updateData } = data;

  // Hanya validasi field yang dikirim
  const validatedData = updateProfileSchema.safeParse(updateData);

  if (!validatedData.success) {
    return {
      success: false,
      error: 'Validasi gagal. Silakan periksa input Anda.',
      fields: formatZodErrors(validatedData.error),
    };
  }

  // Body request dengan avatarUrl kosong (hardcode)
  const body: Record<string, string | number> = {
    username: validatedData.data.username || '',
    email: validatedData.data.email || '',
    displayName: validatedData.data.displayName || '',
    avatarUrl: '', // Kosong untuk sekarang, nanti tambahkan fitur upload
    isActive: 1, // Hardcode, tidak bisa diubah dari form
  };

  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get('sid');
    const cookieHeader = sidCookie ? `sid=${sidCookie.value}` : '';

    const response = await fetch(`${API_BASE_URL}/user/update/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      body: JSON.stringify(body),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Gagal mengupdate profil. Silakan coba lagi.',
      };
    }

    return {
      success: true,
      message: result.message || 'Profil berhasil diupdate',
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan. Silakan coba lagi.',
    };
  }
}
