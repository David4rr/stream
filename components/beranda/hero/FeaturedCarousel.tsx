"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { convertHeicUrl, getCropClass, handleImageError } from "@/lib/image-utils";
import type { Drama } from "../types";
import {
  SCROLL_PERCENTAGE,
  ARROW_SCROLL_THRESHOLD,
  EmptyStateIcon,
} from "../utils";

interface FeaturedCarouselProps {
  recommendations: Drama[];
  isLoading?: boolean;
  selectedCardIndex: number;
  onCardChange: (index: number) => void;
}

function CarouselCardSkeleton({ index }: { index: number }) {
  const isFirst = index === 0;
  return (
    <div className="flex-shrink-0">
      <div
        className={`rounded-xl overflow-hidden animate-pulse bg-neutral-700/60 ${
          isFirst
            ? "w-24 h-36 sm:w-28 sm:h-40 lg:w-32 lg:h-48 xl:w-36 xl:h-52"
            : "w-20 h-30 sm:w-24 sm:h-36 lg:w-28 lg:h-44 xl:w-32 xl:h-48 opacity-60"
        }`}
      />
      <div className="mt-2 lg:mt-3 h-3 rounded bg-neutral-700/50 animate-pulse w-20 sm:w-24 lg:w-28 xl:w-32 mx-auto" />
    </div>
  );
}

/**
 * Featured movies carousel component.
 * Centered, 3-card visible style with white rings for active items.
 */
export function FeaturedCarousel({
  recommendations,
  isLoading,
  selectedCardIndex,
  onCardChange,
}: FeaturedCarouselProps) {
  const isEmpty = !isLoading && recommendations.length === 0;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > ARROW_SCROLL_THRESHOLD);
      setShowRightArrow(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - ARROW_SCROLL_THRESHOLD,
      );
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrows);
      updateArrows();
      window.addEventListener("resize", updateArrows);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateArrows);
      }
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scroll = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * SCROLL_PERCENTAGE;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="relative pb-10 lg:pb-16 flex justify-center w-full pointer-events-none">
      <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] xl:max-w-[560px] pointer-events-auto">
        {/* Navigation Buttons */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 lg:-left-6 top-[40%] -translate-y-1/2 z-30 p-1.5 lg:p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-all duration-300 shadow-lg border border-white/10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 lg:-right-6 top-[40%] -translate-y-1/2 z-30 p-1.5 lg:p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-all duration-300 shadow-lg border border-white/10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        )}

        {/* Gradient Masks */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-black/20 to-transparent pointer-events-none transition-opacity duration-300 ${showLeftArrow ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-black/20 to-transparent pointer-events-none transition-opacity duration-300 ${showRightArrow ? "opacity-100" : "opacity-0"}`}
        />

        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 lg:gap-6 xl:gap-8 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth py-6 px-2 lg:py-8"
        >
          {/* Skeleton cards when loading */}
          {(isLoading || recommendations.length === 0) && !isEmpty
            ? Array.from({ length: 5 }).map((_, i) => (
                <CarouselCardSkeleton key={`skel-${i}`} index={i} />
              ))
            : null}

          {/* Empty state */}
          {isEmpty ? (
            <div className="flex items-center justify-center w-full py-8 px-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-700/60 flex items-center justify-center mx-auto mb-3">
                  <EmptyStateIcon />
                </div>
                <p className="text-sm text-gray-400">
                  Konten belum tersedia untuk provider ini
                </p>
              </div>
            </div>
          ) : null}

          {recommendations.slice(0, 12).map((drama, index) => (
            <div
              key={drama.id}
              onClick={() => onCardChange(index)}
              className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
            >
              <div
                className={`rounded-xl overflow-hidden relative transition-all duration-300 shadow-md ${
                  index === selectedCardIndex
                    ? "w-24 h-36 sm:w-28 sm:h-40 lg:w-32 lg:h-48 xl:w-36 xl:h-52 ring-2 ring-white scale-105 z-20"
                    : "w-20 h-30 sm:w-24 sm:h-36 lg:w-28 lg:h-44 xl:w-32 xl:h-48 opacity-70 grayscale-[0.3]"
                }`}
              >
                {drama.coverImage ? (
                  <img
                    src={convertHeicUrl(drama.coverImage)}
                    alt={drama.title}
                    className={`w-full ${getCropClass(drama.type === 1, "h-full object-cover")}`}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 animate-pulse" />
                )}
              </div>
              <p
                className={`mt-2 lg:mt-3 text-[10px] sm:text-xs text-center truncate w-20 sm:w-24 lg:w-28 xl:w-32 px-1 ${
                  index === selectedCardIndex
                    ? "text-white font-bold"
                    : "text-gray-400 dark:text-gray-400 font-medium"
                }`}
              >
                {drama.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
