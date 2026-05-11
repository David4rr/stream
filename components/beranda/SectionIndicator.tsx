"use client";

interface SectionIndicatorProps {
  current: number;
  total?: number;
}

export function SectionIndicator({ current, total }: SectionIndicatorProps) {
  const displayTotal = total ?? 1;
  return (
    <div className="hidden lg:block absolute bottom-6 left-4 sm:bottom-8 sm:left-6 lg:bottom-10 lg:left-8 xl:bottom-12 xl:left-10 z-20 whitespace-nowrap">
      <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-none inline-block">
        {String(current).padStart(2, "0")}
      </span>
      <span className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-500 dark:text-white/50 leading-none inline-block align-baseline ml-1">
        /{String(displayTotal).padStart(2, "0")}
      </span>
    </div>
  );
}
