"use client";

import { HeroSkeleton } from "@/components/detail/hero-skeleton";
import { DramaInfoSkeleton } from "@/components/detail/drama-info-skeleton";
import { EpisodeListSkeleton } from "@/components/detail/episode-list-skeleton";
import { RecommendationSkeleton } from "@/components/detail/recommendation-skeleton";

export function DetailSkeleton() {
    return (
        <>
            {/* Hero Section - Mobile Only */}
            <div className="lg:hidden px-4 pt-20">
                <HeroSkeleton />
            </div>

            {/* Content Container */}
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 lg:mt-11">
                <div className="grid gap-6 lg:grid-cols-[1fr_800px]">
                    {/* Desktop Sidebar - Hero + Recommendations */}
                    <aside className="hidden lg:block">
                        <HeroSkeleton />
                        <div className="sticky top-6 mt-6">
                            <RecommendationSkeleton itemCount={4} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Drama Info Skeleton */}
                        <DramaInfoSkeleton />

                        {/* Episode List Skeleton */}
                        <EpisodeListSkeleton itemCount={8} />
                    </div>
                </div>
            </div>
        </>
    );
}
