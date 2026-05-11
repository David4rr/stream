/**
 * Redux Store Configuration
 *
 * Store adalah "database" di frontend yang menyimpan state global aplikasi.
 *
 * Konsep Dasar Redux:
 * 1. Store: Tempat menyimpan semua state
 * 2. Action: Perintah untuk mengubah state (contoh: LOGIN_SUCCESS)
 * 3. Reducer: Fungsi yang mengubah state berdasarkan action
 * 4. Selector: Fungsi untuk mengambil data dari state
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import berandaReducer from "./beranda-slice";
import providersReducer from "./providers-slice";
import favoritesReducer from "./favorites-slice";

/**
 * Konfigurasi Redux Store
 *
 * configureStore adalah fungsi dari Redux Toolkit yang:
 * - Menggabungkan semua reducers
 * - Menambahkan Redux DevTools extension
 * - Mengaktifkan middleware thunk (untuk async action)
 */
export const store = configureStore({
  reducer: {
    // Setiap slice reducer di-register di sini
    auth: authReducer,
    beranda: berandaReducer,
    providers: providersReducer,
    favorites: favoritesReducer,
    // Nanti bisa tambah slice lain:
    // products: productsReducer,
    // cart: cartReducer,
    // dll.
  },
  // Middleware tambahan bisa ditambahkan di sini
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Serializability check: memastikan state bisa diserialisasi (penting untuk debugging)
      serializableCheck: false,
    }),
});

/**
 * TYPE DEFINITIONS
 *
 * Types ini memberikan TypeScript IntelliSense saat menggunakan RootState dan AppDispatch
 */

// Type dari seluruh state di Redux store
export type RootState = ReturnType<typeof store.getState>;

// Type dari dispatch function
export type AppDispatch = typeof store.dispatch;
