"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { Drama, Genre, Kategori, MovieCategory } from "./types";
import {
  SectionContainer,
  SectionContent,
  BackgroundDecorations,
} from "./shared";
import { SectionBackground } from "./hero";
import { convertHeicUrl, getCropClass, handleImageError, isType1ForKategori } from "@/lib/image-utils";
import {
  CARD_SCROLL_AMOUNT,
  EmptyState,
  mapDramaToMovie,
  genreToCategory,
} from "./utils";

interface MovieSectionProps {
  kategori: Kategori;
  providerSlug: string;
  categories: MovieCategory[];
  newRelease?: Drama[];
  genres?: Genre[];
  genreDramas?: Record<number, Drama[]>;
  genreCount?: number;
  sectionNumber: number;
  totalSections?: number;
  providerIndex: number;
  isLoading?: boolean;
}

function MovieSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4 lg:gap-5 xl:gap-6 overflow-hidden py-3 lg:py-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-shrink-0">
          <div className="w-28 h-40 sm:w-32 sm:h-44 lg:w-36 lg:h-52 xl:w-40 xl:h-56 rounded-xl bg-neutral-300 dark:bg-neutral-700 animate-pulse" />
          <div className="mt-2 h-3 rounded bg-neutral-300 dark:bg-neutral-700 animate-pulse w-28 sm:w-32 lg:w-36 xl:w-40" />
        </div>
      ))}
    </div>
  );
}

function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0">
      <div className="w-28 h-40 sm:w-32 sm:h-44 lg:w-36 lg:h-52 xl:w-40 xl:h-56 rounded-xl bg-neutral-300 dark:bg-neutral-700 animate-pulse" />
      <div className="mt-2 h-3 rounded bg-neutral-300 dark:bg-neutral-700 animate-pulse w-28 sm:w-32 lg:w-36 xl:w-40" />
    </div>
  );
}

export function MovieSection({
  kategori,
  providerSlug,
  categories,
  newRelease,
  genres,
  genreDramas,
  genreCount,
  sectionNumber,
  totalSections,
  providerIndex,
  isLoading,
}: MovieSectionProps) {
  const router = useRouter();
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMovieClick = (movieId: string, type?: number) => {
    const url =
      kategori === "drama"
        ? `/${kategori}/detail/${movieId}/${type || 1}`
        : `/${kategori}/${providerSlug}/detail/${movieId}`;
    router.push(url);
  };

  const handleSeeAll = (categoryId: string) => {
    const genreIdMatch = categoryId.match(/^genre-(\d+)$/);
    if (genreIdMatch) {
      router.push(`/${kategori}/${providerSlug}/search/${genreIdMatch[1]}`);
    }
  };

  const scroll = useCallback((index: number, direction: "left" | "right") => {
    const container = scrollRefs.current[index];
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -CARD_SCROLL_AMOUNT : CARD_SCROLL_AMOUNT,
        behavior: "smooth",
      });
    }
  }, []);

  const setScrollRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      scrollRefs.current[index] = el;
    },
    [],
  );

  const processedCategories = useMemo(() => {
    const result: MovieCategory[] = [];

    if (newRelease && newRelease.length > 0) {
      result.push({
        id: "new-release",
        title: "New Release",
        movies: newRelease.map(mapDramaToMovie),
      });
    }

    if (genres && genres.length > 0 && genreCount) {
      const genresToAdd = genres.slice(0, genreCount);
      genresToAdd.forEach((genre) => {
        const dramas = genreDramas?.[genre.genreId] || [];
        result.push(genreToCategory(genre, dramas, kategori));
      });
    }

    return result;
  }, [newRelease, genres, genreDramas, genreCount, kategori]);

  useEffect(() => {
    scrollRefs.current = scrollRefs.current.slice(
      0,
      processedCategories.length,
    );
  }, [processedCategories.length]);

  return (
    <SectionContainer
      sectionNumber={sectionNumber}
      showSectionIndicator={true}
      totalSections={totalSections}
    >
      {/* Background Decorations */}
      <BackgroundDecorations variant="movies" />

      {/* Gradient Blurs */}
      <SectionBackground variant="gradient" />

      {/* Content */}
      <SectionContent className="items-center px-0 sm:px-0 lg:px-0 xl:px-0">
        <div className="space-y-6 lg:space-y-8 xl:space-y-10 max-w-7xl w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Loading state */}
          {isLoading && (
            <>
              {Array.from({ length: 2 }).map((_, rowIdx) => (
                <div key={`skel-row-${rowIdx}`}>
                  <div className="h-5 w-32 rounded bg-neutral-300 dark:bg-neutral-700 animate-pulse mb-3 lg:mb-4" />
                  <MovieSkeleton />
                </div>
              ))}
            </>
          )}

          {/* Empty state */}
          {!isLoading && processedCategories.length === 0 && (
            <EmptyState
              title="Konten Belum Tersedia"
              description="Kategori konten untuk provider ini belum siap. Silakan pilih provider lain atau coba lagi nanti."
            />
          )}

          {/* Categories */}
          {!isLoading &&
            processedCategories.map((category, catIndex) => (
              <div key={category.id}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h2 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                  {category.id.startsWith("genre-") && (
                    <button
                      onClick={() => handleSeeAll(category.id)}
                      className="flex items-center gap-1 text-xs lg:text-sm text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-white/80 transition-colors"
                    >
                      Semua
                      <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  )}
                </div>

                {/* Movies */}
                <div className="relative group">
                  {/* Left Arrow */}
                  <button
                    onClick={() => scroll(catIndex, "left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 lg:w-10 lg:h-10 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex shadow-lg"
                  >
                    <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={() => scroll(catIndex, "right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 lg:w-10 lg:h-10 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex shadow-lg"
                  >
                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>

                  {/* Movie Cards */}
                  <div
                    ref={setScrollRef(catIndex)}
                    className="flex gap-3 sm:gap-4 lg:gap-5 xl:gap-6 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth py-3 lg:py-4"
                  >
                    {/* Empty movies skeleton */}
                    {category.movies.length === 0 &&
                      Array.from({ length: 6 }).map((_, i) => (
                        <MovieCardSkeleton key={`movie-skel-${i}`} />
                      ))}

                    {category.movies.map((movie) => {
                      // For drama provider, assume type 1 if not specified
                      const isType1 = isType1ForKategori(kategori, movie.type);
                      return (
                        <div
                          key={movie.id}
                          className="flex-shrink-0"
                          onClick={() => handleMovieClick(movie.id, movie.type)}
                        >
                          <div className="w-28 h-40 sm:w-32 sm:h-44 lg:w-36 lg:h-52 xl:w-40 xl:h-56 bg-neutral-700 rounded-xl transition-transform hover:scale-105 cursor-pointer relative overflow-hidden">
                            <img
                              src={convertHeicUrl(movie.poster ?? "")}
                              alt={movie.title}
                              className={`w-full ${getCropClass(isType1, "h-full object-cover")}`}
                              onError={handleImageError}
                            />
                          </div>
                          <p className="mt-2 text-xs text-center text-gray-900 dark:text-white w-28 sm:w-32 lg:w-36 xl:w-40 truncate px-1">
                            {movie.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </SectionContent>
    </SectionContainer>
  );
}
