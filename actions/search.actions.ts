"use server";

import type { Genre, SearchItem } from "@/types/detail";

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}

export interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Fetch genres for a specific category and provider
 * @param kategori - Category type (drama, anime, movies, manga)
 * @param providerName - Provider name (e.g., "DramaProvider")
 */
export async function fetchGenres(
    kategori: string,
    providerName: string
): Promise<ActionResponse<Genre[]>> {
    try {
        // const response = await fetch(`${API_BASE_URL}/${kategori}/${providerName}/genre`,
        const url = kategori === "drama"
            ? `${API_BASE_URL}/v2/drama/genre`
            : `${API_BASE_URL}/${kategori}/${providerName}/genre`;

        const response = await fetch(url, {
            cache: "force-cache",
            next: { revalidate: 3600 }
        });


        if (!response.ok) {
            return {
                success: false,
                error: `Failed to fetch genres: ${response.status}`
            };
        }

        const data = await response.json();

        if (!data.success) {
            return {
                success: false,
                error: data.message || "Failed to fetch genres"
            };
        }

        return {
            success: true,
            data: data.data || []
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Search dramas by query string
 */
export async function searchDramas(
    kategori: string,
    providerName: string,
    query: string
): Promise<ActionResponse<SearchItem[]>> {
    try {
        const response = await fetch(
            kategori === "drama"
                ? `${API_BASE_URL}/v2/${kategori}/search?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/${kategori}/${providerName}/search?query=${encodeURIComponent(query)}`,
            {
                cache: "force-cache",
                next: { revalidate: 300 }
            }
        );

        if (!response.ok) {
            return {
                success: false,
                error: `Failed to search dramas: ${response.status}`
            };
        }

        const data = await response.json();

        let processedData = data.data || [];
        if (kategori === "drama" && Array.isArray(processedData)) {
            processedData = processedData.map((item: SearchItem) => ({
                ...item,
                type: item.type || 1 // Default to 1 if type is not provided
            }));
        } else if (Array.isArray(processedData)) {
            processedData = processedData.map((item: SearchItem) => ({
                ...item,
                type: item.type || 1 // Default to 1 for non-drama
            }));
        }

        return {
            success: true,
            data: processedData
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Fetch dramas by genre
 */
export async function fetchDramasByGenre(
    kategori: string,
    providerName: string,
    genreId: string
): Promise<ActionResponse<SearchItem[]>> {
    try {
        const response = await fetch(
            kategori === "drama"
                ? `${API_BASE_URL}/v2/${kategori}/genre/${genreId}`
                : `${API_BASE_URL}/${kategori}/${providerName}/genre/${genreId}`,
            {
                cache: "force-cache",
                next: { revalidate: 300 } // Revalidate every 5 minutes
            }
        );

        if (!response.ok) {
            return {
                success: false,
                error: `Failed to fetch dramas by genre: ${response.status}`
            };
        }

        const data = await response.json();

        let processedData = data.data || [];
        if (kategori === "drama" && Array.isArray(processedData)) {
            processedData = processedData.map((item: SearchItem) => ({
                ...item,
                type: item.type || data.type || 0 // Default to 0 if type is not provided
            }));
        } else if (Array.isArray(processedData)) {
            processedData = processedData.map((item: SearchItem) => ({
                ...item,
                type: item.type || 1 // Default to 1 for non-drama
            }));
        }

        return {
            success: true,
            data: processedData
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

/**
 * Fetch recommended dramas
 */
export async function fetchRecommendations(
    kategori: string,
    providerName: string
): Promise<ActionResponse<SearchItem[]>> {
    try {
        const response = await fetch(
            kategori === "drama"
                ? `${API_BASE_URL}/v2/${kategori}/recommendations`
                : `${API_BASE_URL}/${kategori}/${providerName}/recommendations`,
            {
                cache: "force-cache",
                next: { revalidate: 600 } // Revalidate every 10 minutes
            }
        );

        if (!response.ok) {
            return {
                success: false,
                error: `Failed to fetch recommendations: ${response.status}`
            };
        }

        const data = await response.json();

        let processedData = data.data || [];
        if (kategori === "drama" && Array.isArray(processedData)) {
            processedData = processedData.map((item: SearchItem) => ({
                ...item,
                type: item.type || 1 // Default to 1 if type is not provided
            }));
        } else if (Array.isArray(processedData)) {
            processedData = processedData.map((item: SearchItem) => ({
                ...item,
                type: item.type || 1 // Default to 1 for non-drama
            }));
        }

        return {
            success: true,
            data: processedData
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
