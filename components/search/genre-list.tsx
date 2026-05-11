"use client";

import { Genre } from "@/types/detail";
import { cn } from "@/lib/utils";

interface GenreListProps {
    genres: Genre[];
    kategori: string;
    selectedGenreId: string | null;
    onGenreSelect: (genreId: string | null) => void;
    isLoading?: boolean;
}

export function GenreList({
    genres,
    kategori,
    selectedGenreId,
    onGenreSelect,
    isLoading,
}: GenreListProps) {
    if (isLoading) {
        return (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-8 w-20 rounded-full bg-muted animate-pulse shrink-0"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Mobile: Horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory lg:flex-wrap lg:overflow-visible">
                <button
                    onClick={() => onGenreSelect(null)}
                    className={cn(
                        "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors shrink-0 snap-start",
                        selectedGenreId === null
                            ? "bg-[#3477D7] text-white"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                >
                    Semua
                </button>

                {genres.map((genre) => {
                    const isSelected = selectedGenreId === String(genre.genreId);

                    return (
                        <button
                            key={genre.genreId}
                            onClick={() => onGenreSelect(String(genre.genreId))}
                            className={cn(
                                "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors shrink-0 whitespace-nowrap snap-start",
                                isSelected
                                    ? "bg-[#3477D7] text-white"
                                    : "bg-muted hover:bg-muted/80 text-foreground"
                            )}
                        >
                            {kategori === "anime" || kategori === "movies" || kategori === "manga"
                                ? genre.genre
                                : genre.genreName}
                        </button>
                    );
                })}
            </div>

            {/* Gradient indicators untuk scroll (optional) */}
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none lg:hidden" />
        </div>
    );
}
