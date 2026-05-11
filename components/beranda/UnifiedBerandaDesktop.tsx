"use client";

import {
  HeroSection,
  MovieSection,
  PromoSection,
  FAQSection,
  BerandaFooter,
  LoadMoreGenresButton,
} from "@/components/beranda";
import { SectionContainer } from "@/components/beranda/shared";
import {
  BackgroundCircles1,
  BackgroundCircles2,
  BackgroundDot2,
  BackgroundDot3,
} from "@/components/icons";
import type {
  Provider,
  Drama,
  Genre,
  PromoData,
  HeroData,
  BerandaData,
} from "@/components/beranda/types";

const GENRES_PER_SECTION = 2;

interface UnifiedBerandaDesktopProps {
  providers: Provider[];
  recommendations: Drama[];
  newRelease: Drama[];
  genres: Genre[];
  genreDramas: Record<number, Drama[]>;
  isLoadingGenreDramas?: boolean;
  selectedProvider: Provider;
  selectedProviderIndex: number;
  selectedCardIndex: number;
  isContentLoading: boolean;
  berandaData: BerandaData;
  totalSections: number;
  visibleGenreCount: number;
  totalGenreCount: number;
  onLoadMoreGenres: () => void;
  isLoadingMoreGenres: boolean;
  onProviderChange: (provider: Provider, index: number) => void;
  onCardChange: (index: number) => void;
}

export function UnifiedBerandaDesktop({
  providers,
  recommendations,
  newRelease,
  genres,
  genreDramas,
  isLoadingGenreDramas,
  selectedProvider,
  selectedProviderIndex,
  selectedCardIndex,
  isContentLoading,
  berandaData,
  totalSections,
  visibleGenreCount,
  totalGenreCount,
  onLoadMoreGenres,
  isLoadingMoreGenres,
  onProviderChange,
  onCardChange,
}: UnifiedBerandaDesktopProps) {
  const activeDrama = recommendations[selectedCardIndex];
  const activeBackground = activeDrama?.coverImage;
  const activeDramaType = activeDrama?.type;

  const hasFirstGenre = visibleGenreCount >= 1;
  const firstGenre = hasFirstGenre ? genres[0] : null;
  const remainingGenres = hasFirstGenre ? genres.slice(1, visibleGenreCount) : [];
  const remainingGenreCount = totalGenreCount - visibleGenreCount;
  const hasMoreGenres = remainingGenreCount > 0;
  const remainingGenreSections = Math.ceil(
    remainingGenres.length / GENRES_PER_SECTION,
  );
  const faqSectionNumber = 4 + remainingGenreSections;

  return (
    <div className="hidden lg:block">
      <SectionContainer
        key={`section-1-${totalSections}`}
        sectionNumber={1}
        showSectionIndicator={true}
        totalSections={totalSections}
        className="min-h-screen lg:min-h-screen relative pt-16 lg:pt-0"
      >
        <HeroSection
          providers={providers}
          recommendations={recommendations}
          isLoading={isContentLoading || isLoadingGenreDramas}
          selectedProvider={selectedProvider}
          selectedProviderIndex={selectedProviderIndex}
          selectedCardIndex={selectedCardIndex}
          onCardChange={onCardChange}
          onProviderChange={onProviderChange}
          hero={berandaData.hero}
        />
      </SectionContainer>

      <SectionContainer
        sectionNumber={2}
        showSectionIndicator={true}
        totalSections={totalSections}
        className="min-h-screen lg:min-h-screen relative flex flex-col"
      >
        <MovieSection
          kategori={selectedProvider.kategori}
          providerSlug={selectedProvider.slug}
          categories={[]}
          newRelease={newRelease}
          genres={firstGenre ? [firstGenre] : []}
          genreDramas={genreDramas}
          genreCount={firstGenre ? 1 : 0}
          sectionNumber={2}
          totalSections={totalSections}
          providerIndex={selectedProviderIndex}
          isLoading={isContentLoading}
        />
      </SectionContainer>

      <SectionContainer
        sectionNumber={3}
        showSectionIndicator={true}
        totalSections={totalSections}
        className="min-h-screen lg:min-h-screen relative flex flex-col"
      >
        <PromoSection
          promo={berandaData.promo}
          sectionNumber={3}
          backgroundImage={activeBackground}
          backgroundImageType={activeDramaType}
          totalSections={totalSections}
        />
      </SectionContainer>

      {Array.from({ length: remainingGenreSections }).map(
        (_, sectionIndex) => {
          const startIdx = sectionIndex * GENRES_PER_SECTION;
          const endIdx = startIdx + GENRES_PER_SECTION;
          const sectionGenres = remainingGenres.slice(startIdx, endIdx);
          const sectionNumber = 4 + sectionIndex;

          return (
            <SectionContainer
              key={`genre-section-${sectionIndex}`}
              sectionNumber={sectionNumber}
              showSectionIndicator={true}
              totalSections={totalSections}
              className="min-h-screen lg:min-h-screen relative flex flex-col"
            >
              <MovieSection
                kategori={selectedProvider.kategori}
                providerSlug={selectedProvider.slug}
                categories={[]}
                newRelease={undefined}
                genres={sectionGenres}
                genreDramas={genreDramas}
                genreCount={sectionGenres.length}
                sectionNumber={sectionNumber}
                totalSections={totalSections}
                providerIndex={selectedProviderIndex}
                isLoading={isContentLoading || isLoadingGenreDramas}
              />
            </SectionContainer>
          );
        },
      )}

      <LoadMoreGenresButton
        onLoadMore={onLoadMoreGenres}
        isLoading={isLoadingMoreGenres}
        remainingCount={remainingGenreCount}
        hidden={!hasMoreGenres}
      />

      <SectionContainer
        key={`section-faq-${totalSections}`}
        sectionNumber={faqSectionNumber}
        showSectionIndicator={true}
        totalSections={totalSections}
        className="h-screen lg:h-screen"
      >
        <div className="absolute top-8 right-8 hidden lg:block z-0">
          <BackgroundCircles1 />
        </div>
        <div className="absolute bottom-8 left-8 hidden lg:block z-0">
          <BackgroundCircles2 />
        </div>
        <div className="absolute top-1/4 right-1/4 hidden lg:block z-0">
          <BackgroundDot2 />
        </div>
        <div className="absolute bottom-1/3 left-1/3 hidden lg:block z-0">
          <BackgroundDot3 />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-0 py-8 lg:py-12">
          <div className="w-full max-w-7xl px-4 sm:px-8 lg:px-12 xl:px-16">
            <FAQSection faqs={berandaData.faqs} />
          </div>
        </div>
      </SectionContainer>

      <footer className="bg-white dark:bg-[#0e0e0e] border-t border-gray-200 dark:border-white/10">
        <div className="px-8 lg:px-16 py-12">
          <BerandaFooter
            sections={berandaData.footer.sections}
            copyright={berandaData.footer.copyright}
            legalLinks={berandaData.footer.legalLinks}
          />
        </div>
      </footer>
    </div>
  );
}
