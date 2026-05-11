"use client";

/**
 * Beranda Client Component
 *
 * Handles interactivity and client-side logic.
 * Supports dynamic genre loading with Load More functionality.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectBerandaLoading,
  selectBerandaError,
} from "@/store/beranda-slice";
import {
  setRecommendations,
  setSelectedProvider,
  setSelectedProviderIndex,
  selectSelectedProvider,
  selectSelectedProviderIndex,
  fetchRecommendations,
  fetchNewRelease,
  fetchGenres,
} from "@/store/providers-slice";
import { StreamingShell } from "@/components/app-shell";
import {
  UnifiedBeranda,
  HeroSkeleton,
  MovieSectionSkeleton,
  PromoSectionSkeleton,
  FAQSectionSkeleton,
  MobileSkeleton,
} from "@/components/beranda";
import { useGenreDramas } from "@/hooks";
import type {
  BerandaData,
  Provider,
  Drama,
  Genre,
} from "@/components/beranda/types";

const INITIAL_VISIBLE_GENRES = 9; // Show 9 genres initially
const GENRES_PER_LOAD = 9; // Load 9 more genres each time

interface BerandaClientProps {
  providers: Provider[];
  initialRecommendations: Drama[];
  initialNewRelease: Drama[];
  initialGenres: Genre[];
  initialGenreDramas: Record<number, Drama[]>;
  initialProvider: Provider;
  berandaData: BerandaData;
  totalSections: number;
}

export function BerandaClient({
  providers,
  initialRecommendations,
  initialNewRelease,
  initialGenres,
  initialGenreDramas,
  initialProvider,
  berandaData,
}: BerandaClientProps) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectBerandaLoading);
  const error = useAppSelector(selectBerandaError);

  // Mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Redux state - only read after mount to prevent hydration mismatch
  const storedProviderName = useAppSelector(selectSelectedProvider);
  const storedProviderIndex = useAppSelector(selectSelectedProviderIndex);

  // Stabilize providers array to prevent unnecessary re-renders
  const stableProviders = useMemo(() => providers, [providers.length]);

  // Local state - always use initial values on server to prevent hydration mismatch
  const [recommendations, setLocalRecommendations] = useState<Drama[]>(initialRecommendations);
  const [newRelease, setLocalNewRelease] = useState<Drama[]>(initialNewRelease);
  const [genres, setLocalGenres] = useState<Genre[]>(initialGenres);
  const [selectedProvider, setSelectedProviderState] = useState<Provider>(initialProvider);
  const [selectedProviderIndex, setSelectedProviderIndexState] = useState<number>(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false);

  // Dynamic genre loading state
  const [visibleGenreCount, setVisibleGenreCount] = useState<number>(
    Math.min(initialGenres.length, INITIAL_VISIBLE_GENRES),
  );
  const [isLoadingMoreGenres, setIsLoadingMoreGenres] = useState<boolean>(false);
  const [totalGenreCount, setTotalGenreCount] = useState<number>(initialGenres.length);

  // Calculate total sections dynamically
  // Section 1: Hero
  // Section 2: New Release + 1 Genre
  // Section 3: Promo
  // Section 4+: Remaining Genres (2 per section)
  // Section last: FAQ
  const calculateTotalSections = useCallback((genreCount: number) => {
    const fixedSections = 3; // Hero + NewRelease+Genre + Promo
    const remainingGenres = Math.max(0, genreCount - 1); // Minus first genre
    const genreSections = Math.ceil(remainingGenres / 2); // 2 genres per section
    const faqSection = 1;
    return fixedSections + genreSections + faqSection;
  }, []);

  // Total sections is always derived from currently visible genres (not the full total)
  const visibleTotalSections = calculateTotalSections(visibleGenreCount);

  // Set mounted state on client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Genre dramas using custom hook with initial data from server
  const { genreDramas, isLoadingGenreDramas } = useGenreDramas(
    selectedProvider.name,
    genres,
    selectedProvider.kategori,
    // Use initialGenreDramas only if it's the initial provider and mounted
    mounted && selectedProvider.name === initialProvider.name
      ? initialGenreDramas
      : {},
    visibleGenreCount, // Pass visible count so hook knows which genres to fetch
  );

  // Cover the brief render gap between handleProviderChange completing
  // and the useGenreDramas fetch effect firing
  const isWaitingForGenreFetch =
    !isContentLoading &&
    !isLoadingGenreDramas &&
    genres.length > 0 &&
    Object.keys(genreDramas).length === 0;

  const combinedContentLoading = isContentLoading || isWaitingForGenreFetch;

  // Load more genres handler
  const handleLoadMoreGenres = useCallback(async () => {
    if (isLoadingMoreGenres || visibleGenreCount >= totalGenreCount) return;

    setIsLoadingMoreGenres(true);

    // Calculate next batch: advance from current visible count, not total loaded
    const nextBatchEnd = Math.min(
      visibleGenreCount + GENRES_PER_LOAD,
      totalGenreCount,
    );

    // Fetch dramas for the new genres (using API action)
    // Note: Genres are already loaded, we're just making more visible
    // The useGenreDramas hook will automatically fetch dramas for newly visible genres

    // Update visible genre count
    setVisibleGenreCount(nextBatchEnd);

    setIsLoadingMoreGenres(false);
  }, [
    isLoadingMoreGenres,
    visibleGenreCount,
    totalGenreCount,
  ]);

  // Handle provider change
  const handleProviderChange = useCallback(
    async (provider: Provider, index: number) => {
      setSelectedProviderState(provider);
      setSelectedProviderIndexState(index);
      setSelectedCardIndex(0);

      dispatch(setSelectedProvider(provider.name));
      dispatch(setSelectedProviderIndex(index));

      // Clear data immediately
      setIsContentLoading(true);
      setLocalRecommendations([]);
      setLocalNewRelease([]);
      setLocalGenres([]);

      // Fetch new data
      const [recResult, newRelResult, genresResult] = await Promise.all([
        dispatch(
          fetchRecommendations({
            kategori: provider.kategori,
            provider: provider.name,
          }),
        ),
        dispatch(
          fetchNewRelease({
            kategori: provider.kategori,
            provider: provider.name,
          }),
        ),
        dispatch(
          fetchGenres({
            kategori: provider.kategori,
            provider: provider.name,
          }),
        ),
      ]);

      // Always update state, even if rejected
      if (fetchRecommendations.fulfilled.match(recResult)) {
        setLocalRecommendations(recResult.payload.dramas);
      } else {
        setLocalRecommendations([]);
      }

      if (fetchNewRelease.fulfilled.match(newRelResult)) {
        setLocalNewRelease(newRelResult.payload);
      } else {
        setLocalNewRelease([]);
      }

      // Update genres and reset visible count
      if (fetchGenres.fulfilled.match(genresResult)) {
        const newGenres = genresResult.payload;
        setLocalGenres(newGenres);
        setTotalGenreCount(newGenres.length);
        setVisibleGenreCount(
          Math.min(newGenres.length, INITIAL_VISIBLE_GENRES),
        );
      } else {
        setLocalGenres([]);
        setTotalGenreCount(0);
        setVisibleGenreCount(0);
      }

      setIsContentLoading(false);
    },
    [dispatch],
  );

  // Initialize Redux store with initial data and handle restoration
  // Only run after mount to prevent hydration mismatch
  // This useEffect is placed AFTER handleProviderChange is defined
  useEffect(() => {
    if (!mounted) return;

    // Check if we need to restore a previously selected provider
    const needsRestore = storedProviderName && storedProviderName !== initialProvider.name;
    const providerToRestore = needsRestore
      ? (providers.find((p) => p.name === storedProviderName) ?? null)
      : null;

    if (providerToRestore) {
      // Restore previous provider
      handleProviderChange(providerToRestore, storedProviderIndex);
    } else if (!storedProviderName || storedProviderName === initialProvider.name) {
      // Initialize with initial provider
      dispatch(
        setRecommendations({
          provider: initialProvider.name,
          dramas: initialRecommendations,
        }),
      );
      dispatch(setSelectedProvider(initialProvider.name));
    }
  }, [dispatch, mounted, initialProvider, initialRecommendations, providers, storedProviderName, storedProviderIndex, handleProviderChange]);

  // Listen to provider index changes from GlobalAppShell and fetch new data
  const prevProviderIndexRef = useRef(storedProviderIndex);
  useEffect(() => {
    if (prevProviderIndexRef.current === storedProviderIndex) return;

    prevProviderIndexRef.current = storedProviderIndex;

    const newProvider = stableProviders[storedProviderIndex];
    if (newProvider) {
      handleProviderChange(newProvider, storedProviderIndex);
    }
  }, [storedProviderIndex, stableProviders, handleProviderChange]);

  // Loading state - unified skeleton
  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0e0e0e]">
        {/* Mobile skeleton */}
        <div className="lg:hidden">
          <MobileSkeleton />
        </div>

        {/* Desktop skeleton */}
        <div className="hidden lg:block">
          <section className="min-h-screen lg:min-h-screen relative pt-16 lg:pt-0 flex flex-col">
            <HeroSkeleton />
          </section>
          <section className="min-h-screen lg:min-h-screen relative flex flex-col">
            <MovieSectionSkeleton />
          </section>
          <section className="min-h-screen lg:min-h-screen relative flex flex-col">
            <PromoSectionSkeleton />
          </section>
          <section className="h-screen lg:h-screen relative flex flex-col">
            <div className="h-full w-full bg-white dark:bg-[#0e0e0e] relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-12">
                <FAQSectionSkeleton />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-white dark:bg-[#0e0e0e] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Unified View - CSS-first responsive design
  // No conditional rendering, all handled by CSS in UnifiedBeranda
  return (
    <UnifiedBeranda
      providers={providers}
      recommendations={recommendations}
      newRelease={newRelease}
      genres={genres}
      genreDramas={genreDramas}
      isLoadingGenreDramas={isLoadingGenreDramas}
      selectedProvider={selectedProvider}
      selectedProviderIndex={selectedProviderIndex}
      selectedCardIndex={selectedCardIndex}
      isContentLoading={combinedContentLoading}
      berandaData={berandaData}
      totalSections={visibleTotalSections}
      visibleGenreCount={visibleGenreCount}
      totalGenreCount={totalGenreCount}
      onLoadMoreGenres={handleLoadMoreGenres}
      isLoadingMoreGenres={isLoadingMoreGenres}
      onProviderChange={handleProviderChange}
      onCardChange={setSelectedCardIndex}
    />
  );
}
