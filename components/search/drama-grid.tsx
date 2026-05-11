"use client";

import { SearchItem } from "@/types/detail";
import { DramaCard } from "./drama-card";
import { DramaCardSkeleton } from "./drama-card-skeleton";

interface DramaGridProps {
    dramas: SearchItem[];
    kategori: string;
    provider: string;
    isLoading?: boolean;
}

export function DramaGrid({ dramas, kategori, provider, isLoading }: DramaGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <DramaCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (dramas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16 mb-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
                <p className="text-lg font-medium">Tidak ada hasil ditemukan</p>
                <p className="text-sm">Coba kata kunci atau genre lain</p>
            </div>
        );
    }

    // Filter out dramas without valid id or title to prevent errors
    const validDramas = dramas.filter(
        (drama) => drama?.id && drama?.title
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {validDramas.map((drama) => (
                <DramaCard
                    key={drama.id}
                    drama={drama}
                    kategori={kategori}
                    provider={provider}
                />
            ))}
        </div>
    );
}
