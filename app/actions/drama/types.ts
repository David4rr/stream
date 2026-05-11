/**
 * Shared types for Drama API actions
 */

export type Kategori = "drama" | "anime" | "movies" | "manga";

export interface Provider {
  name: string;
  kategori: Kategori;
  slug: string;
}

// Raw provider from API (without kategori/slug)
export interface RawProvider {
  name: string;
}

export interface ProvidersResponse {
  success: boolean;
  source: string;
  path: string;
  data: RawProvider[];
}

// ActionResponse type for type safety (CONTEXT.md requirement)
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Re-export API response types from components
export type {
  Drama,
  RecommendationsResponse,
  Genre,
  GenreResponse,
  GenreDramasResponse,
} from "@/components/beranda/types";
