"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MangaReaderSkeleton() {
    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {/* Header skeleton */}
            <div className="flex items-center justify-between px-4 py-3 bg-linear-to-b from-black/90 to-transparent">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                <div className="flex flex-col items-center gap-1">
                    <Skeleton className="h-4 w-40 bg-white/10" />
                    <Skeleton className="h-3 w-28 bg-white/10" />
                </div>
                <Skeleton className="h-5 w-20 bg-white/10" />
            </div>

            {/* Progress bar skeleton */}
            <Skeleton className="h-0.5 w-full bg-white/10" />

            {/* Image panels skeleton */}
            <div className="flex-1 overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-1 p-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="w-full bg-zinc-900"
                            style={{
                                height: i === 0 ? "400px" : i < 3 ? "500px" : "350px",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
