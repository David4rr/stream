import { WatchPage } from "@/components/watch/watch-page";
import { MangaReaderPage } from "@/components/watch/manga-reader-page";
import type { StreamResponse, MovieStreamResponse, DramaDetailResponse, MangaChapterResponse, Kategori } from "@/types/detail";
import { notFound } from "next/navigation";

interface WatchPageProps {
    params: Promise<{
        kategori: string;
        provider: string;
        id: string;
        chapterIndex: string;
        type?: number;
    }>;
}

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}

async function getStreamData(
    kategori: string,
    provider: string,
    id: string,
    chapterIndex: string,
    type?: number,
): Promise<StreamResponse | null> {
    const url = kategori === "anime" || kategori === "movies"
        ? `${API_BASE_URL}/${kategori}/${provider}/stream/${chapterIndex}`
        : kategori === "drama"
            ? `${API_BASE_URL}/v2/drama/stream/${id}/${chapterIndex}?type=${type}`
            : `${API_BASE_URL}/${kategori}/${provider}/stream/${id}/${chapterIndex}`;

    const response = await fetch(url, {
        cache: "force-cache",
        next: { revalidate: 300 }
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}

async function getMovieStream(
    provider: string,
    id: string,
): Promise<MovieStreamResponse | null> {
    const url = `${API_BASE_URL}/movies/${provider}/stream/${id}`;

    const response = await fetch(url, {
        cache: "force-cache",
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}

async function getDramaDetail(kategori: string, provider: string, id: string) {
    const response = await fetch(
        `${API_BASE_URL}/${kategori}/${provider}/detail/${id}`,
        {
            cache: "force-cache",
            next: { revalidate: 300 }
        },

    );

    if (!response.ok) {
        return null;
    }

    const data: DramaDetailResponse = await response.json();
    return data;
}

// Provider slug resolver (same as detail page)
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

async function getMangaChapterData(
    kategori: string,
    provider: string,
    chapterIndex: string
): Promise<MangaChapterResponse | null> {
    const url = `${API_BASE_URL}/${kategori}/${provider}/chapters?id=${chapterIndex}`;

    const response = await fetch(url, {
        cache: "force-cache",
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}

export default async function Page({ params }: WatchPageProps) {
    const { kategori, provider: providerSlug, id, chapterIndex } = await params;

    if (!isValidKategori(kategori)) {
        notFound();
    }

    const providerName = await resolveProviderFromSlug(kategori, providerSlug);

    if (!providerName) {
        notFound();
    }

    // Manga branch: fetch chapter images instead of stream data
    if (kategori === "manga") {
        const [mangaChapterData, detailData] = await Promise.all([
            getMangaChapterData(kategori, providerName, chapterIndex),
            getDramaDetail(kategori, providerName, id),
        ]);

        if (!mangaChapterData || !mangaChapterData.success) {
            notFound();
        }

        if (!detailData || !detailData.success) {
            notFound();
        }

        return (
            <MangaReaderPage
                kategori={kategori}
                provider={providerSlug}
                mangaPages={mangaChapterData.data}
                chapterDesc={mangaChapterData.desc}
                dramaData={detailData.data}
                currentChapterId={chapterIndex}
            />
        );
    }

    // Default branch: video/stream for drama, anime, movies
    if (kategori === "movies") {
        // Movies use different API response format (data is array)
        const [movieStreamData, detailData] = await Promise.all([
            getMovieStream(providerName, id),
            getDramaDetail(kategori, providerName, id),
        ]);

        if (!movieStreamData || !movieStreamData.success) {
            notFound();
        }

        if (!detailData || !detailData.success) {
            notFound();
        }

        // Transform movie stream data to format expected by WatchPage
        const movieStreamDataFormatted = {
            id: id,
            coverImage: detailData.data.coverImage,
            chapterIndex: 0,
            streamUrl: "",
            qualities: [],
            src: movieStreamData.data,
        };

        return (
            <WatchPage
                kategori={kategori}
                provider={providerSlug}
                streamData={movieStreamDataFormatted}
                dramaData={detailData.data}
                currentChapterIndex={0}
            />
        );
    }

    // Handle drama and anime
    const [streamData, detailData] = await Promise.all([
        getStreamData(kategori, providerName, id, chapterIndex),
        getDramaDetail(kategori, providerName, id),
    ]);

    if (!streamData || !streamData.success) {
        notFound();
    }

    if (!detailData || !detailData.success) {
        notFound();
    }

    return (
        <WatchPage
            kategori={kategori}
            provider={providerSlug}
            streamData={streamData.data}
            dramaData={detailData.data}
            currentChapterIndex={parseInt(chapterIndex, 10)}
        />
    );
}
