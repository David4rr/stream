"use server";

/**
 * Provider Actions
 *
 * Server Actions for fetching provider data from Drama API.
 */

import { fetchAction, fetchSSR, CACHE_DURATION } from "@/lib/drama-api-client";
import type { Provider, RawProvider, ProvidersResponse, ActionResponse, Kategori } from "./types";

const SLUG_PREFIX: Record<Kategori, string> = {
  drama: "d",
  anime: "a",
  movies: "m",
  manga: "mg",
};

const KATEGORI_ORDER: Kategori[] = ["drama", "anime", "movies", "manga"];

/**
 * Fetch all providers from Drama API
 * Server Action - secure proxy to external API
 */
export async function fetchProvidersAction(): Promise<ActionResponse<RawProvider[]>> {
  return fetchAction<ProvidersResponse>("/drama/providers", {
    revalidate: CACHE_DURATION.HOUR,
  }).then((result) => {
    if (result.success) {
      if (!result.data.success || !result.data.data) {
        return { success: false, error: "Invalid response from API" };
      }
      return { success: true, data: result.data.data };
    }
    return result;
  });
}

/**
 * Direct fetch function for Server Components (SSR Pattern)
 * Use this in page.tsx for initial data load
 */
export async function getProvidersFromAPI(): Promise<ProvidersResponse> {
  return fetchSSR<ProvidersResponse>("/drama/providers", {
    revalidate: CACHE_DURATION.HOUR,
  });
}

/**
 * Fetch providers from a specific category
 * SSR Pattern - use in Server Components
 */
export async function getProvidersByKategoriFromAPI(kategori: Kategori): Promise<ProvidersResponse> {
  return fetchSSR<ProvidersResponse>(`/${kategori}/providers`, {
    revalidate: 300, // 5 minutes for category-specific providers
  });
}

/**
 * Fetch ALL providers from all categories (drama, anime, movies, manga)
 * Returns flat array with kategori and slug metadata
 * SSR Pattern - use in Server Components
 * 
 * Note: For "drama" category, only "dramabox" provider is returned.
 *       Other categories return all providers.
 */
export async function getAllProvidersFromAPI(): Promise<Provider[]> {
  const results = await Promise.allSettled(
    KATEGORI_ORDER.map((kategori) => getProvidersByKategoriFromAPI(kategori))
  );

  const allProviders: Provider[] = [];

  results.forEach((result, kategoriIndex) => {
    const kategori = KATEGORI_ORDER[kategoriIndex];
    const prefix = SLUG_PREFIX[kategori];

    if (result.status === "fulfilled" && result.value?.data) {
      // Filter providers based on kategori
      let filteredProviders = result.value.data;

      // For drama category, only include "dramabox" provider
      if (kategori === "drama") {
        filteredProviders = result.value.data.filter(
          (rawProvider: RawProvider) => rawProvider.name.toLowerCase() === "dramabox"
        );
      }

      filteredProviders.forEach((rawProvider: RawProvider, providerIndex: number) => {
        allProviders.push({
          name: rawProvider.name,
          kategori,
          slug: `${prefix}${providerIndex + 1}`, // d1, d2, a1, a2, m1, mg1, etc.
        });
      });
    }
  });

  return allProviders;
}

/**
 * Fetch dramas by provider with pagination
 * Server Action - secure proxy to external API
 */
export async function fetchDramasByProviderAction(
  provider: string,
  limit: number = 20,
  offset: number = 0
): Promise<ActionResponse<unknown>> {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.set("limit", limit.toString());
  if (offset) queryParams.set("offset", offset.toString());

  const path = `/drama/${provider}?${queryParams}`;

  return fetchAction(path, {
    revalidate: CACHE_DURATION.TEN_MINUTES,
  });
}

/**
 * Direct fetch function for dramas by provider (SSR Pattern)
 */
export async function getDramasByProviderFromAPI(
  provider: string,
  limit: number = 20,
  offset: number = 0
): Promise<unknown> {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.set("limit", limit.toString());
  if (offset) queryParams.set("offset", offset.toString());

  const path = `/drama/${provider}?${queryParams}`;

  return fetchSSR(path, {
    revalidate: CACHE_DURATION.TEN_MINUTES,
  });
}
