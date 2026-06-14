/**
 * Providers Redux Slice (simplified)
 *
 * Only manages: providers list, loading, error.
 * Provider content (recommendations, newRelease, genres, genreDramas) removed —
 * now fetched server-side per page via SSR.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllProvidersFromAPI,
  Provider,
} from "@/app/actions/drama";
import { RootState } from "./index";

export interface ProvidersState {
  providers: Provider[];
  loading: boolean;
  error: string | null;
}

const initialState: ProvidersState = {
  providers: [],
  loading: false,
  error: null,
};

// Async Thunk — fetch all providers from all categories
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

const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    // Set providers directly (useful for SSR hydration)
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
        state.error = null;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { setProviders, clearError } = providersSlice.actions;

export default providersSlice.reducer;

// Selectors
export const selectProviders = (state: RootState) => state.providers?.providers || [];
export const selectProvidersLoading = (state: RootState) => state.providers?.loading || false;
export const selectProvidersError = (state: RootState) => state.providers?.error;

// Get provider names array for tabs/navigation
export const selectProviderNames = (state: RootState) =>
  state.providers?.providers.map((p: { name: string }) => p.name) || [];
