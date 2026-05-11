"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { HeroData, Movie, Drama, Kategori } from "../types";
import { convertHeicUrl, handleImageError } from "@/lib/image-utils";

interface HeroCarouselProps {
  hero: HeroData;
  dramas?: Drama[];
  movies?: Movie[];
  kategori: Kategori;
  providerSlug: string;
}

export function HeroCarousel({
  hero,
  dramas,
  movies,
  kategori,
  providerSlug,
}: HeroCarouselProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const SLIDE_WIDTH = 339;

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const newSlide = Math.round(container.scrollLeft / SLIDE_WIDTH);
    setCurrentSlide(newSlide);
  }, [SLIDE_WIDTH]);

  const slides =
    dramas && dramas.length > 0
      ? dramas.slice(0, 12).map((drama) => ({
          id: drama.id,
          title: drama.title,
          description:
            drama.descriptions || drama.description || hero.description,
          image: drama.coverImage || null,
          type: drama.type,
        }))
      : movies && movies.length > 0
        ? movies.slice(0, 5).map((movie) => ({
            id: movie.id,
            title: movie.title,
            description: hero.description,
            image: null,
            type: movie.type,
          }))
        : [
            {
              id: "h1",
              title: hero.title,
              description: hero.description,
              image: null,
              type: 1,
            },
            {
              id: "h2",
              title: hero.title,
              description: hero.description,
              image: null,
              type: 1,
            },
            {
              id: "h3",
              title: hero.title,
              description: hero.description,
              image: null,
              type: 1,
            },
          ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="mb-4">
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-[327px] h-[145px] mr-3 snap-center relative overflow-hidden rounded-xl"
          >
            {slide.image ? (
              <img
                src={convertHeicUrl(slide.image)}
                alt={slide.title}
                className={slide.type === 1 ? "w-full h-[200%] object-top object-cover" : "w-full h-full object-cover"}
                onError={handleImageError}
              />
            ) : (
              <div className="absolute inset-0 bg-[#d9d9d9]">
                <div className="absolute right-0 top-0 w-[164px] h-[204px] -translate-y-12 bg-neutral-700/50 animate-pulse" />
                <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-transparent dark:to-black bg-gradient-to-br from-transparent to-black/60" />
              </div>
            )}

            {/* Overlay gradient when image exists */}
            {slide.image && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            )}

            <div className="absolute inset-0 p-[18px] flex flex-col justify-center">
              <h3 className="text-[11px] font-semibold text-white mb-1 truncate">
                {slide.title}
              </h3>
              <p className="w-[197px] text-[8px] text-justify text-white/90 mb-4 line-clamp-2">
                {slide.description}
              </p>
              <button
                onClick={() => {
                  const slideType = slide.type ?? 1;
                  const url = kategori === "drama"
                    ? `/${kategori}/detail/${slide.id}/${slideType}`
                    : `/${kategori}/${providerSlug}/detail/${slide.id}`;
                  router.push(url);
                }}
                className="w-[72px] h-[19px] bg-white rounded-[17.5px] flex items-center justify-center"
              >
                <span className="text-[8px] font-semibold text-black">
                  {kategori === 'manga' ? 'Baca' : 'Tonton'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-1.5 mt-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
              index === currentSlide
                ? "bg-gray-900 dark:bg-white"
                : "bg-gray-900/50 dark:bg-white/50"
            }`}
            onClick={() => {
              const container = containerRef.current;
              if (container) {
                container.scrollTo({
                  left: SLIDE_WIDTH * index,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
