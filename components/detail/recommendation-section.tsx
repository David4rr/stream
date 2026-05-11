"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import type { RecommendationItem } from "@/types/detail";

interface RecommendationSectionProps {
    kategori: string;
    provider: string;
    recommendations: RecommendationItem[];
    className?: string;
}

export function RecommendationSection({
    kategori,
    provider,
    recommendations,
    className,
}: RecommendationSectionProps) {
    if (recommendations.length === 0) {
        return null;
    }

    return (
        <Card className={`border-0 bg-gradient-to-tr from-[#1B3E71] to-[#3477D7] backdrop-blur-sm ${className ?? ""}`}>
            <CardContent className="p-4">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="mb-1 text-base font-bold text-white">
                        CIDWatch Rekomendasi
                    </h2>
                    <p className="text-xs text-white/80">
                        tonton tayangan lainnya sesuai rekomendasi
                    </p>
                </div>

                {/* Recommendation List */}
                <div className="space-y-2">
                    {recommendations.map((item, index) => (
                        <RecommendationCard
                            key={item.id}
                            kategori={kategori}
                            provider={provider}
                            id={item.id}
                            type={item.type}
                            title={item.title}
                            description={item.description}
                            coverImage={item.coverImage}
                            playCount={item.playCount}
                            chapterCount={item.chapterCount}
                            isNew={index < 3} // First 3 items marked as "New"
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
