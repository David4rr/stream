"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { convertHeicUrl, getCropClass, handleImageError } from "@/lib/image-utils";

interface HeroBannerProps {
    src: string;
    alt: string;
    className?: string;
    showCarouselDots?: boolean;
    activeIndex?: number;
    totalSlides?: number;
    type?: number; // type 1 = crop top half only
}

export function HeroBanner({
    src,
    alt,
    className,
    type,
}: HeroBannerProps) {
    // For drama type 1, only show top half of the image (hide dramabox watermark)
    const isType1 = type === 1;

    // Handle missing or empty image
    if (!src) {
        return (
            <div
                className={cn(
                    "flex md:mb-5 relative w-full justify-center overflow-hidden md:w-full md:max-h-full rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800",
                    isType1 ? "aspect-3/2" : "aspect-3/4",
                    className
                )}
            >
                <div className="flex items-center justify-center w-full h-full">
                    <span className="text-gray-500 dark:text-gray-400 text-sm text-center px-4">
                        {alt || "No Image"}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex md:mb-5 relative w-full justify-center overflow-hidden md:w-full md:max-h-full rounded-2xl shadow-[0_0_100px_rgba(255,255,255,0.1)] ",
                "aspect-3/4",
                className
            )}
        >
            {/* Image */}
            <img
                src={convertHeicUrl(src)}
                alt={alt}
                onError={handleImageError}
                className={cn(
                    "w-full",
                    getCropClass(isType1, "object-cover")
                )}
                sizes="150vw"
            />
        </div>
    );
}
