"use server";

/**
 * Recommendations Actions
 *
 * Server Actions for fetching recommendation data from Drama API.
 */

import { fetchAction, fetchSSR, CACHE_DURATION } from "@/lib/drama-api-client";
import type { Drama, RecommendationsResponse, ActionResponse, Kategori } from "./types";

/**
 * Fetch recommendations from a provider
 * Server Action - secure proxy to external API
 */
export async function fetchRecommendationsAction(
  provider: string
): Promise<ActionResponse<Drama[]>> {
  const result = await fetchAction<RecommendationsResponse>(
    `/drama/${provider}/recommendations`,
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
 * Fetch recommendations by kategori (supports all categories: drama, anime, movies, manga)
 * Server Action - secure proxy to external API
 * 
 * For "drama" category: uses /v2/drama/recommendations (without provider)
 * For other categories: uses /{kategori}/{provider}/recommendations
 */
export async function fetchRecommendationsByKategoriAction(
  kategori: Kategori,
  provider: string
): Promise<ActionResponse<Drama[]>> {
  // For drama category, use the v2 endpoint without provider
  const endpoint = kategori === "drama"
    ? `/v2/drama/recommendations`
    : `/${kategori}/${provider}/recommendations`;

  const result = await fetchAction<RecommendationsResponse>(
    endpoint,
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
 * Direct fetch function for recommendations (SSR Pattern)
 * Use this in page.tsx for initial data load
 */
export async function getRecommendationsFromAPI(
  provider: string
): Promise<RecommendationsResponse> {
  return fetchSSR<RecommendationsResponse>(
    `/drama/${provider}/recommendations`,
    { revalidate: CACHE_DURATION.TEN_MINUTES }
  );
}

/**
 * Generic fetch recommendations by kategori (supports all categories)
 * SSR Pattern - use in Server Components
 * 
 * For "drama" category: uses /v2/drama/recommendations (without provider)
 * For other categories: uses /{kategori}/{provider}/recommendations
 */
export async function getRecommendationsByKategoriFromAPI(
  kategori: string,
  provider: string
): Promise<RecommendationsResponse> {
  // For drama category, use the v2 endpoint without provider
  const endpoint = kategori === "drama"
    ? `/v2/drama/recommendations`
    : `/${kategori}/${provider}/recommendations`;

  return fetchSSR<RecommendationsResponse>(
    endpoint,
    { revalidate: CACHE_DURATION.TEN_MINUTES }
  );
}
