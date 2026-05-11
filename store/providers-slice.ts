/**
 * Providers Redux Slice
 *
 * Mengelola state untuk provider data dan recommendations dari Drama API
 * Mengikuti CONTEXT.md: Thunks call Server Actions, NOT fetch()
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllProvidersFromAPI,
  fetchRecommendationsByKategoriAction,
  fetchNewReleaseByKategoriAction,
  fetchGenresByKategoriAction,
  fetchDramasByGenreByKategoriAction,
  Provider,
} from "@/app/actions/drama";
import type { Drama, Genre, Kategori } from "@/components/beranda/types";
import { RootState } from "./index";

// Provider State Interface
export interface ProvidersState {
  providers: Provider[];
  recommendations: Record<string, Drama[]>; // Map provider name to dramas
  newRelease: Drama[]; // New release dramas for section 2
  genres: Genre[]; // Genres from API
  genreDramas: Record<number, Drama[]>; // Map genre ID to dramas
  loading: boolean;
  recommendationsLoading: boolean;
  newReleaseLoading: boolean;
  genresLoading: boolean;
  genreDramasLoading: boolean;
  error: string | null;
  selectedProvider: string | null;
  selectedProviderIndex: number;
}

// Initial State
const initialState: ProvidersState = {
  providers: [],
  recommendations: {},
  newRelease: [],
  genres: [],
  genreDramas: {},
  loading: false,
  recommendationsLoading: false,
  newReleaseLoading: false,
  genresLoading: false,
  genreDramasLoading: false,
  error: null,
  selectedProvider: null,
  selectedProviderIndex: 0,
};

// Async Thunk - fetch all providers from all categories via Server Action
export const fetchProviders = createAsyncThunk<
  Provider[],
  void,
  { rejectValue: string }
>("providers/fetchProviders", async (_, { rejectWithValue }) => {
  try {
    const providers = await getAllProvidersFromAPI();
    return providers;
  } catch (error) {
    return rejectWithValue("Failed to fetch providers");
  }
});

// Async Thunk - fetch recommendations by kategori via Server Action (supports all categories)
export const fetchRecommendations = createAsyncThunk<
  { provider: string; dramas: Drama[] },
  { kategori: Kategori; provider: string },
  { rejectValue: string }
>(
  "providers/fetchRecommendations",
  async ({ kategori, provider }, { rejectWithValue }) => {
    const result = await fetchRecommendationsByKategoriAction(kategori, provider);

    if (!result.success || !result.data) {
      return rejectWithValue(result.error || "Failed to fetch recommendations");
    }

    return { provider, dramas: result.data };
  }
);

// Async Thunk - fetch new release by kategori via Server Action
export const fetchNewRelease = createAsyncThunk<
  Drama[],
  { kategori: Kategori; provider: string },
  { rejectValue: string }
>("providers/fetchNewRelease", async ({ kategori, provider }, { rejectWithValue }) => {
  const result = await fetchNewReleaseByKategoriAction(kategori, provider);

  if (!result.success || !result.data) {
    return rejectWithValue(result.error || "Failed to fetch new release");
  }

  return result.data;
});

// Async Thunk - fetch genres by kategori via Server Action
export const fetchGenres = createAsyncThunk<
  Genre[],
  { kategori: Kategori; provider: string },
  { rejectValue: string }
>("providers/fetchGenres", async ({ kategori, provider }, { rejectWithValue }) => {
  const result = await fetchGenresByKategoriAction(kategori, provider);

  if (!result.success || !result.data) {
    return rejectWithValue(result.error || "Failed to fetch genres");
  }

  return result.data;
});

// Async Thunk - fetch dramas by genre by kategori via Server Action
export const fetchDramasByGenre = createAsyncThunk<
  { genreId: number; dramas: Drama[] },
  { kategori: Kategori; provider: string; genreId: number },
  { rejectValue: string }
>("providers/fetchDramasByGenre", async ({ kategori, provider, genreId }, { rejectWithValue }) => {
  const result = await fetchDramasByGenreByKategoriAction(kategori, provider, genreId);

  if (!result.success || !result.data) {
    return rejectWithValue(result.error || "Failed to fetch dramas by genre");
  }

  return { genreId, dramas: result.data };
});

// Providers Slice
const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    // Set providers directly (useful for SSR)
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload;
      state.error = null;
    },

    // Set recommendations directly (useful for SSR)
    setRecommendations: (
      state,
      action: PayloadAction<{ provider: string; dramas: Drama[] }>
    ) => {
      if (!state.recommendations) {
        state.recommendations = {};
      }
      state.recommendations[action.payload.provider] = action.payload.dramas;
    },

    // Set new release directly (useful for SSR)
    setNewRelease: (state, action: PayloadAction<Drama[]>) => {
      state.newRelease = action.payload;
    },

    // Set genres directly (useful for SSR)
    setGenres: (state, action: PayloadAction<Genre[]>) => {
      state.genres = action.payload;
    },

    // Set genre dramas directly (useful for SSR)
    setGenreDramas: (state, action: PayloadAction<{ genreId: number; dramas: Drama[] }>) => {
      if (!state.genreDramas) {
        state.genreDramas = {};
      }
      state.genreDramas[action.payload.genreId] = action.payload.dramas;
    },

    // Select provider by name
    setSelectedProvider: (state, action: PayloadAction<string>) => {
      state.selectedProvider = action.payload;
    },

    // Select provider by index
    setSelectedProviderIndex: (state, action: PayloadAction<number>) => {
      state.selectedProviderIndex = action.payload;
      if (state.providers[action.payload]) {
        state.selectedProvider = state.providers[action.payload].name;
      }
    },

    // Append dramas to existing recommendations (CONTEXT.md: infinite scroll)
    appendRecommendations: (
      state,
      action: PayloadAction<{ provider: string; dramas: Drama[] }>
    ) => {
      const existing = state.recommendations[action.payload.provider] || [];
      state.recommendations[action.payload.provider] = [
        ...existing,
        ...action.payload.dramas,
      ];
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch providers
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
        state.error = null;

        // Set first provider as default
        if (action.payload.length > 0 && !state.selectedProvider) {
          state.selectedProvider = action.payload[0].name;
        }
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      // Fetch recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations[action.payload.provider] = action.payload.dramas;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.error = action.payload || "Failed to fetch recommendations";
      })
      // Fetch new release
      .addCase(fetchNewRelease.pending, (state) => {
        state.newReleaseLoading = true;
      })
      .addCase(fetchNewRelease.fulfilled, (state, action) => {
        state.newReleaseLoading = false;
        state.newRelease = action.payload;
      })
      .addCase(fetchNewRelease.rejected, (state, action) => {
        state.newReleaseLoading = false;
        state.error = action.payload || "Failed to fetch new release";
      })
      // Fetch genres
      .addCase(fetchGenres.pending, (state) => {
        state.genresLoading = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genresLoading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.genresLoading = false;
        state.genres = []; // Clear genres for providers that don't support it (e.g., melolo)
        state.error = action.payload || "Failed to fetch genres";
      })
      // Fetch dramas by genre
      .addCase(fetchDramasByGenre.pending, (state) => {
        state.genreDramasLoading = true;
      })
      .addCase(fetchDramasByGenre.fulfilled, (state, action) => {
        state.genreDramasLoading = false;
        state.genreDramas[action.payload.genreId] = action.payload.dramas;
      })
      .addCase(fetchDramasByGenre.rejected, (state, action) => {
        state.genreDramasLoading = false;
        state.error = action.payload || "Failed to fetch dramas by genre";
      });
  },
});

// Export actions
export const {
  setProviders,
  setRecommendations,
  setNewRelease,
  setGenres,
  setGenreDramas,
  setSelectedProvider,
  setSelectedProviderIndex,
  appendRecommendations,
  clearError,
} = providersSlice.actions;

// Export reducer
export default providersSlice.reducer;

// Selectors
export const selectProviders = (state: RootState) => state.providers?.providers || [];
export const selectProvidersLoading = (state: RootState) => state.providers?.loading || false;
export const selectProvidersError = (state: RootState) => state.providers?.error;
export const selectSelectedProvider = (state: RootState) => state.providers?.selectedProvider;
export const selectSelectedProviderIndex = (state: RootState) => state.providers?.selectedProviderIndex || 0;
export const selectRecommendationsLoading = (state: RootState) => state.providers?.recommendationsLoading || false;

// Get provider names array for tabs/navigation
export const selectProviderNames = (state: RootState) =>
  state.providers?.providers.map((p: { name: string }) => p.name) || [];

// Get recommendations for selected provider
export const selectSelectedProviderRecommendations = (state: RootState) => {
  const selectedProvider = state.providers?.selectedProvider;
  if (!selectedProvider) return [];
  return state.providers?.recommendations[selectedProvider] || [];
};

// Get recommendations for a specific provider
export const selectRecommendationsByProvider = (
  provider: string
) => (state: RootState) => {
  return state.providers?.recommendations[provider] || [];
};

// Get new release dramas
export const selectNewRelease = (state: RootState) => state.providers?.newRelease || [];
export const selectNewReleaseLoading = (state: RootState) => state.providers?.newReleaseLoading || false;

// Get genres
export const selectGenres = (state: RootState) => state.providers?.genres || [];
export const selectGenresLoading = (state: RootState) => state.providers?.genresLoading || false;

// Get dramas by genre ID
export const selectGenreDramas = (genreId: number) => (state: RootState) => {
  return state.providers?.genreDramas[genreId] || [];
};
export const selectGenreDramasLoading = (state: RootState) => state.providers?.genreDramasLoading || false;
