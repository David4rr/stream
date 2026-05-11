/**
 * Promo Section Skeleton - Loading state for PromoSection
 */

export function PromoSectionSkeleton() {
  return (
    <div className="h-full min-h-screen w-full bg-white dark:bg-[#0e0e0e] relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 h-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-12">
        {/* Question Text */}
        <div className="text-center mb-6 lg:mb-10">
          <div className="w-64 h-8 mx-auto sm:w-80 sm:h-10 lg:w-96 lg:h-12 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
        </div>

        {/* Promo Card Skeleton */}
        <div className="max-w-4xl mx-auto w-full px-0 sm:px-4">
          <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-10 xl:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-8">
              {/* Text */}
              <div className="flex-1 max-w-md text-center lg:text-left space-y-3">
                <div className="w-48 h-8 bg-gray-300 dark:bg-neutral-700 animate-pulse rounded" />
                <div className="w-full h-4 bg-gray-300 dark:bg-neutral-700 animate-pulse rounded" />
                <div className="w-24 h-8 bg-white/50 dark:bg-white/10 animate-pulse rounded-full" />
              </div>

              {/* Image Placeholders */}
              <div className="relative w-32 h-24 sm:w-40 sm:h-28 lg:w-56 lg:h-40 xl:w-64 xl:h-44 flex-shrink-0 hidden sm:block">
                <div className="absolute top-0 right-0 w-full h-16 sm:h-20 lg:h-24 bg-white/20 rounded-lg animate-pulse" />
                <div className="absolute bottom-0 left-0 w-16 sm:w-20 lg:w-28 h-24 sm:h-28 lg:h-36 bg-white/30 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
