import { DetailPage } from "@/components/detail/detail-page";
import type {
    DramaDetailResponse,
    RecommendationsResponse,
    ProvidersResponse,
    Kategori,
} from "@/types/detail";
import { notFound } from "next/navigation";
import { getComments, ensureContentItem } from "@/app/actions/comment-actions";

// Valid categories for this route (excludes drama)
type ProviderKategori = "anime" | "movies" | "manga";

interface DetailPageProps {
    params: Promise<{ id: string; provider: string; kategori: string; type?: number }>;
}

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}

async function getDetail(kategori: string, provider: string, id: string) {
    const response = await fetch(
        `${API_BASE_URL}/${kategori}/${provider}/detail/${id}`,
        {
            cache: "force-cache",
            next: { revalidate: 300 },
        }
    );

    if (!response.ok) {
        return null;
    }

    const data: DramaDetailResponse = await response.json();
    return data;
}

async function getRecommendations(kategori: string, provider: string) {
    const response = await fetch(
        `${API_BASE_URL}/${kategori}/${provider}/recommendations`,
        {
            cache: "force-cache",
            next: { revalidate: 300 },
        }
    );

    if (!response.ok) {
        return { success: false, data: [] };
    }

    const data: RecommendationsResponse = await response.json();
    return data;
}

const SLUG_PREFIX: Record<ProviderKategori, string> = {
    anime: "a",
    movies: "m",
    manga: "mg",
};

async function getProviders(kategori: ProviderKategori): Promise<ProvidersResponse> {
    const response = await fetch(`${API_BASE_URL}/${kategori}/providers`, {
        cache: "force-cache",
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        return { success: false, source: "", path: "", data: [] };
    }

    const data: ProvidersResponse = await response.json();
    return data;
}

async function resolveProviderFromSlug(
    kategori: ProviderKategori,
    slug: string
): Promise<string | null> {
    const prefix = SLUG_PREFIX[kategori];

    // Validate slug format (prefix + number)
    const regex = new RegExp(`^${prefix}(\\d+)$`);
    const match = slug.match(regex);

    if (!match) {
        return null;
    }

    const index = parseInt(match[1], 10) - 1;

    if (index < 0) {
        return null;
    }

    const providersResponse = await getProviders(kategori);

    if (!providersResponse.success || providersResponse.data.length === 0) {
        return null;
    }

    if (index >= providersResponse.data.length) {
        return null;
    }

    return providersResponse.data[index].name;
}

function isValidProviderKategori(kategori: string): kategori is ProviderKategori {
    return ["anime", "movies", "manga"].includes(kategori);
}

export default async function Page({ params }: DetailPageProps) {
    const { id, provider: providerSlug, kategori, type } = await params;

    // Drama should not use this route
    if (kategori === "drama") {
        notFound();
    }

    // Validate kategori (only anime, movies, manga)
    if (!isValidProviderKategori(kategori)) {
        notFound();
    }

    // Resolve provider from slug (a1, m1, mg1, etc)
    const providerName = await resolveProviderFromSlug(kategori, providerSlug);

    if (!providerName) {
        notFound();
    }

    // Fetch data
    const [detailData, recommendationsData] = await Promise.all([
        getDetail(kategori, providerName, id),
        getRecommendations(kategori, providerName),
    ]);

    if (!detailData) {
        notFound();
    }

    // Ensure ContentItem exists for comments
    const contentItemId = await ensureContentItem({
        sourceId: detailData.data.id,
        providerKey: providerName,
        categoryName: kategori.charAt(0).toUpperCase() + kategori.slice(1),
    });

    // Fetch comments using contentItemId
    const commentsData = contentItemId ? await getComments(contentItemId) : null;

    return (
        <DetailPage
            kategori={kategori}
            provider={providerSlug}
            dramaData={detailData.data}
            chapterCount={detailData.chapterCount}
            recommendations={recommendationsData.success ? recommendationsData.data : []}
            type={type}
            initialComments={commentsData?.success ? commentsData.data : []}
            contentItemId={contentItemId}
        />
    );
}
