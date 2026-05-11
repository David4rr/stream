/**
 * FAQ Section Skeleton - Loading state for FAQSection
 */

export function FAQSectionSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-0 sm:px-4">
      {/* Heading */}
      <div className="flex flex-col justify-center items-center mb-6 lg:mb-8 py-2 px-4">
        <div className="w-48 h-6 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded mb-2" />
        <div className="w-64 h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
      </div>

      {/* FAQ Items */}
      <div className="space-y-2 sm:space-y-3 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full border border-gray-300 dark:border-[#262725] rounded-lg overflow-hidden bg-gray-50 dark:bg-[#20201f]"
          >
            <div className="w-full flex items-center justify-between p-3 lg:p-5">
              <div className="flex-1 h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded pr-4" />
              <div className="w-4 h-4 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
