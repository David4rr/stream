"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EpisodeListSkeletonProps {
    className?: string;
    itemCount?: number;
}

function EpisodeCardSkeleton() {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="min-w-0 flex-1 space-y-2">
                {/* Title skeleton */}
                <Skeleton className="h-4 w-32" />
                {/* Episode number skeleton */}
                <Skeleton className="h-3 w-16" />
            </div>
            {/* Button skeleton */}
            <Skeleton className="h-8 w-20" />
        </div>
    );
}

export function EpisodeListSkeleton({
    className,
    itemCount = 6,
}: EpisodeListSkeletonProps) {
    return (
        <Card className={`border-0 bg-card/80 backdrop-blur-sm ${className ?? ""}`}>
            <CardContent className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <Skeleton className="mb-1 h-5 w-40" />
                    <Skeleton className="h-4 w-72" />
                </div>

                {/* Episode Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <EpisodeCardSkeleton key={i} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
