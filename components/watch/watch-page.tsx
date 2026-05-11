"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronUp, ChevronDown, Play } from "lucide-react";
import { VideoPlayer } from "./video-player";
import { getDefaultQuality } from "./quality-selector";
import { Button } from "@/components/ui/button";
import { BackgroundCircles1, BackgroundCircles2 } from "@/components/icons";
import type { StreamData, StreamQuality, DramaData } from "@/types/detail";
import { proxyVideoUrl } from "@/lib/video-utils";
import { fetchStreamData } from "@/app/actions/fetch-stream";

interface WatchPageProps {
  kategori: string;
  provider: string;
  streamData: StreamData;
  dramaData: DramaData;
  chapterId?: string;
  dramaId?: string;
  currentChapterIndex: number;
  type?: string;
}

export function WatchPage({
  kategori,
  provider,
  streamData,
  dramaData,
  chapterId,
  dramaId,
  currentChapterIndex,
  type,
}: WatchPageProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFeedbackShowing, setIsFeedbackShowing] = useState(false);

  // For movies, use embedded iframe directly from streamData.src[0].src
  const isMovies = kategori === "movies";
  const moviesEmbedUrl = streamData.src?.[0]?.src || null;

  const chapters = kategori === "anime" ? (dramaData.episodes || dramaData.chapters || []) : (dramaData.chapters || []);
  const totalChapters = isMovies ? 1 : chapters.length;

  // Find actual index from chapter ID
  // For all drama types, currentChapterIndex from URL might be chapterId, not index
  let resolvedIndex: number;
  let actualChapterIndex: number = -1;

  if (kategori === "drama") {
    // For drama (both type 1 and type 2), find by chapterId
    actualChapterIndex = chapters.findIndex((c) => {
      const chapterId = c.chapterId;
      // CRITICAL: Compare as strings to avoid precision loss for large numbers
      return String(chapterId) === String(currentChapterIndex);
    });

    // If found by chapterId, use it; otherwise assume currentChapterIndex is already an index
    resolvedIndex = actualChapterIndex >= 0 ? actualChapterIndex : (typeof currentChapterIndex === 'number' ? currentChapterIndex : parseInt(currentChapterIndex as string, 10));
  } else {
    // For anime: Try to find by chapterId first
    actualChapterIndex = chapters.findIndex((c) => {
      const chapterId = kategori === "anime"
        ? (c.episodeId || c.chapterId)
        : c.chapterId;
      // Compare as strings since chapterId might be stored as string
      return String(chapterId) === String(currentChapterIndex);
    });

    // If not found by ID, assume currentChapterIndex is already an index
    resolvedIndex = actualChapterIndex >= 0 ? actualChapterIndex : currentChapterIndex;
  }

  const hasPrevious = resolvedIndex > 0;
  const hasNext = resolvedIndex < totalChapters - 1;
  // ^^ initial page load navigation checks, used only for reference
  // activeHasPrevious/activeHasNext below are used for actual navigation

  // Initialize with default quality (SSR-safe) - only for non-movies
  const [currentQuality, setCurrentQuality] = useState<StreamQuality>(() => {
    if (isMovies) {
      return { quality: 0, streamUrl: "" };
    }
    return getDefaultQuality(
      kategori === "anime"
        ? streamData.servers || streamData.qualities
        : streamData.qualities,
    );
  });

  const [currentStreamUrl, setCurrentStreamUrl] = useState(() =>
    proxyVideoUrl(
      currentQuality.streamUrl,
      kategori === "anime" ? dramaData.id : undefined,
    ),
  );

  const [activeStreamData, setActiveStreamData] = useState<StreamData>(streamData);
  const [activeChapterIndex, setActiveChapterIndex] = useState(resolvedIndex);
  const [isNavigating, setIsNavigating] = useState(false);

  // Auto-detect quality on client side (skip for movies)
  const handleQualityChange = useCallback(
    (quality: StreamQuality) => {
      setCurrentQuality(quality);
      setCurrentStreamUrl(
        proxyVideoUrl(
          quality.streamUrl,
          kategori === "anime" ? dramaData.id : undefined,
        ),
      );
    },
    [kategori, dramaData.id],
  );

  // Only use auto quality detection for non-movies
  useEffect(() => {
    if (!isMovies && activeStreamData.qualities && activeStreamData.qualities.length > 0) {
      const sortedQualities = [...activeStreamData.qualities].sort(
        (a, b) => b.quality - a.quality,
      );

      // Check if Network Information API is available
      if ("connection" in navigator) {
        const connection = (
          navigator as Navigator & { connection?: { effectiveType?: string } }
        ).connection;
        const effectiveType = connection?.effectiveType;

        let autoQuality: StreamQuality;

        if (effectiveType === "4g") {
          autoQuality = sortedQualities[0];
        } else if (effectiveType === "3g") {
          autoQuality =
            sortedQualities.find((q) => q.quality <= 720) ||
            sortedQualities[sortedQualities.length - 1];
        } else {
          autoQuality = sortedQualities[sortedQualities.length - 1];
        }

        // Defer setState to avoid synchronous call warning
        requestAnimationFrame(() => {
          handleQualityChange(autoQuality);
        });
      }
    }
  }, [isMovies, activeStreamData.qualities, handleQualityChange]);

  const handleBack = () => {
    if (kategori === "drama") {
      if (provider === "2") {
        // Type 2: use dramaId (constant) for detail page
        router.push(`/${kategori}/detail/${String(dramaId || chapterId)}/${provider}`);
      } else {
        router.push(`/${kategori}/detail/${String(dramaData.id)}/${provider}`);
      }
    } else {
      router.push(`/${kategori}/${provider}/detail/${String(dramaData.id)}`);
    }
  };

  const buildChapterUrl = useCallback(
    (chapterIndex: number): string | null => {
      if (chapterIndex < 0 || chapterIndex >= chapters.length) return null;

      if (kategori === "drama") {
        const targetChapter = chapters[chapterIndex];
//        const targetChapterId = targetChapter?.chapterId || targetChapter?.id || targetChapter?.sourceId;
        const targetChapterId = targetChapter?.chapterId;
        if (!targetChapterId) return null;

        const dramaType = Number(type) || 1;
        const dramaIdForUrl = dramaType === 2 ? dramaId : dramaData.id;
        if (!dramaIdForUrl) return null;

        if (dramaType === 2) {
          return `/drama/watch/${dramaId}/${targetChapterId}/${dramaType}`;
        } else {
          const chapterIdForUrl = targetChapter?.chapterId;
          if (!chapterIdForUrl) return null;
          return `/drama/watch/${dramaIdForUrl}/${chapterIdForUrl}/${dramaType}`;
        }
      } else if (kategori === "anime") {
        const episodeId = chapters[chapterIndex]?.episodeId || chapters[chapterIndex]?.chapterId;
        if (!episodeId) return null;
        return `/anime/${provider}/watch/${dramaData.id}/${episodeId}`;
      } else {
        return `/${kategori}/${provider}/watch/${dramaData.id}/${chapterIndex}`;
      }
    },
    [router, kategori, provider, dramaData.id, chapters, type, dramaId],
  );

  const navigateToChapter = useCallback(
    async (chapterIndex: number) => {
      if (chapterIndex < 0 || chapterIndex >= chapters.length) return;
      if (isNavigating) return;

      const targetChapter = chapters[chapterIndex];
      const chapterIdForFetch = kategori === "anime"
        ? (targetChapter?.episodeId || targetChapter?.chapterId)
        : targetChapter?.chapterId;

      if (!chapterIdForFetch) return;

      setIsNavigating(true);

      try {
        const newStreamData = await fetchStreamData({
          kategori,
          provider,
          id: kategori === "drama" ? (dramaId || dramaData.id) : dramaData.id,
          chapterIndex: String(chapterIdForFetch),
          type: type || "1",
        });

        if (newStreamData) {
          const qualities = kategori === "anime"
            ? newStreamData.servers || newStreamData.qualities
            : newStreamData.qualities || newStreamData.servers;

          setActiveStreamData(newStreamData);
          setActiveChapterIndex(chapterIndex);

          const quality = getDefaultQuality(qualities);
          setCurrentQuality(quality);
          setCurrentStreamUrl(
            proxyVideoUrl(
              quality.streamUrl,
              kategori === "anime" ? dramaData.id : undefined,
            ),
          );

          const url = buildChapterUrl(chapterIndex);
          if (url) {
            window.history.replaceState(null, "", url);
          }
        } else {
          const url = buildChapterUrl(chapterIndex);
          if (url) {
            router.replace(url);
          }
        }
      } catch {
        const url = buildChapterUrl(chapterIndex);
        if (url) {
          router.replace(url);
        }
      } finally {
        setIsNavigating(false);
      }
    },
    [isNavigating, chapters, kategori, provider, dramaData.id, dramaId, type, buildChapterUrl, router],
  );

  const activeHasPrevious = activeChapterIndex > 0;
  const activeHasNext = activeChapterIndex < totalChapters - 1;

  const handlePreviousEpisode = useCallback(() => {
    if (isFeedbackShowing) return;
    if (activeHasPrevious) {
      navigateToChapter(activeChapterIndex - 1);
    }
  }, [activeHasPrevious, activeChapterIndex, navigateToChapter, isFeedbackShowing]);

  const handleNextEpisode = useCallback(() => {
    if (isFeedbackShowing) return;
    if (activeHasNext) {
      navigateToChapter(activeChapterIndex + 1);
    }
  }, [activeHasNext, activeChapterIndex, navigateToChapter, isFeedbackShowing]);

  const handleVideoEnd = () => {
    if (!isMovies && activeHasNext) {
      handleNextEpisode();
    }
  };

  // Virtual scroll - track swipe for mobile (disabled for movies)
  useEffect(() => {
    // Skip navigation for movies category
    if (isMovies) return;

    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let currentY = 0;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      currentY = startY;
      isSwiping = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;
      currentY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (!isSwiping) return;
      isSwiping = false;

      const diffY = startY - currentY;
      const threshold = 80; // Minimum swipe distance

      if (diffY > threshold && activeHasNext) {
        // Swipe up -> next episode
        handleNextEpisode();
      } else if (diffY < -threshold && activeHasPrevious) {
        // Swipe down -> previous episode
        handlePreviousEpisode();
      }
    };

    // Mouse wheel for desktop virtual scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const threshold = 50;

      if (e.deltaY > threshold && activeHasNext) {
        handleNextEpisode();
      } else if (e.deltaY < -threshold && activeHasPrevious) {
        handlePreviousEpisode();
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [
    isMovies,
    activeHasNext,
    activeHasPrevious,
    handleNextEpisode,
    handlePreviousEpisode,
  ]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden items-center justify-center flex"
    >
      {/* Shared Back Button */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent z-[100]">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-white hover:bg-white/20 rounded-full"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full w-full items-center justify-center p-8 relative">
        {/* Background Effects */}
        <div>
          <div
            className={`absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] -left-[100px] -top-[180px] bg-[linear-gradient(135.96deg,rgba(139,120,255,0.12)_0%,rgba(84,81,214,0.12)_101.74%)]`}
          />
          <div
            className={`absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] right-0 bottom-0 bg-[linear-gradient(135.96deg,rgba(0,0,0,0.2)_0%,rgba(84,81,214,0.2)_55.76%)]`}
          />
        </div>

        <div className={`absolute hidden md:block right-8 bottom-12`}>
          <BackgroundCircles1 />
        </div>
        <div className={`absolute hidden md:block right-[15%] bottom-[40%]`}>
          <BackgroundCircles2 />
        </div>

        {/* Desktop Episode Info */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col p-4 items-center pointer-events-none">
          <span className="text-xl font-bold">
            <span className="text-black dark:text-white">CID</span>
            <span className="text-[#3477D7]">Watch</span>
          </span>
        </div>

        {/* Video Container - Desktop */}
        <div className="flex absolute h-10/12 w-4/5 items-center justify-center rounded-2xl border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.08)]">
          {isMovies ? (
            moviesEmbedUrl ? (
              <iframe
                src={moviesEmbedUrl}
                className="w-full h-full rounded-2xl"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ border: "none" }}
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white/50 gap-3">
                <Play className="w-12 h-12 opacity-30" />
                <p className="text-sm">Stream tidak tersedia</p>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Single VideoPlayer — shared between desktop and mobile */}
      {!isMovies && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full lg:w-4/5 lg:h-10/12 rounded-2xl lg:border lg:border-white/10 lg:shadow-[0_0_100px_rgba(255,255,255,0.08)] overflow-hidden">
            <VideoPlayer
              streamUrl={currentStreamUrl}
              coverImage={activeStreamData.coverImage}
              qualities={kategori === "anime" ? activeStreamData.servers : activeStreamData.qualities || activeStreamData.servers}
              currentQuality={currentQuality.quality}
              onQualityChange={handleQualityChange}
              onVideoEnd={handleVideoEnd}
              onFeedbackPopupChange={setIsFeedbackShowing}
              title={dramaData.title}
              currentChapterIndex={activeChapterIndex}
              totalChapters={totalChapters}
            />
          </div>
        </div>
      )}

      {/* Desktop Navigation Buttons — after VideoPlayer so they're on top */}
      {!isMovies && (
        <div className="hidden lg:block absolute px-14 -translate-y-1/2 flex items-center w-full justify-between z-30">
          {activeHasPrevious && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-8 z-20 pointer-events-none">
              <button
                onClick={handlePreviousEpisode}
                className="pointer-events-auto p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-110 active:scale-95 group"
                aria-label="Episode sebelumnya"
              >
                <ChevronUp className="w-8 h-8 text-white/50 group-hover:text-white transition-colors -rotate-90" />
              </button>
            </div>
          )}
          {activeHasNext && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-8 z-20 pointer-events-none">
              <button
                onClick={handleNextEpisode}
                className="pointer-events-auto p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-110 active:scale-95 group"
                aria-label="Episode selanjutnya"
              >
                <ChevronDown className="w-8 h-8 text-white/50 group-hover:text-white transition-colors -rotate-90" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Layout - overlays only (no duplicate VideoPlayer) */}
      <div className="lg:hidden h-full w-full">
        {isMovies ? (
          moviesEmbedUrl ? (
            <iframe
              src={moviesEmbedUrl}
              className="w-full h-full block lg:hidden"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ border: "none" }}
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/50 gap-3">
              <Play className="w-12 h-12 opacity-30" />
              <p className="text-sm">Stream tidak tersedia</p>
            </div>
          )
        ) : null}

        {/* Mobile Episode Info Overlay */}
        <div className="absolute bottom-20 left-0 right-0 px-4 z-10 pointer-events-none">
          <h1 className="text-white text-lg font-bold mb-1 drop-shadow-lg">
            {dramaData.title}
          </h1>
          <p className="text-white/80 text-sm drop-shadow-lg">
            Episode {activeChapterIndex + 1} / {totalChapters}
          </p>
        </div>

        {/* Mobile Swipe Hint - hidden for movies */}
        {!isMovies && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs z-10">
            Swipe up / down untuk ganti episode
          </div>
        )}
      </div>
    </div>
  );
}
