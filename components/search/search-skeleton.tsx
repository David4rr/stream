"use client";

import { DramaCardSkeleton } from "./drama-card-skeleton";

export function SearchSkeleton() {
    return (
        <>
            <div className="container mx-auto px-4 py-8 pt-24">
                {/* Search Bar Skeleton */}
                <div className="flex gap-2 w-full max-w-2xl mx-auto mb-8">
                    <div className="flex-1 h-10 bg-muted rounded-md animate-pulse" />
                    <div className="w-20 h-10 bg-muted rounded-md animate-pulse" />
                </div>

                {/* Genre List Skeleton */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-8 w-20 rounded-full bg-muted animate-pulse shrink-0"
                        />
                    ))}
                </div>

                {/* Section Title Skeleton */}
                <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />

                {/* Drama Grid Skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <DramaCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </>
    );
}
