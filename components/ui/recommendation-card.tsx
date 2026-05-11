"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Eye, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { convertHeicUrl, getCropClass, handleImageError, isType1ForKategori } from "@/lib/image-utils";

interface RecommendationCardProps {
    kategori: string;
    provider: string;
    id: string;
    type?: number;
    title: string;
    description: string;
    descriptions?: string;
    coverImage: string;
    playCount: string;
    chapterCount: number;
    isNew?: boolean;
    className?: string;
}

export function RecommendationCard({
    kategori,
    provider,
    id,
    type,
    title,
    description,
    coverImage,
    playCount,
    chapterCount,
    isNew = false,
    className,
}: RecommendationCardProps) {
    // Truncate description with null check
    const displayDescription = description
        ? description.length > 60
            ? `${description.slice(0, 60)}...`
            : description
        : "";

    // Type 1 cropping for drama provider
    const isType1 = isType1ForKategori(kategori, type);

    const baseUrl = kategori === "drama" ? `/${kategori}/detail/${id}/${type}` : `/${kategori}/${provider}/detail/${id}`;

    return (
        <Link
            href={baseUrl}
            className={cn(
                "group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted/30",
                className
            )}
        >
            {/* Thumbnail */}
            <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                    src={convertHeicUrl(coverImage)}
                    alt={title}
                    onError={handleImageError}
                    // fill
                    className={`${getCropClass(isType1, "object-cover")} justify-center transition-transform group-hover:scale-105`}
                    sizes="56px"
                />
                {isNew && (
                    <Badge
                        variant="default"
                        className="absolute right-0.5 top-0.5 px-1 py-0 text-[10px]"
                    >
                        New
                    </Badge>
                )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <h4 className="mb-1 line-clamp-1 text-sm font-medium text-white group-hover:text-primary">
                    {title}
                </h4>
                <p className="mb-2 line-clamp-2 text-xs text-white/80">
                    {displayDescription}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/80">
                    <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {playCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <Film className="h-3 w-3" />
                        {chapterCount}
                    </span>
                </div>
            </div>
        </Link>
    );
}
