"use client";

import { useCallback } from "react";
import type { HeroData, Provider, Drama } from "./types";
import { HeroContent, FeaturedCarousel, HeroBackground } from "./hero";
import { SectionContainer, BackgroundDecorations } from "./shared";

interface HeroSectionProps {
  providers: Provider[];
  recommendations: Drama[];
  isLoading?: boolean;
  selectedProvider: Provider;
  selectedProviderIndex: number;
  selectedCardIndex: number;
  onCardChange: (index: number) => void;
  onProviderChange: (provider: Provider, index: number) => void;
  hero: HeroData;
}

export function HeroSection({
  recommendations,
  isLoading,
  selectedProvider,
  selectedCardIndex,
  onCardChange,
  hero,
}: HeroSectionProps) {
  const activeDrama = recommendations[selectedCardIndex] || null;
  const displayCover = activeDrama?.coverImage;
  const displayTitle = activeDrama?.title || hero.title;
  const displayType = activeDrama?.type;

  const handleCardClick = useCallback(
    (index: number) => {
      onCardChange(index);
    },
    [onCardChange],
  );

  return (
    <SectionContainer
      sectionNumber={1}
      className="h-full min-h-screen w-full relative overflow-hidden"
    >
      <BackgroundDecorations variant="hero" />
      <HeroBackground coverImage={displayCover} title={displayTitle} type={displayType} />

      <div className="relative z-10 h-full min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-end pt-36">
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16 mb-4 lg:mb-0">
            <HeroContent
              hero={hero}
              activeDrama={activeDrama}
              kategori={selectedProvider.kategori}
              providerSlug={selectedProvider.slug}
              isLoading={isLoading}
            />
          </div>

          <div className="w-full">
            <FeaturedCarousel
              recommendations={recommendations}
              isLoading={isLoading}
              selectedCardIndex={selectedCardIndex}
              onCardChange={handleCardClick}
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
