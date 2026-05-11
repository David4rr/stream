/**
 * Beranda (Streaming Platform) Redux Slice
 * 
 * Slice ini menangani state untuk halaman beranda streaming platform.
 * State dapat diisi dari mock data atau API calls.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BerandaData, BerandaState } from "@/components/beranda/types";
import { MOCK_BERANDA_DATA } from "@/components/beranda/mock-data";
import { RootState } from "./index";

// Initial State
const initialState: BerandaState = {
  data: null,
  loading: false,
  error: null,
  currentSlide: 1,
};

// Async Thunk untuk fetch data (simulasi API call)
export const fetchBerandaData = createAsyncThunk<
  BerandaData,
  void,
  { rejectValue: string }
>("beranda/fetchData", async (_, { rejectWithValue }) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return mock data - replace with actual API call
    // const response = await fetch('/api/beranda');
    // const data = await response.json();
    // return data;
    
    return MOCK_BERANDA_DATA;
  } catch (error) {
    return rejectWithValue("Failed to fetch beranda data");
  }
});

// Beranda Slice
const berandaSlice = createSlice({
  name: "beranda",
  initialState,
  reducers: {
    // Set data directly (useful for SSR or testing)
    setBerandaData: (state, action: PayloadAction<BerandaData>) => {
      state.data = action.payload;
      state.error = null;
    },
    
    // Clear data
    clearBerandaData: (state) => {
      state.data = null;
      state.error = null;
    },
    
    // Set loading state manually
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error manually
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Change current slide
    setCurrentSlide: (state, action: PayloadAction<number>) => {
      state.currentSlide = action.payload;
    },
    
    // Next slide
    nextSlide: (state) => {
      if (state.data) {
        const totalSlides = 7; // Could be dynamic
        state.currentSlide = state.currentSlide >= totalSlides ? 1 : state.currentSlide + 1;
      }
    },
    
    // Previous slide
    prevSlide: (state) => {
      if (state.data) {
        const totalSlides = 7; // Could be dynamic
        state.currentSlide = state.currentSlide <= 1 ? totalSlides : state.currentSlide - 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBerandaData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBerandaData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchBerandaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

// Export actions
export const {
  setBerandaData,
  clearBerandaData,
  setLoading,
  setError,
  setCurrentSlide,
  nextSlide,
  prevSlide,
} = berandaSlice.actions;

// Export reducer
export default berandaSlice.reducer;

// Selectors
export const selectBerandaData = (state: RootState) => state.beranda?.data;
export const selectBerandaLoading = (state: RootState) => state.beranda?.loading;
export const selectBerandaError = (state: RootState) => state.beranda?.error;
export const selectCurrentSlide = (state: RootState) => state.beranda?.currentSlide || 1;

export const selectHeroData = (state: RootState) => state.beranda?.data?.hero;
export const selectCategories = (state: RootState) => state.beranda?.data?.categories || [];
export const selectPromoData = (state: RootState) => state.beranda?.data?.promo;
export const selectFAQs = (state: RootState) => state.beranda?.data?.faqs || [];
export const selectFooterData = (state: RootState) => state.beranda?.data?.footer;
