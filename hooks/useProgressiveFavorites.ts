/**
 * Progressive Favorites Loading Hook
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  setFavorites,
} from '@/store/favorites-slice';
import { enrichSingleFavorite, FavoriteDrama } from '@/app/actions/favorites';
import { priorityProgressiveEnrich } from '@/lib/progressive-enrich';

interface ProgressiveState {
  favorites: FavoriteDrama[];
  loaded: number;
  total: number;
  isLoading: boolean;
  isComplete: boolean;
  error: string | null;
}

export function useProgressiveFavorites(initialFavorites: FavoriteDrama[], apiBaseUrl: string) {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<ProgressiveState>({
    favorites: initialFavorites,
    loaded: 0,
    total: initialFavorites.length,
    isLoading: false,
    isComplete: false,
    error: null,
  });

  const loadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (state.isComplete || state.loaded > 0) {
      dispatch(setFavorites(state.favorites));
    }
  }, [state.favorites, state.isComplete, state.loaded, dispatch]);

  const enrichSingle = useCallback(async (favorite: FavoriteDrama): Promise<FavoriteDrama> => {
    return enrichSingleFavorite(favorite, apiBaseUrl);
  }, [apiBaseUrl]);

  const loadProgressively = useCallback(async (options?: {
    priorityCount?: number;
    batchSize?: number;
    delay?: number;
  }) => {
    if (loadingRef.current) {
      return;
    }

    const {
      priorityCount = 10,
      batchSize = 10,
      delay = 100,
    } = options || {};

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    loadingRef.current = true;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      loaded: 0,
      total: prev.favorites.length,
    }));

    try {
      const enriched = await priorityProgressiveEnrich({
        items: state.favorites,
        priorityCount,
        progressiveBatchSize: batchSize,
        delayBetweenBatches: delay,
        enrichFn: enrichSingle,
        onProgress: (completed, total) => {
          setState((prev) => ({
            ...prev,
            loaded: completed,
            total,
          }));
        },
        onPriorityComplete: (priorityItems) => {
          setState((prev) => {
            const newFavorites = [...prev.favorites];
            priorityItems.forEach((item, index) => {
              newFavorites[index] = item;
            });
            return {
              ...prev,
              favorites: newFavorites,
            };
          });
        },
      });

      setState({
        favorites: enriched,
        loaded: enriched.length,
        total: enriched.length,
        isLoading: false,
        isComplete: true,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load favorites';

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    } finally {
      loadingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [state.favorites, enrichSingle]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      loadingRef.current = false;
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    loadingRef.current = false;
    abortControllerRef.current = null;

    setState({
      favorites: initialFavorites,
      loaded: 0,
      total: initialFavorites.length,
      isLoading: false,
      isComplete: false,
      error: null,
    });
  }, [initialFavorites]);

  return {
    favorites: state.favorites,
    loaded: state.loaded,
    total: state.total,
    isLoading: state.isLoading,
    isComplete: state.isComplete,
    error: state.error,
    progress: state.total > 0 ? (state.loaded / state.total) * 100 : 0,
    loadProgressively,
    cancel,
    reset,
  };
}
