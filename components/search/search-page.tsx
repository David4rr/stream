"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Genre, SearchItem } from "@/types/detail";
import { MotionItem, MotionPage } from "@/components/ui/motion";
import { GenreList } from "./genre-list";
import { DramaGrid } from "./drama-grid";
import { Pagination } from "./pagination";
import { searchDramas, fetchDramasByGenre, fetchRecommendations } from "@/actions/search.actions";

const ITEMS_PER_PAGE = 20;

interface SearchPageProps {
    kategori: string;
    providerSlug: string;
    providerName: string;
    genreId?: string;
    searchQuery?: string;
    initialGenres: Genre[];
    initialDramas: SearchItem[];
}

export function SearchPage({
    kategori,
    providerSlug,
    providerName,
    genreId: initialGenreId,
    searchQuery: initialSearchQuery,
    initialGenres,
    initialDramas
}: SearchPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryParam = searchParams?.get("q") || initialSearchQuery || "";

    // Initialize state with SSR data
    const [genres] = useState<Genre[]>(initialGenres);
    const [allDramas, setAllDramas] = useState<SearchItem[]>(initialDramas);
    const [dramas, setDramas] = useState<SearchItem[]>([]);
    const [searchQuery, setSearchQuery] = useState(queryParam || "");
    const [selectedGenreId, setSelectedGenreId] = useState<string | null>(initialGenreId || null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoadingDramas, setIsLoadingDramas] = useState(false);
    const [searchMode, setSearchMode] = useState<"genre" | "search" | "recommendations">(
        initialGenreId ? "genre" : (queryParam ? "search" : "recommendations")
    );

    // Client-side pagination
    useEffect(() => {
        const total = Math.ceil(allDramas.length / ITEMS_PER_PAGE);
        setTotalPages(total || 1);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedDramas = allDramas.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        setDramas(paginatedDramas);
    }, [allDramas, currentPage]);

    // Sync state with URL changes
    useEffect(() => {
        if (initialGenreId) {
            setSelectedGenreId(initialGenreId);
            setSearchMode("genre");
        } else if (queryParam) {
            setSearchQuery(queryParam);
            setSearchMode("search");
        } else if (!searchQuery && searchMode === 'genre') {
            setSelectedGenreId(null);
            setSearchMode("recommendations");
        }
    }, [initialGenreId, queryParam]);

    // Fetch dramas using Server Actions
    const fetchDramasData = useCallback(async () => {
        setIsLoadingDramas(true);
        try {
            let response;

            if (searchMode === "search" && searchQuery) {
                response = await searchDramas(kategori, providerName, searchQuery);
            } else if (searchMode === "genre" && selectedGenreId) {
                response = await fetchDramasByGenre(kategori, providerName, selectedGenreId);
            } else {
                response = await fetchRecommendations(kategori, providerName);
            }

            if (response.success && response.data) {
                setAllDramas(response.data);
                setCurrentPage(1);
            } else {
                setAllDramas([]);
            }
        } catch (error) {
            setAllDramas([]);
        } finally {
            setIsLoadingDramas(false);
        }
    }, [kategori, providerName, searchMode, searchQuery, selectedGenreId]);

    // Trigger fetch when dependencies change (skip initial mount as we have SSR data)
    useEffect(() => {
        // Skip if we're showing initial data (recommendations without query)
        if (searchMode === "recommendations" && !searchQuery && !selectedGenreId && !queryParam && allDramas.length > 0) {
            return;
        }
        if (searchMode === "genre" && selectedGenreId === initialGenreId && allDramas.length > 0) {
            return;
        }

        fetchDramasData();
    }, [searchMode, searchQuery, selectedGenreId, queryParam]);

    // Handle search
    const handleSearch = (query: string) => {
        if (query) {
            setSearchQuery(query);
            setSelectedGenreId(null);
            setSearchMode("search");
            setCurrentPage(1);
            // Update URL with query parameter
            router.push(`/${kategori}/${providerSlug}/search?q=${encodeURIComponent(query)}`, { scroll: false });
        } else {
            // Clear search, show recommendations
            setSearchQuery("");
            setSearchMode("recommendations");
            setCurrentPage(1);
            router.push(`/${kategori}/${providerSlug}/search`, { scroll: false });
        }
    };

    // Handle genre selection
    const handleGenreSelect = (genreId: string | null) => {
        setSelectedGenreId(genreId);
        setSearchQuery("");
        setCurrentPage(1);

        if (genreId) {
            setSearchMode("genre");
            router.push(`/${kategori}/${providerSlug}/search/${genreId}`, { scroll: false });
        } else {
            setSearchMode("recommendations");
            router.push(`/${kategori}/${providerSlug}/search`, { scroll: false });
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Get section title
    const getSectionTitle = () => {
        if (searchMode === "search" && searchQuery) {
            return `Hasil pencarian "${searchQuery}"`;
        }
        if (searchMode === "genre" && selectedGenreId) {
            const genre = genres.find((g) => String(g.genreId) === selectedGenreId);
            return genre ? `Genre : ${kategori === "anime" || kategori === "movies" || kategori === "manga" ? genre.genre : genre.genreName}` : "Genre";
        }
        return "Rekomendasi";
    };

    return (
        <MotionPage>
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24 relative z-10">

                {/* Back Button - Mobile */}
                <MotionItem delay={0} duration={0.5}>
                    <div className="hidden md:hidden mb-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Kembali</span>
                        </button>
                    </div>
                </MotionItem>

                {/* Genre List - Desktop */}
                <MotionItem delay={0} duration={0.5}>
                    <div className="mb-4 sm:mb-6 md:mb-8 hidden md:block">
                        {/* Back Button - Desktop */}
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Kembali</span>
                        </button>
                        <GenreList
                            genres={genres}
                            kategori={kategori}
                            selectedGenreId={selectedGenreId}
                            onGenreSelect={handleGenreSelect}
                            isLoading={false}
                        />
                    </div>
                </MotionItem>

                {/* Genre Dropdown - Mobile */}
                <MotionItem delay={0} duration={0.5}>
                    <div className="mb-4 sm:mb-6 md:hidden">
                        <select
                            value={selectedGenreId || ""}
                            onChange={(e) => handleGenreSelect(e.target.value || null)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Semua Genre</option>
                            {genres.map((genre) => (
                                <option key={genre.genreId} value={String(genre.genreId)}>
                                    {kategori === "anime" || kategori === "movies" || kategori === "manga"
                                        ? genre.genre
                                        : genre.genreName}
                                </option>
                            ))}
                        </select>
                    </div>
                </MotionItem>

                {/* Section Title */}
                <MotionItem delay={0.1} duration={0.5}>
                    <h2 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4">{getSectionTitle()}</h2>
                </MotionItem>

                {/* Drama Grid */}
                <MotionItem delay={0.2} duration={0.5}>
                    <DramaGrid
                        dramas={dramas}
                        kategori={kategori}
                        provider={providerSlug}
                        isLoading={isLoadingDramas}
                    />
                </MotionItem>

                {/* Pagination */}
                <MotionItem delay={0.3} duration={0.5}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </MotionItem>
            </div>
        </MotionPage>
    );
}
