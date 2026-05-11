"use client";

import type { PromoData } from "./types";
import { SectionContainer, BackgroundDecorations } from "./shared";
import { convertHeicUrl, getCropClass, handleImageError } from "@/lib/image-utils";

interface PromoSectionProps {
  promo: PromoData;
  sectionNumber: number;
  backgroundImage?: string;
  totalSections?: number;
  backgroundImageType?: number;
}

function PromoBackground({ backgroundImage, backgroundImageType }: { backgroundImage?: string; backgroundImageType?: number }) {
  const isType1 = (backgroundImageType || 1) === 1;

  return (
    <>
      {backgroundImage && (
        <div className="absolute left-0 top-0 w-full lg:w-[55%] xl:w-[60%] h-full z-0">
          <img
            src={convertHeicUrl(backgroundImage)}
            alt="Promo Background"
            className={`w-full ${getCropClass(isType1, "h-full object-cover")}`}
            onError={handleImageError}
          />
          <div className="absolute inset-0 dark:bg-gradient-to-l dark:from-[#0e0e0e] dark:via-[#0e0e0e]/40 dark:to-transparent bg-gradient-to-l from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-transparent dark:via-black/20 dark:to-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}

      {/* Mobile Background with fallback gradient */}
      <div className="absolute inset-0 lg:hidden z-0">
        {backgroundImage ? (
          <>
            <img
              src={convertHeicUrl(backgroundImage)}
              alt="Promo Background"
              className={`w-full ${getCropClass(isType1, "h-full object-cover")}`}
              onError={handleImageError}
            />
            <div className="absolute inset-0 dark:bg-linear-to-t dark:from-[#0e0e0e] dark:via-[#0e0e0e]/60 dark:to-transparent bg-linear-to-t from-white via-white/70 to-transparent" />
          </>
        ) : (
          <>
            <div className="w-full h-full dark:bg-linear-to-t dark:from-[#0e0e0e] dark:via-neutral-800 dark:to-neutral-700 bg-linear-to-t from-gray-100 via-gray-50 to-white" />
            <div className="absolute inset-0 dark:bg-linear-to-t dark:from-[#0e0e0e] dark:via-[#0e0e0e]/80 dark:to-transparent bg-linear-to-t from-white via-white/80 to-transparent" />
          </>
        )}
      </div>
    </>
  );
}

export function PromoSection({
  promo,
  sectionNumber,
  backgroundImage,
  totalSections,
  backgroundImageType,
}: PromoSectionProps) {
  return (
    <SectionContainer
      sectionNumber={sectionNumber}
      showSectionIndicator={true}
      totalSections={totalSections}
    >
      <BackgroundDecorations variant="promo" />
      <PromoBackground backgroundImage={backgroundImage} />

      <div className="relative z-10 h-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-12">
        <div className="text-center mb-6 lg:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-900 dark:text-white leading-tight">
            Ingin Menonton Drama
            <br className="hidden sm:block" />
            Lancar Tanpa Gangguan ?
          </h2>
        </div>

        <div className="max-w-4xl mx-auto w-full px-0 sm:px-4">
          <div className="bg-gradient-to-br from-[#3477d7] to-[#1b3f71] rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-10 xl:p-12 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-8">
              <div className="flex-1 max-w-md text-center lg:text-left">
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-white mb-2 lg:mb-4">
                  {promo.title}
                  <br />
                  {promo.subtitle}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-4 lg:mb-6">
                  {promo.description}
                </p>
                <button className="px-5 sm:px-6 lg:px-8 py-2 lg:py-3 bg-white text-black rounded-full text-xs sm:text-sm font-bold hover:bg-gray-100 transition-colors">
                  {promo.ctaText}
                </button>
              </div>

              <div className="relative w-32 h-24 sm:w-40 sm:h-28 lg:w-56 lg:h-40 xl:w-64 xl:h-44 flex-shrink-0 hidden sm:block">
                <div className="absolute top-0 right-0 w-full h-16 sm:h-20 lg:h-24 bg-white/20 rounded-lg" />
                <div className="absolute bottom-0 left-0 w-16 sm:w-20 lg:w-28 h-24 sm:h-28 lg:h-36 bg-white/30 rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
