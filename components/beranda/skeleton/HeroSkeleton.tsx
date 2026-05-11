/**
 * Hero Section Skeleton - Loading state for desktop HeroSection
 */

export function HeroSkeleton() {
  return (
    <div className="h-full min-h-screen w-full bg-white dark:bg-[#0e0e0e] relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 h-full min-h-screen flex flex-col">
        {/* Header Skeleton */}
        <header className="flex items-center justify-between px-4 lg:px-16 py-4 lg:py-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-6 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
            <div className="w-12 h-6 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="w-12 h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden md:flex w-32 h-8 bg-gray-100 dark:bg-white/20 rounded-full" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-full" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-full" />
          </div>
        </header>

        {/* Hero Content Skeleton */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 pb-8 lg:pb-16 pt-4">
          <div className="max-w-lg xl:max-w-xl">
            {/* Title */}
            <div className="w-64 h-10 lg:w-80 lg:h-14 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded mb-4" />

            {/* Badges */}
            <div className="hidden md:flex items-center gap-2 mb-4">
              <div className="w-16 h-6 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-full" />
              <div className="w-12 h-6 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-full" />
              <div className="w-20 h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
            </div>

            {/* Description */}
            <div className="hidden lg:block space-y-2 mb-6">
              <div className="w-full h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
              <div className="w-full h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
              <div className="w-2/3 h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <div className="w-24 h-10 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-full" />
              <div className="w-32 h-10 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-full" />
            </div>
          </div>

          {/* Featured Movies Carousel Skeleton */}
          <div className="relative mt-6 lg:mt-8 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0">
                  <div className="w-24 h-36 sm:w-28 sm:h-40 lg:w-32 lg:h-48 bg-neutral-700 animate-pulse rounded-xl" />
                  <div className="w-24 mt-2 h-3 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
