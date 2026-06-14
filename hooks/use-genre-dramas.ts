/**
 * useGenreDramas Hook
 *
 * Manages fetching and storing drama data for multiple genres.
 * Fetches based on visibleGenreCount to support dynamic loading.
 * Only fetches NEW genres that haven't been loaded yet.
 *
 * Uses server action directly instead of Redux dispatch.
 *
 * Key design: fetchedGenreIds is stored in a ref (not state) to avoid
 * re-creating the fetch callback on every successful fetch, which would
 * cancel in-flight requests and cause unnecessary re-fetches.
 */

import { useState, useEffect, useRef } from "react";
import { fetchDramasByGenreByKategoriAction } from "@/app/actions/drama";
import type { Drama, Genre, Kategori } from "@/components/beranda/types";

export function useGenreDramas(
  provider: string,
  genres: Genre[],
  kategori: Kategori = "drama",
  initialGenreDramas: Record<number, Drama[]> = {},
  visibleGenreCount: number = 6
): { genreDramas: Record<number, Drama[]>, isLoadingGenreDramas: boolean } {
  // Use refs for mutable values that shouldn't trigger re-renders or
  // recreate the fetch effect when they change mid-fetch.
  const kategoriRef = useRef(kategori);
  const lastProviderRef = useRef<string | null>(null);
  const lastVisibleCountRef = useRef<number>(0);
  const fetchedGenreIdsRef = useRef<Set<number>>(
    new Set(Object.keys(initialGenreDramas).map(Number))
  );

  // Always keep kategoriRef current without triggering effects
  kategoriRef.current = kategori;

  const [genreDramas, setGenreDramas] = useState<Record<number, Drama[]>>(initialGenreDramas);
  const [isLoadingGenreDramas, setIsLoadingGenreDramas] = useState(false);

  // Clear data when provider changes (before the new fetch fires)
  useEffect(() => {
    if (lastProviderRef.current !== null && lastProviderRef.current !== provider) {
      setGenreDramas({});
      fetchedGenreIdsRef.current = new Set();
      lastVisibleCountRef.current = 0;
    }
    lastProviderRef.current = provider;
  }, [provider]);

  // Main fetch effect
  useEffect(() => {
    if (genres.length === 0) return;

    // Skip if we haven't been asked to show more
    if (lastVisibleCountRef.current >= visibleGenreCount) return;

    const cancelToken = { cancelled: false };

    const doFetch = async () => {
      setIsLoadingGenreDramas(true);

      try {
        // Only fetch genres that haven't been fetched yet
        const genresToFetch: Genre[] = [];
        for (let i = lastVisibleCountRef.current; i < Math.min(visibleGenreCount, genres.length); i++) {
          const genre = genres[i];
          if (!fetchedGenreIdsRef.current.has(genre.genreId)) {
            genresToFetch.push(genre);
          }
        }

        if (genresToFetch.length > 0) {
          const results = await Promise.allSettled(
            genresToFetch.map((genre) =>
              fetchDramasByGenreByKategoriAction(
                kategoriRef.current,
                provider,
                genre.genreId
              )
            )
          );

          // Discard results if a newer fetch superseded this one
          if (cancelToken.cancelled) return;

          const updates: Record<number, Drama[]> = {};
          results.forEach((result, index) => {
            const genre = genresToFetch[index];
            fetchedGenreIdsRef.current.add(genre.genreId);
            if (result.status === "fulfilled" && result.value.success && result.value.data) {
              updates[genre.genreId] = result.value.data;
            } else {
              updates[genre.genreId] = [];
            }
          });

          // Merge new results into existing data
          setGenreDramas(prev => ({ ...prev, ...updates }));
        }

        // Advance the cursor even if nothing new was fetched
        lastVisibleCountRef.current = visibleGenreCount;
      } finally {
        if (!cancelToken.cancelled) {
          setIsLoadingGenreDramas(false);
        }
      }
    };

    doFetch();

    return () => {
      cancelToken.cancelled = true;
      setIsLoadingGenreDramas(false);
    };
  }, [provider, genres, visibleGenreCount]);

  return { genreDramas, isLoadingGenreDramas };
}
