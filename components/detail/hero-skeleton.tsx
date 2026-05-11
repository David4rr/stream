"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface HeroSkeletonProps {
    className?: string;
}

export function HeroSkeleton({ className }: HeroSkeletonProps) {
    return (
        <div className={className}>
            <Skeleton className="flex md:mb-5 relative aspect-3/4 w-full overflow-hidden md:w-full md:max-h-full rounded-2xl" />
        </div>
    );
}
