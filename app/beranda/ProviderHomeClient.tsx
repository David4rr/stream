"use client";

/**
 * ProviderHomeClient — Single-provider passive client component.
 *
 * Receives all data as props from SSR page.
 * No handleProviderChange, no Redux provider switching.
 * Genre "Load More" still works via useGenreDramas.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  selectBerandaLoading,
  selectBerandaError,
} from "@/store/beranda-slice";
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

const INITIAL_VISIBLE_GENRES = 9;
const GENRES_PER_LOAD = 9;

interface ProviderHomeClientProps {
  providers: Provider[];
  provider: Provider;
  providerIndex: number;
  initialRecommendations: Drama[];
  initialNewRelease: Drama[];
  initialGenres: Genre[];
  initialGenreDramas: Record<number, Drama[]>;
  berandaData: BerandaData;
}

export function ProviderHomeClient({
  providers,
  provider,
  providerIndex,
  initialRecommendations,
  initialNewRelease,
  initialGenres,
  initialGenreDramas,
  berandaData,
}: ProviderHomeClientProps) {
  const loading = useAppSelector(selectBerandaLoading);
  const error = useAppSelector(selectBerandaError);

  const [mounted, setMounted] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

  // Genre pagination state
  const [visibleGenreCount, setVisibleGenreCount] = useState<number>(
    Math.min(initialGenres.length, INITIAL_VISIBLE_GENRES)
  );
  const [isLoadingMoreGenres, setIsLoadingMoreGenres] = useState<boolean>(false);
  const totalGenreCount = initialGenres.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateTotalSections = useCallback((genreCount: number) => {
    const fixedSections = 3;
    const remainingGenres = Math.max(0, genreCount - 1);
    const genreSections = Math.ceil(remainingGenres / 2);
    const faqSection = 1;
    return fixedSections + genreSections + faqSection;
  }, []);

  const visibleTotalSections = calculateTotalSections(visibleGenreCount);

  // Genre dramas via hook with SSR initial data
  const { genreDramas, isLoadingGenreDramas } = useGenreDramas(
    provider.name,
    initialGenres,
    provider.kategori,
    mounted ? initialGenreDramas : {},
    visibleGenreCount
  );

  // Gap cover between content switch and genre fetch
  const isWaitingForGenreFetch =
    !isLoadingGenreDramas &&
    initialGenres.length > 0 &&
    Object.keys(genreDramas).length === 0;

  const handleLoadMoreGenres = useCallback(async () => {
    if (isLoadingMoreGenres || visibleGenreCount >= totalGenreCount) return;
    setIsLoadingMoreGenres(true);
    const nextBatchEnd = Math.min(
      visibleGenreCount + GENRES_PER_LOAD,
      totalGenreCount
    );
    setVisibleGenreCount(nextBatchEnd);
    setIsLoadingMoreGenres(false);
  }, [isLoadingMoreGenres, visibleGenreCount, totalGenreCount]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0e0e0e]">
        <div className="lg:hidden">
          <MobileSkeleton />
        </div>
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

  if (error) {
    return (
      <div className="h-screen bg-white dark:bg-[#0e0e0e] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <UnifiedBeranda
      providers={providers}
      recommendations={initialRecommendations}
      newRelease={initialNewRelease}
      genres={initialGenres}
      genreDramas={genreDramas}
      isLoadingGenreDramas={isLoadingGenreDramas}
      selectedProvider={provider}
      selectedProviderIndex={providerIndex}
      selectedCardIndex={selectedCardIndex}
      isContentLoading={isWaitingForGenreFetch}
      berandaData={berandaData}
      totalSections={visibleTotalSections}
      visibleGenreCount={visibleGenreCount}
      totalGenreCount={totalGenreCount}
      onLoadMoreGenres={handleLoadMoreGenres}
      isLoadingMoreGenres={isLoadingMoreGenres}
      onProviderChange={() => {}} // no-op: navigation via URL
      onCardChange={setSelectedCardIndex}
    />
  );
}
