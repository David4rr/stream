"use client";

/**
 * Favorites Client Component
 */

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateFavorite } from "@/store/favorites-slice";
import type { FavoriteDrama } from "@/app/actions/favorites";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCropClass } from "@/lib/image-utils";
import { useProgressiveFavorites } from "@/hooks/useProgressiveFavorites";

interface FavoritesClientProps {
  initialFavorites: FavoriteDrama[];
  apiBaseUrl: string;
}

export function FavoritesClient({
  initialFavorites,
  apiBaseUrl,
}: FavoritesClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    favorites,
    loaded,
    total,
    isLoading,
    isComplete,
    error,
    progress,
    loadProgressively,
  } = useProgressiveFavorites(initialFavorites, apiBaseUrl);

  const [mounted, setMounted] = useState(false);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!hasStartedLoading && initialFavorites.length > 0) {
      setHasStartedLoading(true);

      loadProgressively({
        priorityCount: 10,
        batchSize: 10,
        delay: 100,
      });
    }
  }, [hasStartedLoading, initialFavorites.length, loadProgressively]);

  const getProviderSlug = (category: string | undefined, providerKey: string | undefined): string => {
    if (!category || !providerKey) return '';

    if (category === 'drama') {
      const typeNum = parseInt(providerKey.replace(/\D/g, ''), 10);
      return `d${typeNum || 1}`;
    }

    const providerMappings: Record<string, Record<string, string>> = {
      anime: {
        'animein': 'a1',
        'samehadaku': 'a2',
        'otakudesu': 'a3',
        'aniwatch': 'a4',
        'gogoanime': 'a5',
        '9anime': 'a6',
      },
      movies: {
        'rebahin': 'm1',
        'indoxxi': 'm2',
        'lk21': 'm3',
        'dunia21': 'm4',
        'cinemaindo': 'm5',
      },
      manga: {
        'komikku': 'mg1',
        'mangaku': 'mg2',
        'komikcast': 'mg3',
        'mangadex': 'mg4',
        'manganelo': 'mg5',
      },
    };

    if (/^[adm](g?\d+)$/.test(providerKey)) {
      return providerKey;
    }

    const mapping = providerMappings[category];
    if (mapping && mapping[providerKey]) {
      return mapping[providerKey];
    }

    if (providerKey.startsWith('a') && category === 'anime') return providerKey;
    if (providerKey.startsWith('m') && category === 'movies') return providerKey;
    if (providerKey.startsWith('mg') && category === 'manga') return providerKey;

    const defaultSlugs: Record<string, string> = {
      anime: 'a1',
      movies: 'm1',
      manga: 'mg1',
    };
    return defaultSlugs[category] || '';
  };

  const handleCardClick = (drama: FavoriteDrama) => {
    let category = drama.category;
    let providerKey = drama.providerKey;
    let sourceId = drama.sourceId;
    let type = drama.type;

    if (!category && drama.contentItem) {
      const { providerKey: pk, sourceId: sid } = drama.contentItem;
      providerKey = pk;
      sourceId = sid;

      if (pk.startsWith('d')) {
        category = 'drama';
        type = parseInt(pk.replace(/\D/g, ''), 10);
      } else if (pk.startsWith('a')) {
        category = 'anime';
      } else if (pk.startsWith('m') && !pk.startsWith('mg')) {
        category = 'movies';
      } else if (pk.startsWith('mg')) {
        category = 'manga';
      }
    }

    if (category && providerKey && sourceId) {
      if (category === 'drama') {
        const typeNum = type || parseInt(providerKey.replace(/\D/g, ''), 10);
        router.push(`/drama/detail/${String(sourceId)}/${typeNum}`);
      } else {
        const providerSlug = getProviderSlug(category, providerKey);
        router.push(`/${category}/${providerSlug}/detail/${String(sourceId)}`);
      }
    }
  };

  interface DisplayData {
    title: string;
    subtitle: string;
    coverImage?: string;
    category?: string;
    type?: number;
    isType1: boolean;
  }

  const getFavoriteDisplay = (drama: FavoriteDrama): DisplayData => {
    if (drama.title && drama.title !== drama.providerKey && !drama.title.includes(' • ')) {
      const isType1 = drama.category === 'drama' && drama.type === 1;

      return {
        title: drama.title,
        subtitle: drama.description || `${drama.providerKey || 'Unknown provider'} • ${drama.category || 'Unknown category'}`,
        coverImage: drama.coverImage,
        category: drama.category,
        type: drama.type,
        isType1: isType1 ?? false,
      };
    }

    if (drama.contentItem || drama.providerKey) {
      const providerKey = drama.contentItem?.providerKey || drama.providerKey;
      const sourceId = drama.contentItem?.sourceId || drama.sourceId;

      const isType1 = providerKey === 'd1' || providerKey?.startsWith('d1');

      const displayTitle = drama.title && drama.title !== `${providerKey} • ${sourceId}`
        ? drama.title
        : 'Data tidak tersedia';

      return {
        title: displayTitle,
        subtitle: drama.description || `${providerKey || 'Unknown provider'}`,
        coverImage: drama.coverImage,
        category: drama.category,
        type: drama.type || parseInt(providerKey?.replace(/\D/g, '') || '1', 10),
        isType1: isType1 ?? false,
      };
    }

    return {
      title: 'Data tidak tersedia',
      subtitle: 'Item details not available',
      coverImage: undefined,
      category: undefined,
      isType1: false,
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12 lg:pt-20 pt-20">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Favorit Saya
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {mounted ? total : initialFavorites.length} {mounted ? (total === 1 ? 'item' : 'items') : (initialFavorites.length === 1 ? 'item' : 'items')}
            {isLoading && mounted && (
              <span className="ml-2 text-[#3477d7]">
                • Loading {loaded}/{total} ({Math.round(progress)}%)
              </span>
            )}
          </p>
        </div>

        {/* Progress Bar */}
        {isLoading && mounted && loaded > 0 && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#3477d7] h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {!mounted && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10"
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-gray-200 dark:from-gray-700 to-gray-300 dark:to-gray-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {mounted && favorites.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Belum ada favorit
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              Mulai tambahkan drama, anime, atau film ke favorit Anda dengan mengklik ikon hati di halaman detail.
            </p>
            <button
              onClick={() => router.push("/beranda")}
              className="mt-6 px-6 py-2 rounded-full bg-[#3477d7] text-white font-medium hover:bg-[#2a5fb8] transition-colors"
            >
              Jelajahi Sekarang
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {mounted && favorites.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {favorites.map((drama, index) => {
              const display = getFavoriteDisplay(drama);

              const isJustLoaded = index < loaded && index >= loaded - 10;
              const animationClass = isJustLoaded && !isComplete
                ? 'animate-in fade-in slide-in-from-bottom-2 duration-300'
                : '';

              return (
                <div
                  key={drama.id}
                  onClick={() => handleCardClick(drama)}
                  className={`group relative aspect-[2/3] rounded-lg overflow-hidden bg-muted cursor-pointer w-full ${animationClass}`}
                >
                  {/* Cover Image */}
                  {display.coverImage ? (
                    <img
                      src={display.coverImage}
                      alt={display.title}
                      className={`w-full ${getCropClass(display.isType1, "h-full object-cover")} transition-transform duration-300 group-hover:scale-105`}
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm text-center px-2">
                        {display.title}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#3477D7]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-white text-2xl font-bold tracking-wider">
                        CIDWatch
                      </span>
                      <p className="text-white/80 text-sm mt-1">Tonton Sekarang</p>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
                      {display.title}
                    </h3>
                    {display.subtitle && (
                      <p className="text-white/70 text-xs line-clamp-1">
                        {display.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
