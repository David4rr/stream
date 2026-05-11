/**
 * Drama API Actions
 *
 * Centralized export point for all Drama API Server Actions.
 *
 * Usage:
 *   import { fetchRecommendationsAction, fetchGenresAction } from "@/app/actions/drama";
 *
 * Architecture:
 * - All actions use lib/drama-api-client for consistent error handling
 * - Each endpoint has 2 functions: fetch*Action (for Client) + get*FromAPI (for SSR)
 * - Follows CONTEXT.md security rules (Server Actions as secure proxy)
 */

// Types
export type { Provider, RawProvider, ProvidersResponse, ActionResponse, Kategori } from "./types";

// Provider Actions
export {
  fetchProvidersAction,
  getProvidersFromAPI,
  getProvidersByKategoriFromAPI,
  getAllProvidersFromAPI,
  fetchDramasByProviderAction,
  getDramasByProviderFromAPI,
} from "./providers";

// Recommendations Actions
export {
  fetchRecommendationsAction,
  fetchRecommendationsByKategoriAction,
  getRecommendationsFromAPI,
  getRecommendationsByKategoriFromAPI,
} from "./recommendations";

// New Release Actions
export {
  fetchNewReleaseAction,
  fetchNewReleaseByKategoriAction,
  getNewReleaseFromAPI,
  getNewReleaseByKategoriFromAPI,
} from "./new-release";

// Genre Actions
export {
  fetchGenresAction,
  fetchGenresByKategoriAction,
  getGenresFromAPI,
  getGenresByKategoriFromAPI,
  fetchDramasByGenreAction,
  fetchDramasByGenreByKategoriAction,
  getDramasByGenreFromAPI,
  getDramasByGenreByKategoriFromAPI,
} from "./genres";
