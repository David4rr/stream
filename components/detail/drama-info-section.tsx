"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ChevronDown, ChevronUp, BookOpen, Heart } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectIsFavorited, addFavorite, removeFavorite, selectFavorites, fetchFavorites } from "@/store/favorites-slice";
import { selectIsAuthenticated } from "@/store/auth-slice";

interface DramaInfoSectionProps {
    kategori: string;
    provider: string;
    dramaId: string;
    title: string;
    description: string;
    chapterCount: number;
    currentEpisode?: number;
    chapterIndex: string;
    chapterId?: string;
    onWatch?: () => void;
    type?: number;
    contentItemId?: string | null;
    coverImage?: string;
}

export function DramaInfoSection({
    kategori,
    provider,
    dramaId,
    title,
    description,
    chapterCount,
    currentEpisode = 1,
    chapterIndex,
    chapterId,
    onWatch,
    type,
    contentItemId,
    coverImage,
}: DramaInfoSectionProps) {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [mounted, setMounted] = useState(false);
    const hasFetchedFavorites = useRef(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Check if user is authenticated (only after mount to prevent hydration mismatch)
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    // Check if this item is favorited
    const isFavorited = useAppSelector(contentItemId ? selectIsFavorited(contentItemId) : () => false);
    const favorites = useAppSelector(selectFavorites);
    const isCreating = useAppSelector((state) => state.favorites?.isCreating || false);
    const isDeleting = useAppSelector((state) => state.favorites?.isDeleting || false);

    // Don't show favorite button until mounted (prevents hydration mismatch)
    const showFavoriteButton = mounted && isAuthenticated && contentItemId;

    // Fetch favorites once on mount (prevents infinite loop)
    useEffect(() => {
        if (mounted && isAuthenticated && !hasFetchedFavorites.current) {
            dispatch(fetchFavorites()).then((result) => {
                hasFetchedFavorites.current = true;
            });
        }
    }, [mounted, isAuthenticated]);

    const handleFavoriteToggle = async () => {
        if (!contentItemId) return;

        if (isFavorited) {
            // Find the favorite item from Redux state
            const favoriteItem = favorites.find((f) => String(f.contentItemId) === String(contentItemId));

            if (favoriteItem) {
                await dispatch(removeFavorite(String(favoriteItem.id)));
                // Optimistic: Redux state akan terupdate immediately lewat extraReducers
            }
        } else {
            // Add favorite with drama data - optimistic update
            await dispatch(addFavorite({
                contentItemId: String(contentItemId), // Explicit string conversion
                dramaData: {
                    title,
                    coverImage,
                    description,
                    category: kategori,
                    providerKey: provider,
                    // For type 2, use chapterId as sourceId (needed for detail API)
                    // For type 1, use dramaId
                    sourceId: String(type === 2 ? chapterId : dramaId),
                    type,
                },
            }));
            // Optimistic: Redux state akan terupdate immediately lewat extraReducers
        }
    };

    const handleWatch = () => {
        if (kategori === "drama") {
            // For drama, chapterIndex prop contains the chapterId (not the index!)
            if (type === 2) {
                // Type 2: /drama/watch/{dramaId}/{chapterId}/2
                router.push(`/${kategori}/watch/${chapterId}/${chapterIndex}/${type}`);
            } else {
                // Type 1: /drama/watch/{dramaId}/{chapterId}/1
                router.push(`/${kategori}/watch/${dramaId}/${chapterIndex}/${type}`);
            }
        } else {
            router.push(`/${kategori}/${provider}/watch/${dramaId}/${chapterIndex}`);
        }
        onWatch?.();
    };

    // Truncate description for display with "..." at end
    const safeDescription = description ?? "";
    const isTruncated = safeDescription.length > 200;
    const displayDescription = showFullDescription || !isTruncated
        ? safeDescription
        : `${safeDescription.slice(0, 200)}...`;

    return (
        <div className="space-y-4">
            {/* Title and Description Card */}
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    <h1 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
                        {title}
                    </h1>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base whitespace-pre-line">
                        {displayDescription}
                    </p>
                    {isTruncated && (
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            {showFullDescription ? (
                                <>
                                    Sembunyikan
                                    <ChevronUp className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Selengkapnya
                                    <ChevronDown className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    )}
                </CardContent>
            </Card>

            {/* Episode Count and Watch Button Card */}
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    {kategori === 'movies' ? (
                        <div className="mb-4 flex items-baseline gap-3">
                            <span className="text-xl font-bold text-foreground md:text-2xl">
                                Tonton Sekarang
                            </span>
                            <span className="text-sm text-muted-foreground">
                                klik tombol tonton untuk mulai menonton
                            </span>
                        </div>
                    ) : (
                        <div className="mb-4 flex items-baseline gap-3">
                            <span className="text-xl font-bold text-foreground md:text-2xl">
                                {chapterCount} {kategori === 'manga' ? 'Chapter' : 'Episode'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {kategori === 'manga' ? 'Chapter' : 'Episode'} {currentEpisode} / {chapterCount}
                            </span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleWatch}
                            className="gap-2 text-black bg-white border-black/50"
                            size="default"
                        >
                            {kategori === 'manga' ? 'Baca' : 'Tonton'}
                            {kategori === 'manga' ? (
                                <BookOpen className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4 fill-current" />
                            )}
                        </Button>
                        {showFavoriteButton && (
                            <Button
                                onClick={handleFavoriteToggle}
                                disabled={isCreating || isDeleting}
                                variant="outline"
                                size="default"
                                className={`gap-2 border-2 transition-all ${
                                    isFavorited
                                        ? 'bg-red-500 border-red-600 text-white hover:bg-red-600'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Heart
                                    className={`h-4 w-4 ${isFavorited ? 'fill-red-600 text-red-600' : ''}`}
                                />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
