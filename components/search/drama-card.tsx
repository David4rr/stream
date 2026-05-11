"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchItem } from "@/types/detail";
import { convertHeicUrl, getCropClass, handleImageError, isType1ForKategori } from "@/lib/image-utils";
import router from "next/dist/shared/lib/router/router";

interface DramaCardProps {
    drama: SearchItem;
    kategori: string;
    provider: string;
}

export function DramaCard({ drama, kategori, provider }: DramaCardProps) {
    // Handle missing cover image
    const imageUrl = drama.coverImage
        ? convertHeicUrl(drama.coverImage)
        : '/placeholder-cover.png'; // Fallback image

    // Type 1 cropping for drama provider
    const isType1 = isType1ForKategori(kategori, drama.type);

    return (
        <Link
            href={
                kategori === "drama"
                    ? `/${kategori}/detail/${drama.id}/${drama.type || 1}`
                    : `/${kategori}/${provider}/detail/${drama.id}`
            }
        >
            <div className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-muted cursor-pointer w-full">
                {/* Cover Image */}
                {drama.coverImage ? (
                    <img
                        src={imageUrl}
                        alt={drama.title}
                        onError={handleImageError}
                        className={`w-full ${getCropClass(isType1, "h-full object-cover")} transition-transform duration-300 group-hover:scale-105`}
                        sizes="(max-width: 768px) 50vw, 20vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm text-center px-2">
                            {drama.title}
                        </span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Hover Overlay with CIDWatch branding */}
                <div className="absolute inset-0 bg-[#3477D7]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-white text-2xl font-bold tracking-wider">
                            CIDWatch
                        </span>
                        <p className="text-white/80 text-sm mt-1">Tonton Sekarang</p>
                    </div>
                </div>

                {/* Title and Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
                        {drama.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                        {drama.playCount && (
                            <span className="flex items-center gap-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-3 h-3"
                                >
                                    <path d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
                                </svg>
                                {drama.playCount}
                            </span>
                        )}
                        {drama.chapterCount && (
                            <span>{drama.chapterCount} Eps</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
