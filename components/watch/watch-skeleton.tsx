"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function WatchSkeleton() {
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            {/* Back button skeleton */}
            <div className="absolute top-4 left-4 z-10">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
            </div>

            {/* Quality selector skeleton */}
            <div className="absolute top-4 right-4 z-10">
                <Skeleton className="h-8 w-20 rounded-md bg-white/10" />
            </div>

            {/* Center play button skeleton */}
            <Skeleton className="h-16 w-16 rounded-full bg-white/10" />

            {/* Bottom info skeleton */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                {/* Progress bar skeleton */}
                <Skeleton className="h-1 w-full rounded-full bg-white/10 mb-4" />

                {/* Episode info skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-48 bg-white/10" />
                    <Skeleton className="h-4 w-24 bg-white/10" />
                </div>
            </div>

            {/* Navigation hints skeleton */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-10">
                <Skeleton className="h-12 w-8 rounded bg-white/10" />
                <Skeleton className="h-12 w-8 rounded bg-white/10" />
            </div>
        </div>
    );
}
