/**
 * Favorites Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllFavorites, createFavorite, deleteFavorite, updateFavorite as updateFavoriteApi, FavoriteDrama } from "@/app/actions/favorites";
import { RootState } from "./index";
import { logout, login, register, fetchUser, fetchGoogleUser } from "./auth-slice";

export interface FavoritesState {
  favorites: FavoriteDrama[];
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  isDeleting: boolean;
  favoritedItemIds: string[];
  currentUserId: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
  isCreating: false,
  isDeleting: false,
  favoritedItemIds: [],
  currentUserId: null,
};

export const fetchFavorites = createAsyncThunk<
  FavoriteDrama[],
  void,
  { rejectValue: string }
>("favorites/fetchFavorites", async (_, { rejectWithValue }) => {
  const result = await getAllFavorites();

  if (!result.success) {
    return rejectWithValue(result.error || "Failed to fetch favorites");
  }

  return result.data;
});

export const addFavorite = createAsyncThunk<
  { favorite: FavoriteDrama; contentItemId: string },
  { contentItemId: string; dramaData?: { title?: string; coverImage?: string; description?: string; category?: string; providerKey?: string; sourceId?: string; type?: number } },
  { rejectValue: string }
>("favorites/addFavorite", async ({ contentItemId, dramaData }, { rejectWithValue }) => {
  const result = await createFavorite(contentItemId);

  if (!result.success) {
    return rejectWithValue(result.error || "Failed to create favorite");
  }

  const favorite: FavoriteDrama = {
    id: result.data.id,
    userId: result.data.userId,
    contentItemId: result.data.contentItemId,
    createdAt: result.data.createdAt,
  };

  if (dramaData) {
    Object.assign(favorite, dramaData);
  }

  return {
    favorite,
    contentItemId,
  };
});

export const removeFavorite = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("favorites/removeFavorite", async (favoriteId, { rejectWithValue }) => {
  const result = await deleteFavorite(favoriteId);

  if (!result.success) {
    return rejectWithValue(result.error || "Failed to delete favorite");
  }

  return favoriteId;
});

export const updateFavoriteMapping = createAsyncThunk<
  FavoriteDrama,
  { favoriteId: string; userId: string; contentItemId: string },
  { rejectValue: string }
>("favorites/updateFavoriteMapping", async ({ favoriteId, userId, contentItemId }, { rejectWithValue }) => {
  const result = await updateFavoriteApi(favoriteId, userId, contentItemId);

  if (!result.success) {
    return rejectWithValue(result.error || "Failed to update favorite");
  }

  return {
    id: result.data.id,
    userId: result.data.userId,
    contentItemId: result.data.contentItemId,
    createdAt: result.data.createdAt,
  } as FavoriteDrama;
});

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<FavoriteDrama[]>) => {
      state.favorites = action.payload;
      state.error = null;
      state.favoritedItemIds = action.payload
        .map((f) => f.contentItemId)
        .filter((id): id is string => id !== undefined);
    },

    updateFavorite: (state, action: PayloadAction<{ contentItemId: string; data: Partial<FavoriteDrama> }>) => {
      const { contentItemId, data } = action.payload;
      const index = state.favorites.findIndex(f => f.contentItemId === contentItemId);
      if (index !== -1) {
        state.favorites[index] = { ...state.favorites[index], ...data };
      }
    },

    clearFavorites: (state) => {
      state.favorites = [];
      state.error = null;
      state.favoritedItemIds = [];
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.favorites = [];
        state.favoritedItemIds = [];
        state.currentUserId = null;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const newUserId = action.payload.user?.id || null;

        if (newUserId && newUserId !== state.currentUserId) {
          state.favorites = [];
          state.favoritedItemIds = [];
          state.error = null;
        }

        state.currentUserId = newUserId;
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;

        const firstFavorite = action.payload[0];
        const fetchedUserId = firstFavorite?.userId || null;

        state.currentUserId = fetchedUserId;

        const existingMap = new Map(state.favorites.map(f => [f.contentItemId, f]));

        state.favorites = action.payload.map(apiFav => {
          const existing = existingMap.get(apiFav.contentItemId);

          if (existing) {
            return {
              ...apiFav,
              title: existing.title || apiFav.title,
              coverImage: existing.coverImage || apiFav.coverImage,
              description: existing.description || apiFav.description,
              category: existing.category || apiFav.category,
              providerKey: existing.providerKey || apiFav.providerKey,
              type: existing.type || apiFav.type,
              sourceId: existing.sourceId || apiFav.sourceId,
            };
          }

          return apiFav;
        });

        state.favoritedItemIds = action.payload
          .map((f) => String(f.contentItemId))
          .filter((id): id is string => id !== undefined);

        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch favorites";
      })
      .addCase(addFavorite.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.isCreating = false;
        state.error = null;
        const newFavorite = action.payload.favorite;

        state.favorites.push(newFavorite);
        if (action.payload.contentItemId && !state.favoritedItemIds.some(id => String(id) === String(action.payload.contentItemId))) {
          state.favoritedItemIds.push(String(action.payload.contentItemId));
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || "Failed to create favorite";
      })
      .addCase(removeFavorite.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.error = null;
        const removedFavorite = state.favorites.find((f) => String(f.id) === String(action.payload));
        state.favorites = state.favorites.filter((f) => String(f.id) !== String(action.payload));
        if (removedFavorite?.contentItemId) {
          state.favoritedItemIds = state.favoritedItemIds.filter((id) => String(id) !== String(removedFavorite.contentItemId));
        }
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || "Failed to delete favorite";
      })
      .addCase(logout.fulfilled, () => {
        return initialState;
      })
      .addCase(register.fulfilled, (state, action) => {
        const newUserId = action.payload.user?.id || null;
        return {
          ...initialState,
          currentUserId: newUserId,
        };
      })
      .addCase(fetchUser.fulfilled, () => {
        return initialState;
      })
      .addCase(fetchGoogleUser.fulfilled, (state, action) => {
        const newUserId = action.payload.user?.id || null;
        return {
          ...initialState,
          currentUserId: newUserId,
        };
      });
  },
});

export const {
  setFavorites,
  updateFavorite,
  clearFavorites,
  clearError,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

export const selectFavorites = (state: RootState) => state.favorites?.favorites || [];
export const selectFavoritesLoading = (state: RootState) => state.favorites?.loading || false;
export const selectFavoritesError = (state: RootState) => state.favorites?.error;
export const selectFavoritesCount = (state: RootState) => state.favorites?.favorites?.length || 0;
export const selectIsCreating = (state: RootState) => state.favorites?.isCreating || false;
export const selectIsDeleting = (state: RootState) => state.favorites?.isDeleting || false;
export const selectFavoritedItemIds = (state: RootState) => state.favorites?.favoritedItemIds || [];

export const selectIsFavorited = (contentItemId: string) => (state: RootState) => {
  return state.favorites?.favoritedItemIds?.some(id => String(id) === String(contentItemId)) || false;
};
