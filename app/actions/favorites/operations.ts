/**
 * Favorites CRUD Operations
 */

'use server';

import { cookies } from 'next/headers';
import { enrichFavoritesBatch } from './enrich';
import {
  FavoriteDrama,
  FavoritesResponse,
  CreateFavoriteResult,
  UpdateFavoriteResult,
  DeleteFavoriteResult,
} from './types';

const API_BASE_URL = process.env.API_BASE_URL || '';

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL environment variable is missing');
}

export async function getAllFavorites(): Promise<FavoritesResponse> {
  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get("sid");

    if (!sidCookie) {
      return { success: false, error: 'Not authenticated' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const url = `${API_BASE_URL}/catalog/favorite/all`;

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
      return { success: false, error: 'Failed to fetch favorites' };
    }

    const result = await response.json();

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to fetch favorites' };
    }

    const favorites = result.data || [];

    let authenticatedUserId: string | null = null;
    try {
      const meUrl = `${API_BASE_URL}/user/me`;

      const meResponse = await fetch(meUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `sid=${sidCookie.value}`,
        },
        cache: 'no-store',
      });

      if (meResponse.ok) {
        const meResult = await meResponse.json();

        if (meResult.data?.id) {
          authenticatedUserId = meResult.data.id;
        }
      } else if (meResponse.status === 401) {
        return {
          success: true,
          source: result.source,
          path: result.path,
          data: [],
        };
      }
    } catch (error) {
      // Continue without authenticated user ID
    }

    if (authenticatedUserId) {
      const userFavorites = favorites.filter((fav: any) => fav.userId === authenticatedUserId);

      const enrichedFavorites = await enrichFavoritesBatch(userFavorites, API_BASE_URL);

      return {
        success: true,
        source: result.source,
        path: result.path,
        data: enrichedFavorites,
      };
    }

    const fallbackFavorites = await enrichFavoritesBatch(favorites, API_BASE_URL);

    return {
      success: true,
      source: result.source,
      path: result.path,
      data: fallbackFavorites,
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch favorites' };
  }
}

export async function createFavorite(contentItemId: string): Promise<CreateFavoriteResult> {
  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get("sid");

    if (!sidCookie) {
      return { success: false, error: 'Not authenticated' };
    }

    const meUrl = `${API_BASE_URL}/user/me`;
    const meResponse = await fetch(meUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sid=${sidCookie.value}`,
      },
      cache: 'no-store',
    });

    if (!meResponse.ok) {
      return { success: false, error: 'Failed to get user info' };
    }

    const meResult = await meResponse.json();
    const userId = meResult.data?.id;

    if (!userId) {
      return { success: false, error: 'User ID not found' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const url = `${API_BASE_URL}/catalog/favorite/create`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sid=${sidCookie.value}`,
      },
      body: JSON.stringify({
        userId,
        contentItemId,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      return { success: false, error: 'Failed to create favorite' };
    }

    const result = await response.json();

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to create favorite' };
    }

    return result;
  } catch (error) {
    return { success: false, error: 'Failed to create favorite' };
  }
}

export async function deleteFavorite(favoriteId: string): Promise<DeleteFavoriteResult> {
  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get("sid");

    if (!sidCookie) {
      return { success: false, error: 'Not authenticated' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const url = `${API_BASE_URL}/catalog/favorite/delete/${favoriteId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sid=${sidCookie.value}`,
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      return { success: false, error: 'Failed to delete favorite' };
    }

    const result = await response.json();

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete favorite' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete favorite' };
  }
}

export async function updateFavorite(
  favoriteId: string,
  userId: string,
  contentItemId: string
): Promise<UpdateFavoriteResult> {
  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get("sid");

    if (!sidCookie) {
      return { success: false, error: 'Not authenticated' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const url = `${API_BASE_URL}/catalog/favorite/update/${favoriteId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sid=${sidCookie.value}`,
      },
      body: JSON.stringify({
        userId,
        contentItemId,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      return { success: false, error: 'Failed to update favorite' };
    }

    const result = await response.json();

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to update favorite' };
    }

    return result;
  } catch (error) {
    return { success: false, error: 'Failed to update favorite' };
  }
}
