import type { Provider } from "../types";

export const SCROLL_PERCENTAGE = 0.8;
export const CARD_SCROLL_AMOUNT = 300;
export const ARROW_SCROLL_THRESHOLD = 10;

export function getProviderDisplayName(
  provider: Provider,
  providers: Provider[],
  index: number
): string {
  if (provider.kategori === "drama") {
    return "Drama";
  }

  const categoryIndex = providers
    .slice(0, index + 1)
    .filter((p) => p.kategori === provider.kategori).length;

  return `${provider.kategori.charAt(0).toUpperCase() + provider.kategori.slice(1)}S${categoryIndex}`;
}

/**
 * Returns a URL-safe slug for a provider's page.
 * drama -> /drama
 * anime S1 -> /animes1
 * movies S2 -> /movies2
 * manga S1 -> /mangas1
 */
export function getProviderPageSlug(
  provider: Provider,
  providers: Provider[],
  index: number
): string {
  if (provider.kategori === "drama") {
    return "drama";
  }

  const categoryIndex = providers
    .slice(0, index + 1)
    .filter((p) => p.kategori === provider.kategori).length;

  return `${provider.kategori}s${categoryIndex}`;
}

/**
 * Resolves a URL slug back to a provider from the providers array.
 * Returns { provider, index } or null if not found.
 */
export function resolvePageSlug(
  slug: string,
  providers: Provider[]
): { provider: Provider; index: number } | null {
  for (let i = 0; i < providers.length; i++) {
    if (getProviderPageSlug(providers[i], providers, i) === slug) {
      return { provider: providers[i], index: i };
    }
  }
  return null;
}
