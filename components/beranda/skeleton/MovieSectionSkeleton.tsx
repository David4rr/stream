/**
 * Movie Section Skeleton - Loading state for MovieSection
 */

export function MovieSectionSkeleton() {
  return (
    <div className="h-full min-h-screen w-full bg-white dark:bg-[#0e0e0e] relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 h-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-10">
        <div className="space-y-8 lg:space-y-10">
          {[1, 2].map((section) => (
            <div key={section}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-32 h-5 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
                <div className="w-16 h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
              </div>

              {/* Movie Cards */}
              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex-shrink-0">
                    <div className="w-24 h-36 sm:w-28 sm:h-40 lg:w-32 lg:h-48 bg-neutral-700 animate-pulse rounded-xl" />
                    <div className="w-24 mt-2 h-3 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
