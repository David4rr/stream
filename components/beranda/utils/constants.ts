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
