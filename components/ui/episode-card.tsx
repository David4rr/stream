"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";

interface EpisodeCardProps {
    kategori: string;
    provider: string;
    dramaId: string;
    title: string;
    episodeNumber: number;
    chapterId: string;
    className?: string;
    chapterIndex?: number;
    episodeId?: string; // For anime, use episodeId
    type?: number;
    urlDramaId?: string; // For drama type 2, this is the constant dramaId from URL
}

export function EpisodeCard({
    kategori,
    provider,
    dramaId,
    title,
    episodeNumber,
    chapterId,
    className,
    chapterIndex = 0,
    episodeId,
    type,
    urlDramaId,
}: EpisodeCardProps) {
    const router = useRouter();

    const handleWatch = () => {
        if (kategori === "manga") {
            router.push(`/${kategori}/${provider}/watch/${dramaId}/${chapterId}`);
        } else if (kategori === "drama") {
            // For drama type 2, use urlDramaId (constant dramaId from URL)
            // For drama type 1, use dramaId and chapterId
            if (type === 2) {
                // Type 2: /drama/watch/{dramaId}/{chapterId}/2
                router.push(`/${kategori}/watch/${urlDramaId}/${chapterId}/${type}`);
            } else {
                // Type 1: /drama/watch/{dramaId}/{chapterId}/1
                router.push(`/${kategori}/watch/${dramaId}/${chapterId}/${type}`);
            }
        } else if (kategori === "anime") {
            // For anime, use episodeId (unique ID per episode)
            router.push(`/${kategori}/${provider}/watch/${dramaId}/${episodeId || chapterId}`);
        } else {
            router.push(`/${kategori}/${provider}/watch/${dramaId}/${chapterIndex}`);
        }
    };

    // Truncate title if too long
    const displayTitle = title.length > 25 ? `${title.slice(0, 25)}...` : title;

    return (
        <div
            className={cn(
                "flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:bg-muted/30",
                className
            )}
        >
            <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium text-foreground">
                    {displayTitle}
                </h4>
                <p className="text-xs text-muted-foreground">
                    {kategori === "manga" ? `Ch ${episodeNumber + 1}` : `Eps ${episodeNumber + 1}`}
                </p>
            </div>
            <Button
                onClick={handleWatch}
                className="gap-2 text-black bg-white border-black/50"
                size="sm"
            >
                {kategori === "manga" ? "Baca" : "Tonton"}
                {kategori === "manga" ? (
                    <BookOpen className="h-3.5 w-3.5" />
                ) : (
                    <Play className="h-3.5 w-3.5 fill-current" />
                )}
            </Button>
        </div>
    );
}
