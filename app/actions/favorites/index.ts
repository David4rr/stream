/**
 * Favorites Actions
 */

export type {
  FavoriteDrama,
  FavoritesSuccessResponse,
  FavoritesErrorResponse,
  FavoritesResponse,
  CreateFavoriteResponse,
  CreateFavoriteErrorResponse,
  CreateFavoriteResult,
  UpdateFavoriteResponse,
  UpdateFavoriteErrorResponse,
  UpdateFavoriteResult,
  DeleteFavoriteResult,
} from './types';

export { enrichSingleFavorite, enrichFavoritesBatch } from './enrich';
export { getAllFavorites, createFavorite, deleteFavorite, updateFavorite } from './operations';
