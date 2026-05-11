import { cn } from "@/lib/utils";
import { convertHeicUrl, getCropClass } from "@/lib/image-utils";

interface HeroBackgroundProps {
  coverImage?: string | null;
  title: string;
  type?: number;
}

/**
 * Hero background component.
 * Handles desktop/mobile background image and gradient overlays.
 */
export function HeroBackground({ coverImage, title, type }: HeroBackgroundProps) {
  const imageUrl = coverImage ? convertHeicUrl(coverImage) : "";
  const isType1 = type === 1;

  return (
    <>
      {/* Desktop Background Image - With cover image */}
      {coverImage && (
        <div className="absolute right-0 top-0 w-full lg:w-[55%] xl:w-[60%] h-full z-0">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full ${getCropClass(isType1, "h-full object-cover")}`}
          />
          {/* Gradient overlay - Smooth transition to center */}
          <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-[#0e0e0e] dark:via-[#0e0e0e]/40 dark:to-transparent bg-gradient-to-r from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 dark:bg-gradient-to-l dark:from-transparent dark:via-black/20 dark:to-transparent bg-gradient-to-l from-transparent via-white/20 to-transparent" />
        </div>
      )}

      {/* Mobile Background */}
      <div className="absolute inset-0 lg:hidden z-0">
        {coverImage ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className={`w-full ${getCropClass(isType1, "h-full object-cover")}`}
            />
            <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-[#0e0e0e] dark:via-[#0e0e0e]/60 dark:to-transparent bg-gradient-to-t from-white via-white/70 to-transparent" />
          </>
        ) : (
          <>
            <div className="w-full h-full dark:bg-gradient-to-t dark:from-[#0e0e0e] dark:via-neutral-800 dark:to-neutral-700 bg-gradient-to-t from-gray-100 via-gray-50 to-white" />
            <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-[#0e0e0e]/80 dark:to-transparent bg-gradient-to-t from-white via-white/80 to-transparent" />
          </>
        )}
      </div>
    </>
  );
}

interface SectionBackgroundProps {
  variant: "default" | "gradient";
  className?: string;
}

/**
 * Simple gradient background for sections without images.
 */
export function SectionBackground({
  variant = "default",
  className,
}: SectionBackgroundProps) {
  return (
    <>
      {variant === "gradient" && (
        <>
          <div className="absolute right-0 top-1/2 w-64 lg:w-80 h-64 lg:h-80 rounded-full bg-gradient-to-bl from-blue-500/10 to-purple-500/10 blur-3xl opacity-50 z-0" />
          <div className="absolute left-0 top-0 w-48 lg:w-64 h-48 lg:h-64 rounded-full bg-gradient-to-br from-purple-500/5 to-blue-400/5 blur-3xl opacity-30 z-0" />
        </>
      )}
    </>
  );
}
