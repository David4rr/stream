"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie, MovieCategory, PromoData, Kategori } from "../types";
import { convertHeicUrl, getCropClass, handleImageError, isType1ForKategori } from "@/lib/image-utils";

export function MovieCard({
  movie,
  kategori,
  providerSlug,
}: {
  movie: Movie;
  kategori: Kategori;
  providerSlug: string;
}) {
  const router = useRouter();
  const isType1 = isType1ForKategori(kategori, movie.type);

  const handleClick = () => {
    const url = kategori === "drama"
      ? `/${kategori}/detail/${movie.id}/${movie.type || 1}`
      : `/${kategori}/${providerSlug}/detail/${movie.id}`;
    router.push(url);
  };

  return (
    <div className="flex-shrink-0" onClick={handleClick}>
      <div className="w-[141px] h-[175px] rounded-[15px] bg-neutral-700 dark:bg-neutral-800 overflow-hidden mb-2 relative cursor-pointer">
        {movie.poster ? (
          <img
            src={convertHeicUrl(movie.poster)}
            alt={movie.title}
            className={`absolute top-0 left-0 right-0 w-full ${getCropClass(isType1, "h-full object-cover")}`}
            onError={handleImageError}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        )}
      </div>
      <p className="text-[11px] text-center text-gray-900 dark:text-white truncate w-[141px] px-1">
        {movie.title}
      </p>
    </div>
  );
}

export function MovieScrollSection({
  category,
  kategori,
  providerSlug,
}: {
  category: MovieCategory;
  kategori: Kategori;
  providerSlug: string;
}) {
  const router = useRouter();

  const handleSeeAll = () => {
    const genreIdMatch = category.id.match(/^genre-(\d+)$/);
    if (genreIdMatch) {
      const genreId = genreIdMatch[1];
      router.push(`/${kategori}/${providerSlug}/search/${genreId}`);
    }
  };

  const isLoading = category.movies.length === 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-4">
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
          {category.title}
        </h2>
        {category.id.startsWith("genre-") && (
          <Button
            onClick={handleSeeAll}
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent flex items-center gap-1"
          >
            <span className="text-[11px] font-medium text-gray-600 dark:text-white/70">
              Semua
            </span>
            <ChevronRight className="w-3 h-3 text-gray-600 dark:text-white/70" />
          </Button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-[141px] h-[175px] rounded-[15px] bg-neutral-300 dark:bg-neutral-700 animate-pulse mb-2" />
              <div className="w-[141px] h-3 rounded bg-neutral-300 dark:bg-neutral-700 animate-pulse" />
            </div>
          ))
        ) : (
          category.movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              kategori={kategori}
              providerSlug={providerSlug}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function PromoBanner({ promo }: { promo: PromoData }) {
  return (
    <div className="px-4 mb-6">
      <div className="h-[201px] rounded-2xl p-[30px] flex flex-col justify-center bg-[linear-gradient(192.45deg,#3477d7_18.78%,#1b3f71_92.74%)]">
        <h3 className="text-[21px] font-semibold text-white leading-tight mb-1">
          <span className="block">{promo.title}</span>
          <span className="block">{promo.subtitle}</span>
        </h3>
        <p className="text-[10px] text-white/90 leading-relaxed mb-4 max-w-[312px]">
          {promo.description}
        </p>
        <Button className="w-[84px] h-[22px] bg-white rounded-[17.5px] text-black hover:bg-gray-100 text-[10px] font-bold p-0">
          {promo.ctaText}
        </Button>
      </div>
    </div>
  );
}

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  views?: string;
  duration?: string;
  thumbnail?: string;
  type?: number;
};

export function NewsItemComponent({
  item,
  kategori,
  providerSlug,
}: {
  item: NewsItem;
  kategori: Kategori;
  providerSlug: string;
}) {
  const router = useRouter();
  const isType1 = item.type === 1;

  const handleClick = () => {
    const url = kategori === "drama"
      ? `/${kategori}/detail/${item.id}/${item.type || 1}`
      : `/${kategori}/${providerSlug}/detail/${item.id}`;
    router.push(url);
  };

  return (
    <div
      className="flex items-start gap-3 mb-4 cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-[83px] h-[83px] rounded-[7px] bg-neutral-300 dark:bg-neutral-700 overflow-hidden flex-shrink-0 relative">
        {item.thumbnail ? (
          <img
            src={convertHeicUrl(item.thumbnail)}
            alt={item.title}
            className={`absolute top-0 left-0 right-0 w-full ${
              isType1
                ? "h-[300%] object-top object-cover"  // More aggressive crop for type 1 in small square
                : "h-full object-cover"
            }`}
            onError={handleImageError}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        )}
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[15px] text-gray-900 dark:text-white leading-tight flex-1 truncate">
            {item.title}
          </h4>
          <span className="text-[5px] font-semibold text-gray-600 dark:text-[#66686a] border border-gray-400 dark:border-[#66686a] rounded px-1 py-0.5 flex-shrink-0">
            News
          </span>
        </div>
        <p className="text-[9px] font-light text-gray-600 dark:text-white/70 mt-1 line-clamp-1">
          {item.description}
        </p>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Eye className="w-2 h-2 text-gray-500 dark:text-[#66686a]" />
            <span className="text-[7px] text-gray-500 dark:text-[#66686a]">
              {item.views || "4.9M"}
            </span>
          </div>
          {item.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-2 h-2 text-gray-500 dark:text-[#66686a]" />
              <span className="text-[7px] text-gray-500 dark:text-[#66686a]">
                {item.duration}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NewsSection({
  newsItems,
  kategori,
  providerSlug,
}: {
  newsItems: NewsItem[];
  kategori: Kategori;
  providerSlug: string;
}) {
  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            CIDWatch New
          </h2>
          <p className="text-[9px] text-gray-500 dark:text-white/60 mt-0.5">
            Update terbaru seputar tayangan favorit anda
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 hover:bg-transparent flex items-center gap-1"
        >
          <span className="text-[11px] font-medium text-gray-600 dark:text-white/70">
            Semua
          </span>
          <ChevronRight className="w-3 h-3 text-gray-600 dark:text-white/70" />
        </Button>
      </div>

      <div>
        {newsItems.map((item) => (
          <NewsItemComponent
            key={item.id}
            item={item}
            kategori={kategori}
            providerSlug={providerSlug}
          />
        ))}
      </div>
    </div>
  );
}
