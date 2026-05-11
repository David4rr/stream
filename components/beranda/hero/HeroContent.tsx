"use client";

import { useRouter } from "next/navigation";
import { Play, List, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroData, Drama, Kategori } from "../types";

interface HeroContentProps {
  hero: HeroData;
  activeDrama: Drama | null;
  kategori: Kategori;
  providerSlug: string;
  isLoading?: boolean;
}

/**
 * Hero content component.
 * Displays title, buttons, and description with responsive layout.
 */
export function HeroContent({
  hero,
  activeDrama,
  kategori,
  providerSlug,
  isLoading,
}: HeroContentProps) {
  const router = useRouter();


  const displayTitle = activeDrama?.title || hero.title;
  const displayDescription =
    activeDrama?.descriptions || activeDrama?.description || hero.description;
  const displayCategory = hero.category;
  const displayEpisodes = activeDrama?.chapterCount || hero.episodes;
  const displayViews = activeDrama?.playCount || hero.views;
  const dramaId = activeDrama?.id;

  const handleWatchClick = () => {
    if (dramaId) {
      kategori === "drama"
        ? router.push(`/${kategori}/detail/${String(dramaId)}/${activeDrama?.type}`)
        : router.push(`/${kategori}/${providerSlug}/detail/${String(dramaId)}`);
    }
  };

  const handleViewAllClick = () => {
    router.push(`/${kategori}/${providerSlug}/search`);
  };

  // Show skeleton when loading or no drama available
  const showSkeleton = isLoading || !activeDrama;

  return (
    <div className="max-w-2xl xl:max-w-3xl">
      {/* Title */}
      {showSkeleton ? (
        <div className="mb-3 lg:mb-4 xl:mb-6 space-y-2">
          <div className="h-8 lg:h-10 xl:h-12 w-3/4 rounded-lg bg-neutral-300/40 dark:bg-neutral-700/60 animate-pulse" />
          <div className="h-8 lg:h-10 xl:h-12 w-1/2 rounded-lg bg-neutral-300/30 dark:bg-neutral-700/40 animate-pulse" />
        </div>
      ) : (
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4 xl:mb-6 leading-tight line-clamp-1">
          {displayTitle}
        </h1>
      )}

      {/* Badges */}
      {showSkeleton ? (
        <div className="hidden md:flex items-center gap-2 mb-3 lg:mb-4">
          <div className="h-6 w-20 rounded-full bg-neutral-300/40 dark:bg-neutral-700/60 animate-pulse" />
          <div className="h-6 w-16 rounded-full bg-neutral-300/30 dark:bg-neutral-700/40 animate-pulse" />
          <div className="h-4 w-24 rounded bg-neutral-300/30 dark:bg-neutral-700/30 animate-pulse" />
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-2 mb-3 lg:mb-4">
          <span className="px-2 lg:px-3 py-1 rounded-full bg-[#3477d7]/40 border border-white/20 text-white text-xs lg:text-sm">
            {displayCategory}
          </span>
          <span className="px-2 lg:px-3 py-1 rounded-full border border-white/20 text-white text-xs lg:text-sm">
            {displayEpisodes} {kategori === 'manga' ? 'Ch' : 'Eps'}
          </span>
          <span className="text-xs lg:text-sm text-white/70">
            {displayViews}
          </span>
        </div>
      )}

      {/* Description */}
      {showSkeleton ? (
        <div className="mb-4 lg:mb-6 xl:mb-8 space-y-2 max-w-xl xl:max-w-2xl">
          <div className="h-3 lg:h-4 rounded bg-neutral-300/40 dark:bg-neutral-700/50 animate-pulse" />
          <div className="h-3 lg:h-4 rounded bg-neutral-300/40 dark:bg-neutral-700/50 animate-pulse w-11/12" />
          <div className="h-3 lg:h-4 rounded bg-neutral-300/40 dark:bg-neutral-700/50 animate-pulse w-4/5" />
          <div className="h-3 lg:h-4 rounded bg-neutral-300/40 dark:bg-neutral-700/40 animate-pulse w-2/3" />
        </div>
      ) : (
        <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-white/90 text-justify mb-4 lg:mb-6 xl:mb-8 leading-relaxed max-w-xl xl:max-w-2xl line-clamp-4">
          {displayDescription}
        </p>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-2 lg:gap-3">
        <Button
          onClick={handleWatchClick}
          disabled={!dramaId}
          className="rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-300 font-bold px-6 py-5 lg:px-8 lg:py-6 text-xs lg:text-sm shadow-lg hover:shadow-xl"
        >
          {kategori === 'manga' ? (
            <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
          ) : (
            <Play className="w-4 h-4 lg:w-5 lg:h-5 fill-current mr-2" />
          )}
          {kategori === 'manga' ? 'Baca' : 'Tonton'}
        </Button>
        <Button
          onClick={handleViewAllClick}
          variant="outline"
          className="rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white hover:border-white/50 transition-all duration-300 font-medium px-6 py-5 lg:px-8 lg:py-6 text-xs lg:text-sm backdrop-blur-sm"
        >
          <List className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
          <span className="hidden sm:inline">Lihat Semua</span>
          <span className="sm:hidden">Lihat Semua</span>
        </Button>
      </div>
    </div>
  );
}
