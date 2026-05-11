/**
 * useProviderSelection Hook
 *
 * Manages provider selection state and provider change logic.
 * Handles fetching recommendations, new release, and genres when provider changes.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  setSelectedProvider,
  setSelectedProviderIndex,
  fetchRecommendations,
  fetchNewRelease,
  fetchGenres,
} from "@/store/providers-slice";
import type { Drama, Genre, Kategori } from "@/components/beranda/types";

interface UseProviderSelectionProps {
  initialProvider: string;
  initialRecommendations: Drama[];
  initialNewRelease: Drama[];
  initialGenres: Genre[];
  kategori: Kategori;
  onGenreDramasFetch?: (provider: string, genres: Genre[]) => void;
}

interface UseProviderSelectionReturn {
  selectedProvider: string;
  selectedProviderIndex: number;
  selectedCardIndex: number;
  setSelectedCardIndex: (index: number) => void;
  recommendations: Drama[];
  newRelease: Drama[];
  genres: Genre[];
  handleProviderChange: (provider: string, index: number) => Promise<void>;
}

export function useProviderSelection({
  initialProvider,
  initialRecommendations,
  initialNewRelease,
  initialGenres,
  kategori,
  onGenreDramasFetch,
}: UseProviderSelectionProps): UseProviderSelectionReturn {
  const dispatch = useAppDispatch();
  const isMounted = useRef(true);

  const [selectedProvider, setSelectedProviderName] = useState<string>(initialProvider);
  const [selectedProviderIndex, setSelectedProviderIndexState] = useState<number>(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [recommendations, setLocalRecommendations] = useState<Drama[]>(initialRecommendations);
  const [newRelease, setLocalNewRelease] = useState<Drama[]>(initialNewRelease);
  const [genres, setLocalGenres] = useState<Genre[]>(initialGenres);

  const handleProviderChange = useCallback(
    async (providerName: string, index: number) => {
      setSelectedProviderName(providerName);
      setSelectedProviderIndexState(index);
      setSelectedCardIndex(0); // Reset card selection

      // Dispatch Redux actions
      dispatch(setSelectedProvider(providerName));
      dispatch(setSelectedProviderIndex(index));

      // Fetch ALL data in parallel (Recommendations, New Release, Genres)
      const [recResult, newRelResult, genresResult] = await Promise.all([
        dispatch(fetchRecommendations({ kategori, provider: providerName })),
        dispatch(fetchNewRelease({ kategori, provider: providerName })),
        dispatch(fetchGenres({ kategori, provider: providerName })),
      ]);

      if (!isMounted.current) return;

      if (fetchRecommendations.fulfilled.match(recResult)) {
        setLocalRecommendations(recResult.payload.dramas);
      }
      if (fetchNewRelease.fulfilled.match(newRelResult)) {
        setLocalNewRelease(newRelResult.payload);
      }

      let currentGenres: Genre[] = [];
      if (fetchGenres.fulfilled.match(genresResult)) {
        currentGenres = genresResult.payload;
        setLocalGenres(currentGenres);
      } else if (fetchGenres.rejected.match(genresResult)) {
        // Clear genres for providers that don't support it (e.g., melolo)
        setLocalGenres([]);
      }

      // Trigger genre dramas fetch
      if (onGenreDramasFetch && currentGenres.length > 0) {
        onGenreDramasFetch(providerName, currentGenres);
      }
    },
    [dispatch, onGenreDramasFetch, kategori]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    selectedProvider,
    selectedProviderIndex,
    selectedCardIndex,
    setSelectedCardIndex,
    recommendations,
    newRelease,
    genres,
    handleProviderChange,
  };
}
