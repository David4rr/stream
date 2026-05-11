"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EpisodeCard } from "@/components/ui/episode-card";
import { ChevronDown } from "lucide-react";
import type { Chapter } from "@/types/detail";

interface EpisodeListSectionProps {
  kategori: string;
  provider: string;
  dramaId: string;
  chapters: Chapter[];
  dramaTitle: string;
  initialDisplayCount?: number;
  chaptersIndex?: number[];
  type?: number;
  urlDramaId?: string;
}

export function EpisodeListSection({
  kategori,
  provider,
  dramaId,
  chapters,
  dramaTitle,
  initialDisplayCount = 12,
  chaptersIndex,
  type,
  urlDramaId,
}: EpisodeListSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedChapters = showAll
    ? chapters
    : chapters.slice(0, initialDisplayCount);

  const hasMore = chapters.length > initialDisplayCount;

  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-1 text-lg font-bold text-foreground">
            {kategori === "manga" ? "Daftar Chapter" : "Kepoin ceritanya"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {kategori === "manga"
              ? "Pilih chapter yang ingin kamu baca"
              : "Lanjut menonton episode lainnya dengan memilih list di bawah"}
          </p>
        </div>

        {/* Episode List */}
        <div className="grid gap-4 md:grid-cols-2">
          {displayedChapters.map((chapter, index) => (
            <EpisodeCard
              key={`${chapter.chapterId}-${chapter.chapterIndex}-${index}`}
              kategori={kategori}
              provider={provider}
              dramaId={dramaId}
              title={dramaTitle}
              episodeNumber={chapter.chapterIndex ?? index}
              chapterId={chapter.chapterId}
              chapterIndex={chapter.chapterIndex ?? index}
              episodeId={chapter.episodeId}
              type={type}
              urlDramaId={urlDramaId}
            />
          ))}
        </div>

        {/* Show More Button */}
        {hasMore && !showAll && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setShowAll(true)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              Lihat Lainnya
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
