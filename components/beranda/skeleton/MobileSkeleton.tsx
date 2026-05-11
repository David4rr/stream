/**
 * Mobile Home Page Skeleton - Loading state for mobile view
 */

export function MobileSkeleton() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="w-20 h-5 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
        <div className="w-6 h-6 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
      </div>

      {/* Category Tabs Skeleton */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-16 h-8 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Search Bar Skeleton */}
      <div className="px-4 mb-4">
        <div className="w-full h-10 bg-gray-100 dark:bg-white/10 rounded-full" />
      </div>

      {/* Hero Carousel Skeleton */}
      <div className="mb-4">
        <div className="flex overflow-x-auto scrollbar-hide px-4 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex-shrink-0 w-[327px] h-[145px] bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/50" />
          ))}
        </div>
      </div>

      {/* Movie Sections Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((section) => (
          <div key={section} className="mb-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3 px-4">
              <div className="w-24 h-5 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
              <div className="w-12 h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
            </div>

            {/* Movie Cards */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0">
                  <div className="w-[141px] h-[175px] bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-[15px]" />
                  <div className="w-[141px] h-3 mt-2 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Promo Banner Skeleton */}
      <div className="px-4 mb-6">
        <div className="h-[201px] bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-2xl" />
      </div>

      {/* FAQ Skeleton */}
      <div className="px-4 mb-8">
        <div className="text-center mb-6 py-2">
          <div className="w-40 h-5 mx-auto bg-gray-200 dark:bg-neutral-800 animate-pulse rounded mb-2" />
          <div className="w-56 h-3 mx-auto bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-12 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
