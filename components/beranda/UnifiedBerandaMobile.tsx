"use client";

import { useRouter } from "next/navigation";
import {
  CategoryTabs,
  SearchBar,
  HeroCarousel,
  MovieScrollSection,
  PromoBanner,
  MobileFooter,
  NewsItemComponent,
} from "@/components/beranda/mobile";
import { FAQSection } from "@/components/beranda/shared/FAQSection";
import {
  createCategoryFromDramas,
  getGenreName,
} from "@/components/beranda/utils";
import { getProviderPageSlug } from "@/components/beranda/utils/constants";
import type {
  Provider,
  Drama,
  Genre,
  FAQItem,
  PromoData,
  HeroData,
  BerandaData,
} from "@/components/beranda/types";

interface UnifiedBerandaMobileProps {
  providers: Provider[];
  recommendations: Drama[];
  newRelease: Drama[];
  genres: Genre[];
  genreDramas: Record<number, Drama[]>;
  selectedProvider: Provider;
  selectedProviderIndex: number;
  berandaData: BerandaData;
  visibleGenreCount: number;
  totalGenreCount: number;
  onLoadMoreGenres: () => void;
  isLoadingMoreGenres: boolean;
  onProviderChange: (provider: Provider, index: number) => void;
}

export function UnifiedBerandaMobile({
  providers,
  recommendations,
  newRelease,
  genres,
  genreDramas,
  selectedProvider,
  selectedProviderIndex,
  berandaData,
  visibleGenreCount,
  totalGenreCount,
  onLoadMoreGenres,
  isLoadingMoreGenres,
  onProviderChange,
}: UnifiedBerandaMobileProps) {
  const mobileGenres = genres.slice(0, visibleGenreCount);
  const hasMoreGenres = totalGenreCount > visibleGenreCount;

  const router = useRouter();

  const handleProviderSelect = (index: number) => {
    const provider = providers[index];
    if (provider) {
      const slug = getProviderPageSlug(provider, providers, index);
      router.push(`/${slug}`);
    }
  };

  const renderMobileGenreSection = (startIndex: number, endIndex: number) => {
    return mobileGenres.slice(startIndex, endIndex).map((genre) => {
      const dramas = genreDramas?.[genre.genreId] || [];
      return (
        <MovieScrollSection
          key={genre.genreId}
          category={createCategoryFromDramas(
            `genre-${genre.genreId}`,
            getGenreName(genre, selectedProvider.kategori),
            dramas,
          )}
          kategori={selectedProvider.kategori}
          providerSlug={selectedProvider.slug}
        />
      );
    });
  };

  return (
    <div className="lg:hidden relative z-10 pt-20">
      <CategoryTabs
        providers={providers}
        activeTab={selectedProviderIndex}
        setActiveTab={handleProviderSelect}
      />
      <SearchBar
        kategori={selectedProvider.kategori}
        providerSlug={selectedProvider.slug}
      />
      <HeroCarousel
        hero={berandaData.hero}
        dramas={recommendations}
        kategori={selectedProvider.kategori}
        providerSlug={selectedProvider.slug}
      />

      {renderMobileGenreSection(0, 2)}

      <div className="px-4 py-2 mb-2">
        <p className="text-[15px] font-semibold text-center text-gray-900 dark:text-white">
          Ingin Menonton Drama Lancar Tanpa Gangguan ?
        </p>
      </div>

      <PromoBanner promo={berandaData.promo} />

      {renderMobileGenreSection(2, 4)}

      {newRelease.length > 0 && (
        <div className="px-4 mb-6">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
              New Release
            </h2>
            <p className="text-[9px] text-gray-500 dark:text-white/60 mt-0.5">
              Update terbaru seputar tayangan favorit anda
            </p>
          </div>
          <div>
            {newRelease.map((drama) => (
              <NewsItemComponent
                key={`nr-${drama.id}`}
                item={{
                  id: drama.id,
                  title: drama.title,
                  description:
                    drama.descriptions ||
                    drama.description ||
                    `Episode terbaru dari ${drama.title} telah tersedia...`,
                  views: drama.playCount || "1.0M",
                  duration: "54",
                  thumbnail: drama.coverImage,
                  type: drama.type,
                }}
                kategori={selectedProvider.kategori}
                providerSlug={selectedProvider.slug}
              />
            ))}
          </div>
        </div>
      )}

      {mobileGenres
        .slice(4)
        .reduce<(typeof mobileGenres)[]>((groups, _, i) => {
          if (i % 2 === 0) {
            groups.push(mobileGenres.slice(4 + i, 4 + i + 2));
          }
          return groups;
        }, [])
        .filter((group) => group.length > 0)
        .map((group) => (
          <div key={`genre-group-${group[0]?.genreId || group.length}`}>
            {group.map((genre) => {
              const dramas = genreDramas?.[genre.genreId] || [];
              return (
                <MovieScrollSection
                  key={genre.genreId}
                  category={createCategoryFromDramas(
                    `genre-${genre.genreId}`,
                    getGenreName(genre, selectedProvider.kategori),
                    dramas,
                  )}
                  kategori={selectedProvider.kategori}
                  providerSlug={selectedProvider.slug}
                />
              );
            })}
          </div>
        ))}

      {/* Load More Button */}
      {hasMoreGenres && onLoadMoreGenres && (
        <div className="px-4 py-6 flex justify-center">
          <button
            onClick={onLoadMoreGenres}
            disabled={isLoadingMoreGenres}
            className="flex items-center gap-2 px-6 py-3 bg-[#3477d7] hover:bg-[#2a5fb8] disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white text-sm font-medium transition-colors"
          >
            {isLoadingMoreGenres ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memuat...</span>
              </>
            ) : (
              <>
                <span>Lihat Lebih Banyak</span>
                <span className="text-xs">({totalGenreCount - visibleGenreCount} lagi)</span>
              </>
            )}
          </button>
        </div>
      )}

      <FAQSection faqs={berandaData.faqs} />
      <MobileFooter />
    </div>
  );
}
