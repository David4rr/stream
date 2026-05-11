"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DramaInfoSkeletonProps {
    className?: string;
}

export function DramaInfoSkeleton({ className }: DramaInfoSkeletonProps) {
    return (
        <div className={`space-y-4 ${className ?? ""}`}>
            {/* Title and Description Card */}
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    {/* Title skeleton */}
                    <Skeleton className="mb-3 h-8 w-3/4 md:h-9" />
                    {/* Description skeleton - multiple lines */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </CardContent>
            </Card>

            {/* Episode Count and Watch Button Card */}
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    {/* Episode count skeleton */}
                    <div className="mb-4 flex items-baseline gap-3">
                        <Skeleton className="h-7 w-32 md:h-8" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    {/* Button skeleton */}
                    <Skeleton className="h-10 w-28" />
                </CardContent>
            </Card>
        </div>
    );
}
