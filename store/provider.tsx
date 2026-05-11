/**
 * Redux Provider Component
 *
 * Provider ini membungkus aplikasi agar semua komponen bisa mengakses Redux store.
 */

"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useAppDispatch } from "./hooks";
import { store } from "./index";
import { fetchUser, fetchGoogleUser } from "./auth-slice";

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * AuthHydrator - Mengambil data user saat aplikasi pertama kali dimuat di client
 *
 * Mencoba fetchUser (regular login) dulu, jika gagal fallback ke fetchGoogleUser
 * Jika URL ada ?auth=google, coba Google auth terlebih dahulu
 */
function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hydrateAuth = async () => {
      // Check if user just logged in via Google OAuth
      const params = new URLSearchParams(window.location.search);
      const isGoogleAuth = params.get('auth') === 'google';

      if (isGoogleAuth) {
        // Clear the param from URL
        window.history.replaceState({}, '', window.location.pathname);
        // Try Google auth first
        try {
          await dispatch(fetchGoogleUser());
        } catch (error) {
        }
      } else {
        // Regular flow: try regular login first, fallback to Google
        try {
          const result = await dispatch(fetchUser());
          if (fetchUser.rejected.match(result)) {
            try {
              await dispatch(fetchGoogleUser());
            } catch (error) {
            }
          }
        } catch (error) {
        }
      }
    };

    hydrateAuth();
  }, [dispatch]);

  return <>{children}</>;
}

/**
 * ReduxProvider - Wrapper untuk mengaktifkan Redux di aplikasi
 *
 * Cara pakai: Letakkan ini di layout.tsx paling luar
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}
