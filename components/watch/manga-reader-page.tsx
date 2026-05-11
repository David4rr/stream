"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    BackgroundCircles1,
    BackgroundCircles2,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import type { MangaPage, DramaData } from "@/types/detail";

interface MangaReaderPageProps {
    kategori: string;
    provider: string;
    mangaPages: MangaPage[];
    chapterDesc: string;
    dramaData: DramaData;
    currentChapterId: string;
}

export function MangaReaderPage({
    kategori,
    provider,
    mangaPages,
    chapterDesc,
    dramaData,
    currentChapterId,
}: MangaReaderPageProps) {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showHeader, setShowHeader] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const lastScrollY = useRef(0);

    const totalPages = mangaPages.length;
    const chapters = dramaData.chapters;
    // const totalChapters = chapters.length;

    // Find current chapter position in the chapters array
    const currentChapterPosition = chapters.findIndex(
        (ch) => ch.chapterId === currentChapterId
    );

    // Get previous and next chapters from the array
    // Note: chapters array is sorted DESC by chapterIndex (newest first)
    // So next chapter = position - 1 (higher chapterIndex)
    // And previous chapter = position + 1 (lower chapterIndex)
    const previousChapter =
        currentChapterPosition < chapters.length - 1
            ? chapters[currentChapterPosition + 1]
            : null;
    const nextChapter =
        currentChapterPosition > 0 ? chapters[currentChapterPosition - 1] : null;

    // const hasPrevious = previousChapter !== null;
    // const hasNext = nextChapter !== null;

    // Proxy image URL through /api/image to bypass CORS/referer
    const getProxiedUrl = (url: string) => {
        return `/api/image?url=${encodeURIComponent(url)}`;
    };

    const handleBack = () => {
        router.push(`/${kategori}/${provider}/detail/${String(dramaData.id)}`);
    };

    // const navigateToChapter = (chapterId: string) => {
    //     router.push(
    //         `/${kategori}/${provider}/watch/${dramaData.id}/${chapterId}`
    //     );
    // };

    // const handlePreviousChapter = () => {
    //     if (previousChapter) {
    //         navigateToChapter(previousChapter.chapterId);
    //     }
    // };

    // const handleNextChapter = () => {
    //     if (nextChapter) {
    //         navigateToChapter(nextChapter.chapterId);
    //     }
    // };

    // Track current visible page via Intersection Observer
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        imageRefs.current.forEach((ref, index) => {
            if (!ref) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setCurrentPage(index + 1);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            observer.observe(ref);
            observers.push(observer);
        });

        return () => {
            observers.forEach((obs) => obs.disconnect());
        };
    }, [mangaPages]);

    // Show/hide header on scroll direction & show scroll-to-top button
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const currentScrollY = container.scrollTop;

            // Show/hide header based on scroll direction
            if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }

            // Show scroll-to-top button after scrolling 500px
            setShowScrollTop(currentScrollY > 500);

            lastScrollY.current = currentScrollY;
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Reset scroll position when chapter changes
    useEffect(() => {
        scrollContainerRef.current?.scrollTo(0, 0);
        // Defer setState to avoid synchronous call warning
        requestAnimationFrame(() => {
            setCurrentPage(1);
            setLoadedImages(new Set());
        });
    }, [currentChapterId]);

    const handleScrollToTop = () => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleImageLoad = useCallback((page: number) => {
        setLoadedImages((prev) => new Set(prev).add(page));
    }, []);

    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement>,
        originalUrl: string
    ) => {
        const img = e.currentTarget;
        // If already tried proxy, set placeholder
        if (img.src.includes("/api/image")) {
            img.src = "/placeholder-drama.jpg";
            return;
        }
        // Try proxy as fallback
        img.src = getProxiedUrl(originalUrl);
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {/* Header */}
            <header
                className={cn(
                    "absolute top-0 left-0 right-0 z-[100] transition-transform duration-300",
                    "bg-linear-to-b from-black/90 via-black/60 to-transparent",
                    showHeader ? "translate-y-0" : "-translate-y-full"
                )}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: Back button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className="text-white hover:bg-white/20 rounded-full shrink-0"
                        aria-label="Kembali"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    {/* Center: Title & chapter info */}
                    <div className="flex-1 text-center min-w-0 px-2">
                        <h1 className="text-white text-sm font-bold truncate">
                            {dramaData.title}
                        </h1>
                        <p className="text-white/60 text-xs truncate">
                            {chapterDesc} — Hal {currentPage}/{totalPages}
                        </p>
                    </div>

                    {/* Right: CIDWatch logo */}
                    <span className="text-sm font-bold shrink-0">
                        <span className="text-white">CID</span>
                        <span className="text-[#3477D7]">Watch</span>
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-0.5 bg-white/10 w-full">
                    <div
                        className="h-full bg-[#3477D7] transition-all duration-300"
                        style={{
                            width: `${(currentPage / totalPages) * 100}%`,
                        }}
                    />
                </div>
            </header>

            {/* Background decorations (desktop) */}
            <div className="hidden lg:block">
                <div
                    className="absolute rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] -left-25 -top-45"
                    style={{
                        background:
                            "linear-gradient(135.96deg, rgba(139,120,255,0.12) 0%, rgba(84,81,214,0.12) 101.74%)",
                    }}
                />
                <div
                    className="absolute rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] right-0 bottom-0"
                    style={{
                        background:
                            "linear-gradient(135.96deg, rgba(0,0,0,0.2) 0%, rgba(84,81,214,0.2) 55.76%)",
                    }}
                />
                <div className="absolute right-8 bottom-12">
                    <BackgroundCircles1 />
                </div>
                <div className="absolute right-[15%] bottom-[40%]">
                    <BackgroundCircles2 />
                </div>
            </div>

            {/* Scrollable image container */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
            >
                {/* Top spacer for header */}
                <div className="h-14" />

                {/* Images - vertical long-strip */}
                <div className="max-w-3xl mx-auto">
                    {mangaPages.map((page, index) => (
                        <div
                            key={page.page}
                            ref={(el) => {
                                imageRefs.current[index] = el;
                            }}
                            className="relative w-full"
                        >
                            {/* Loading placeholder */}
                            {!loadedImages.has(page.page) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 min-h-75">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="h-6 w-6 text-white/40 animate-spin" />
                                        <span className="text-white/30 text-xs">
                                            Hal {page.page}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <img
                                src={getProxiedUrl(page.img)}
                                alt={`Halaman ${page.page}`}
                                loading={index < 3 ? "eager" : "lazy"}
                                className="w-full h-auto block select-none"
                                onLoad={() => handleImageLoad(page.page)}
                                onError={(e) =>
                                    handleImageError(e, page.img)
                                }
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom chapter navigation */}
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
                    {/* Chapter info */}
                    <div className="text-center">
                        <p className="text-white/50 text-sm">
                            — Akhir {chapterDesc} —
                        </p>
                    </div>

                    {/* Navigation buttons */}
                    {/* <div className="flex items-center justify-center gap-4">
                        {hasPrevious && (
                            <Button
                                onClick={handlePreviousChapter}
                                variant="outline"
                                className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Chapter Sebelumnya
                            </Button>
                        )}
                        {hasNext && (
                            <Button
                                onClick={handleNextChapter}
                                variant="outline"
                                className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                                Chapter Selanjutnya
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div> */}

                    {/* Back to detail */}
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="text-white/40 hover:text-white text-xs"
                        >
                            Kembali ke Detail
                        </Button>
                    </div>

                    {/* Bottom spacer */}
                    <div className="h-8" />
                </div>
            </div>

            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    onClick={handleScrollToTop}
                    className={cn(
                        "fixed bottom-6 right-6 z-[100] p-3 rounded-full",
                        "bg-white/10 border border-white/20 backdrop-blur-md",
                        "text-white/60 hover:text-white hover:bg-white/20",
                        "transition-all duration-300 shadow-lg"
                    )}
                    aria-label="Scroll ke atas"
                >
                    <ChevronUp className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
