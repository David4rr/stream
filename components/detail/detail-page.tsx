"use client";

import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/detail/hero-section";
import { DramaInfoSection } from "@/components/detail/drama-info-section";
import { EpisodeListSection } from "@/components/detail/episode-list-section";
import { CommentSection } from "@/components/detail/comment-section";
import { RecommendationSection } from "@/components/detail/recommendation-section";
import { MotionItem, MotionPage } from "@/components/ui/motion";
import type { DramaData, RecommendationItem, Comment } from "@/types/detail";
import { ChevronLeft } from "lucide-react";

interface DetailPageProps {
    kategori: string;
    provider: string;
    urlDramaId?: string;
    dramaData: DramaData;
    chapterCount: number;
    recommendations: RecommendationItem[];
    type?: number;
    initialComments?: Comment[];
    contentItemId?: string | null;
}

export function DetailPage({
    kategori,
    provider,
    urlDramaId,
    dramaData,
    chapterCount,
    recommendations,
    type,
    initialComments = [],
    contentItemId,
}: DetailPageProps) {
    const router = useRouter();
    const description = dramaData.description;
    const chaptherIndex = kategori === 'anime' || kategori === 'manga' || kategori === 'drama' ? provider == 'a2' ? dramaData.chapters[0]?.episodeId ?? 0 : dramaData.chapters[0]?.chapterId ?? 0 : kategori === 'movies' ? Number(dramaData.episodes?.[0].chapterId) : Number(dramaData.chapters[0]?.chapterIndex ?? 0);
    // const chaptherIndex = dramaData.chapters?.[0].chapterId;

    return (
        <MotionPage>
            {/* Hero Section - Full Width */}
            <div className="relative">
                <div className={`absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] -left-[100px] -top-[180px] bg-[linear-gradient(135.96deg,rgba(139,120,255,0.12)_0%,rgba(84,81,214,0.12)_101.74%)] z-0`} />
                <div className={`absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] right-0 bottom-0 bg-[linear-gradient(135.96deg,rgba(0,0,0,0.2)_0%,rgba(84,81,214,0.2)_55.76%)] z-0`} />

            </div>

            {/* Mobile Hero with animation */}
            <MotionItem delay={0} duration={0.5}>
                <div className="lg:hidden px-4 mt-20 relative z-10">
                    <HeroSection coverImage={dramaData.coverImage} title={dramaData.title} type={type} />
                </div>
            </MotionItem>


            {/* Content Container */}
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 lg:mt-16">
                <div className="grid gap-6 lg:grid-cols-[1fr_800px]">

                    {/* Desktop Sidebar - Recommendations */}
                    <aside className="hidden lg:block relative z-10">
                        {/* Back Button - Desktop */}
                        <MotionItem delay={0} duration={0.5}>
                            <button
                                onClick={() => router.push('/beranda')}
                                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors relative z-10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Kembali</span>
                            </button>
                        </MotionItem>
                        <MotionItem delay={0} duration={0.5}>
                            <HeroSection coverImage={dramaData.coverImage} title={dramaData.title} type={type} />
                        </MotionItem>
                        <MotionItem delay={0.3} duration={0.5}>
                            <div className="sticky top-6">
                                <RecommendationSection kategori={kategori} provider={provider} recommendations={recommendations} />
                            </div>
                        </MotionItem>
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Drama Info */}
                        <MotionItem delay={0.1} duration={0.5}>
                            <DramaInfoSection
                                kategori={kategori}
                                provider={provider}
                                dramaId={(type === 2 ? urlDramaId : dramaData.id) ?? ''}
                                title={dramaData.title}
                                description={description || ''}
                                chapterCount={chapterCount}
                                chapterIndex={String(chaptherIndex)}
                                chapterId={urlDramaId}
                                type={type}
                                contentItemId={contentItemId}
                                coverImage={dramaData.coverImage}
                            />
                        </MotionItem>

                        {/* Episode List */}
                        {(kategori === 'drama' || kategori === 'anime' || kategori === 'manga') && (
                            <MotionItem delay={0.2} duration={0.5}>
                                <EpisodeListSection
                                    kategori={kategori}
                                    provider={provider}
                                    dramaId={dramaData.id}
                                    chapters={dramaData.chapters}
                                    dramaTitle={dramaData.title}
                                    chaptersIndex={dramaData.chapters.map((chapter) => chapter.chapterIndex)}
                                    type={type}
                                    urlDramaId={urlDramaId}
                                />
                            </MotionItem>
                        )}

                        {/* Comments Section */}
                        <MotionItem delay={0.25} duration={0.5}>
                            <CommentSection
                                contentItemId={contentItemId || dramaData.id}
                                initialComments={initialComments}
                            />
                        </MotionItem>

                        {/* Mobile Recommendations */}
                        <MotionItem delay={0.35} duration={0.5}>
                            <RecommendationSection
                                kategori={kategori}
                                provider={provider}
                                recommendations={recommendations}
                                className="lg:hidden"
                            />
                        </MotionItem>
                    </div>
                </div>
            </div>
        </MotionPage>
    );
}
