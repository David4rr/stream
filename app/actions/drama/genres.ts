"use server";

/**
 * Genre Actions
 *
 * Server Actions for fetching genre data from Drama API.
 */

import { fetchAction, fetchSSR, CACHE_DURATION } from "@/lib/drama-api-client";
import type { Drama, Genre, GenreResponse, GenreDramasResponse, ActionResponse, Kategori } from "./types";

/**
 * Fetch genres from provider
 * Server Action - secure proxy to external API
 */
export async function fetchGenresAction(
  provider: string
): Promise<ActionResponse<Genre[]>> {
  const result = await fetchAction<GenreResponse>(
    `/drama/${provider}/genre`,
    { revalidate: CACHE_DURATION.HOUR }
  );

  if (result.success) {
    if (!result.data.success || !result.data.data) {
      return { success: false, error: "Invalid response from API" };
    }
    return { success: true, data: result.data.data };
  }

  return result;
}

/**
 * Fetch genres by kategori (supports all categories: drama, anime, movies, manga)
 * Server Action - secure proxy to external API
 */
export async function fetchGenresByKategoriAction(
  kategori: Kategori,
  provider: string
): Promise<ActionResponse<Genre[]>> {
  const result = await fetchAction<GenreResponse>(
    `/${kategori}/${provider}/genre`,
    { revalidate: CACHE_DURATION.HOUR }
  );

  if (result.success) {
    if (!result.data.success || !result.data.data) {
      return { success: false, error: "Invalid response from API" };
    }
    return { success: true, data: result.data.data };
  }

  return result;
}

/**
 * Direct fetch function for genres (SSR Pattern)
 * Use this in page.tsx for initial data load
 */
export async function getGenresFromAPI(provider: string): Promise<GenreResponse> {
  return fetchSSR<GenreResponse>(`/drama/${provider}/genre`, {
    revalidate: CACHE_DURATION.HOUR,
  });
}

/**
 * Fetch dramas by genre ID from provider
 * Server Action - secure proxy to external API
 */
export async function fetchDramasByGenreAction(
  provider: string,
  genreId: number
): Promise<ActionResponse<Drama[]>> {
  const result = await fetchAction<GenreDramasResponse>(
    `/drama/${provider}/genre/${genreId}`,
    { revalidate: CACHE_DURATION.TEN_MINUTES }
  );

  if (result.success) {
    if (!result.data.data) {
      return { success: false, error: "No dramas found for this genre" };
    }
    return { success: true, data: result.data.data };
  }

  return result;
}

/**
 * Fetch dramas by genre by kategori (supports all categories: drama, anime, movies, manga)
 * Server Action - secure proxy to external API
 */
export async function fetchDramasByGenreByKategoriAction(
  kategori: Kategori,
  provider: string,
  genreId: number
): Promise<ActionResponse<Drama[]>> {
  const result = await fetchAction<GenreDramasResponse>(
    `/${kategori}/${provider}/genre/${genreId}`,
    { revalidate: CACHE_DURATION.TEN_MINUTES }
  );

  if (result.success) {
    if (!result.data.data) {
      return { success: false, error: "No dramas found for this genre" };
    }
    return { success: true, data: result.data.data };
  }

  return result;
}

/**
 * Direct fetch function for dramas by genre (SSR Pattern)
 * Use this in page.tsx for initial data load
 */
export async function getDramasByGenreFromAPI(
  provider: string,
  genreId: number
): Promise<GenreDramasResponse> {
  return fetchSSR<GenreDramasResponse>(`/drama/${provider}/genre/${genreId}`, {
    revalidate: CACHE_DURATION.TEN_MINUTES,
  });
}

/**
 * Generic fetch genres by kategori (supports all categories)
 * SSR Pattern - use in Server Components
 */
export async function getGenresByKategoriFromAPI(
  kategori: string,
  provider: string
): Promise<GenreResponse> {
  return fetchSSR<GenreResponse>(`/${kategori}/${provider}/genre`, {
    revalidate: CACHE_DURATION.HOUR,
  });
}

/**
 * Generic fetch dramas by genre by kategori (supports all categories)
 * SSR Pattern - use in Server Components
 */
export async function getDramasByGenreByKategoriFromAPI(
  kategori: string,
  provider: string,
  genreId: number
): Promise<GenreDramasResponse> {
  return fetchSSR<GenreDramasResponse>(`/${kategori}/${provider}/genre/${genreId}`, {
    revalidate: CACHE_DURATION.TEN_MINUTES,
  });
}
