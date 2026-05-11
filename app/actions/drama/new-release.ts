"use server";

/**
 * New Release Actions
 *
 * Server Actions for fetching new release data from Drama API.
 */

import { fetchAction, fetchSSR, CACHE_DURATION } from "@/lib/drama-api-client";
import type { Drama, RecommendationsResponse, ActionResponse, Kategori } from "./types";

/**
 * Fetch new release dramas from provider
 * Server Action - secure proxy to external API
 */
export async function fetchNewReleaseAction(
  provider: string
): Promise<ActionResponse<Drama[]>> {
  const result = await fetchAction<RecommendationsResponse>(
    `/drama/${provider}/new-release`,
    { revalidate: CACHE_DURATION.TEN_MINUTES }
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
 * Fetch new release by kategori (supports all categories: drama, anime, movies, manga)
 * Server Action - secure proxy to external API
 */
export async function fetchNewReleaseByKategoriAction(
  kategori: Kategori,
  provider: string
): Promise<ActionResponse<Drama[]>> {
  const result = await fetchAction<RecommendationsResponse>(
    `/${kategori}/${provider}/new-release`,
    { revalidate: CACHE_DURATION.TEN_MINUTES }
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
 * Direct fetch function for new release (SSR Pattern)
 * Use this in page.tsx for initial data load
 */
export async function getNewReleaseFromAPI(
  provider: string
): Promise<RecommendationsResponse> {
  return fetchSSR<RecommendationsResponse>(
    `/drama/${provider}/new-release`,
    { revalidate: CACHE_DURATION.TEN_MINUTES }
  );
}

/**
 * Generic fetch new release by kategori (supports all categories)
 * SSR Pattern - use in Server Components
 */
export async function getNewReleaseByKategoriFromAPI(
  kategori: string,
  provider: string
): Promise<RecommendationsResponse> {
  return fetchSSR<RecommendationsResponse>(
    `/${kategori}/${provider}/new-release`,
    { revalidate: CACHE_DURATION.TEN_MINUTES }
  );
}
