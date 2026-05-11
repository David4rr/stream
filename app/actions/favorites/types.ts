export interface FavoriteDrama {
  id: string;
  userId: string;
  contentItemId: string;
  createdAt: string;
  contentItem?: {
    id: string;
    categoryId: string;
    providerKey: string;
    sourceId: string;
    isActive: number;
    createdAt: string;
    updatedAt: string;
  };
  user?: {
    id: string;
    username: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    isActive?: number;
    isFree?: boolean;
    subscriptionType?: string | null;
    subscriptionStart?: string | null;
    subscriptionEnd?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  title?: string;
  description?: string;
  coverImage?: string;
  type?: number;
  category?: string;
  providerKey?: string;
  sourceId?: string;
}

export interface FavoritesSuccessResponse {
  success: true;
  source: string;
  path: string;
  data: FavoriteDrama[];
}

export interface FavoritesErrorResponse {
  success: false;
  error: string;
}

export type FavoritesResponse = FavoritesSuccessResponse | FavoritesErrorResponse;

export interface CreateFavoriteResponse {
  success: true;
  source: string;
  path: string;
  data: {
    id: string;
    userId: string;
    contentItemId: string;
    createdAt: string;
  };
}

export interface CreateFavoriteErrorResponse {
  success: false;
  error: string;
}

export type CreateFavoriteResult = CreateFavoriteResponse | CreateFavoriteErrorResponse;

export interface UpdateFavoriteResponse {
  success: true;
  source: string;
  path: string;
  data: {
    id: string;
    userId: string;
    contentItemId: string;
    createdAt: string;
  };
}

export interface UpdateFavoriteErrorResponse {
  success: false;
  error: string;
}

export type UpdateFavoriteResult = UpdateFavoriteResponse | UpdateFavoriteErrorResponse;

export interface DeleteFavoriteResult {
  success: boolean;
  error?: string;
}
