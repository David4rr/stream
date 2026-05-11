"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendationSkeletonProps {
    className?: string;
    itemCount?: number;
}

function RecommendationCardSkeleton() {
    return (
        <div className="flex gap-3 rounded-lg p-2">
            {/* Thumbnail skeleton */}
            <Skeleton className="h-20 w-14 flex-shrink-0 rounded-lg" />

            {/* Content skeleton */}
            <div className="min-w-0 flex-1">
                {/* Title */}
                <Skeleton className="mb-1 h-4 w-3/4" />
                {/* Description - 2 lines */}
                <Skeleton className="mb-1 h-3 w-full" />
                <Skeleton className="mb-2 h-3 w-2/3" />
                {/* Stats */}
                <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-8" />
                </div>
            </div>
        </div>
    );
}

export function RecommendationSkeleton({
    className,
    itemCount = 4,
}: RecommendationSkeletonProps) {
    return (
        <Card
            className={`border-0 bg-gradient-to-tr from-[#1B3E71] to-[#3477D7] backdrop-blur-sm ${className ?? ""}`}
        >
            <CardContent className="p-4">
                {/* Header */}
                <div className="mb-4">
                    <Skeleton className="mb-1 h-5 w-40 bg-white/20" />
                    <Skeleton className="h-3 w-56 bg-white/20" />
                </div>

                {/* Recommendation List */}
                <div className="space-y-2">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <RecommendationCardSkeleton key={i} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
