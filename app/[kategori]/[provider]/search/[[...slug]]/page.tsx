import { SearchPage } from "@/components/search";
import type { Kategori } from "@/types/detail";
import { notFound } from "next/navigation";
import { fetchGenres, fetchRecommendations, fetchDramasByGenre, searchDramas } from "@/actions/search.actions";

interface PageProps {
    params: Promise<{
        kategori: string;
        provider: string;
        slug?: string[];
    }>;
    searchParams: Promise<{ q?: string }>;
}

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}

// Provider slug resolver (same as watch/detail page)
const SLUG_PREFIX: Record<Kategori, string> = {
    drama: "d",
    anime: "a",
    movies: "m",
    manga: "mg",
};

async function resolveProviderFromSlug(
    kategori: Kategori,
    slug: string
): Promise<string | null> {
    const prefix = SLUG_PREFIX[kategori];
    const regex = new RegExp(`^${prefix}(\\d+)$`);
    const match = slug.match(regex);

    if (!match) return null;

    const index = parseInt(match[1], 10) - 1;
    if (index < 0) return null;

    const response = await fetch(`${API_BASE_URL}/${kategori}/providers`, {
        cache: "force-cache",
        next: { revalidate: 300 }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success || index >= data.data.length) return null;

    return data.data[index].name;
}

function isValidKategori(kategori: string): kategori is Kategori {
    return ["drama", "anime", "movies", "manga"].includes(kategori);
}

export default async function Page({ params, searchParams }: PageProps) {
    const { kategori, provider: providerSlug, slug } = await params;
    const { q: searchQuery } = await searchParams;

    if (!isValidKategori(kategori)) {
        notFound();
    }

    const providerName = await resolveProviderFromSlug(kategori, providerSlug);

    if (!providerName) {
        notFound();
    }

    // slug[0] is the genre ID if present
    const genreId = slug?.[0];

    // Determine initial fetch based on priority: search query > genre > recommendations
    let initialDramasResponse;

    if (searchQuery) {
        // Has search query - fetch search results
        initialDramasResponse = await searchDramas(kategori, providerName, searchQuery);
    } else if (genreId) {
        // Has genre ID - fetch genre dramas
        initialDramasResponse = await fetchDramasByGenre(kategori, providerName, genreId);
    } else {
        // Default - fetch recommendations
        initialDramasResponse = await fetchRecommendations(kategori, providerName);
    }

    // Fetch genres (always needed for filter)
    const genresResponse = await fetchGenres(kategori, providerName);

    return (
        <SearchPage
            kategori={kategori}
            providerSlug={providerSlug}
            providerName={providerName}
            genreId={genreId}
            searchQuery={searchQuery}
            initialGenres={genresResponse.data || []}
            initialDramas={initialDramasResponse.data || []}
        />
    );
}

export async function generateMetadata({ params }: PageProps) {
    const { kategori } = await params;

    const kategoriName = {
        drama: "Drama",
        anime: "Anime",
        movies: "Film",
        manga: "Manga",
    }[kategori] || kategori;

    return {
        title: `Cari ${kategoriName} - CIDWatch`,
        description: `Cari dan temukan ${kategoriName.toLowerCase()} favoritmu di CIDWatch`,
    };
}
