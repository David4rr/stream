import { DetailPage } from "@/components/detail/detail-page";
import type {
    DramaDetailResponse,
    RecommendationsResponse,
    ProvidersResponse,
    CommentsResponse,
    Kategori,
} from "@/types/detail";
import { notFound } from "next/navigation";
import { getComments, ensureContentItem } from "@/app/actions/comment-actions";

/**
 * Dynamic route for detail pages
 * 
 * Routes handled:
 * - /drama/detail/[id]/[type]           → Drama with type (no provider)
 * - /anime/[provider]/detail/[id]       → Anime with provider (no type)
 * - /movies/[provider]/detail/[id]      → Movies with provider (no type)
 * - /manga/[provider]/detail/[id]       → Manga with provider (no type)
 * 
 * Catch-all slug patterns:
 * - Drama:  slug = ["detail", id, type]
 * - Others: slug = [provider, "detail", id]
 */

interface DetailPageProps {
    params: Promise<{ kategori: string; slug: string[] }>;
}

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}

// ==================== API Functions ====================

async function getDramaDetail(id: string, type: number) {
    const response = await fetch(
        `${API_BASE_URL}/v2/drama/detail/${id}?type=${type}`,
        {
            cache: "force-cache",
            next: { revalidate: 300 },
        }
    );

    if (!response.ok) return null;
    return response.json() as Promise<DramaDetailResponse>;
}

async function getProviderDetail(kategori: string, provider: string, id: string) {
    const response = await fetch(
        `${API_BASE_URL}/${kategori}/${provider}/detail/${id}`,
        {
            cache: "force-cache",
            next: { revalidate: 300 },
        }
    );

    if (!response.ok) return null;
    return response.json() as Promise<DramaDetailResponse>;
}

async function getDramaRecommendations() {
    const response = await fetch(`${API_BASE_URL}/v2/drama/recommendations`, {
        cache: "force-cache",
        next: { revalidate: 300 },
    });

    if (!response.ok) return { success: false, data: [] };
    return response.json() as Promise<RecommendationsResponse>;
}

async function getProviderRecommendations(kategori: string, provider: string) {
    const response = await fetch(
        `${API_BASE_URL}/${kategori}/${provider}/recommendations`,
        {
            cache: "force-cache",
            next: { revalidate: 300 },
        }
    );

    if (!response.ok) return { success: false, data: [] };
    return response.json() as Promise<RecommendationsResponse>;
}

// ==================== Provider Resolution ====================

type ProviderKategori = "anime" | "movies" | "manga";

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

    return response.json();
}

async function resolveProviderFromSlug(
    kategori: ProviderKategori,
    slug: string
): Promise<string | null> {
    const prefix = SLUG_PREFIX[kategori];
    const regex = new RegExp(`^${prefix}(\\d+)$`);
    const match = slug.match(regex);

    if (!match) return null;

    const index = parseInt(match[1], 10) - 1;
    if (index < 0) return null;

    const providersResponse = await getProviders(kategori);
    if (!providersResponse.success || providersResponse.data.length === 0) return null;
    if (index >= providersResponse.data.length) return null;

    return providersResponse.data[index].name;
}

// ==================== Validators ====================

function isValidKategori(kategori: string): kategori is Kategori {
    return ["drama", "anime", "movies", "manga"].includes(kategori);
}

function isProviderKategori(kategori: string): kategori is ProviderKategori {
    return ["anime", "movies", "manga"].includes(kategori);
}

// ==================== Route Parsers ====================

interface DramaRoute {
    type: "drama";
    id: string;
    dramaType: number;
}

interface ProviderRoute {
    type: "provider";
    kategori: ProviderKategori;
    providerSlug: string;
    providerName: string;
    id: string;
}

type ParsedRoute = DramaRoute | ProviderRoute | null;

async function parseRoute(kategori: string, slug: string[]): Promise<ParsedRoute> {
    // Drama route: /drama/detail/[id]/[type]
    // slug = ["detail", id, type]
    if (kategori === "drama") {
        if (slug.length !== 3 || slug[0] !== "detail") return null;

        const [, id, typeStr] = slug;
        const dramaType = parseInt(typeStr, 10);

        if (isNaN(dramaType)) return null;

        return { type: "drama", id, dramaType };
    }

    // Provider route: /[kategori]/[provider]/detail/[id]
    // slug = [provider, "detail", id]
    if (isProviderKategori(kategori)) {
        if (slug.length !== 3 || slug[1] !== "detail") return null;

        const [providerSlug, , id] = slug;
        const providerName = await resolveProviderFromSlug(kategori, providerSlug);

        if (!providerName) return null;

        return { type: "provider", kategori, providerSlug, providerName, id };
    }

    return null;
}

// ==================== Page Component ====================

export default async function Page({ params }: DetailPageProps) {
    const { kategori, slug } = await params;

    // Validate kategori
    if (!isValidKategori(kategori)) {
        notFound();
    }

    // Parse route based on kategori
    const route = await parseRoute(kategori, slug);

    if (!route) {
        notFound();
    }

    // Fetch data based on route type
    if (route.type === "drama") {
        const [detailData, recommendationsData] = await Promise.all([
            getDramaDetail(route.id, route.dramaType),
            getDramaRecommendations(),
        ]);

        if (!detailData) notFound();

        // Ensure ContentItem exists for comments
        const contentItemId = await ensureContentItem({
            sourceId: detailData.data.id,
            providerKey: `d${route.dramaType}`,
            categoryName: 'Drama',
        });

        // Fetch comments using contentItemId
        const commentsData = contentItemId ? await getComments(contentItemId) : null;

        return (
            <DetailPage
                kategori="drama"
                provider={`d${route.dramaType}`}
                dramaData={detailData.data}
                urlDramaId={route.id}
                chapterCount={detailData.chapterCount}
                recommendations={recommendationsData.success ? recommendationsData.data : []}
                type={route.dramaType}
                initialComments={commentsData?.success ? commentsData.data : []}
                contentItemId={contentItemId}
            />
        );
    }

    // Provider route (anime, movies, manga)
    const [detailData, recommendationsData] = await Promise.all([
        getProviderDetail(route.kategori, route.providerName, route.id),
        getProviderRecommendations(route.kategori, route.providerName),
    ]);

    if (!detailData) notFound();

    // Ensure ContentItem exists for comments
    const contentItemId = await ensureContentItem({
        sourceId: detailData.data.id,
        providerKey: route.providerName,
        categoryName: route.kategori.charAt(0).toUpperCase() + route.kategori.slice(1),
    });

    // Fetch comments using contentItemId
    const commentsData = contentItemId ? await getComments(contentItemId) : null;

    return (
        <DetailPage
            kategori={route.kategori}
            provider={route.providerSlug}
            dramaData={detailData.data}
            chapterCount={detailData.chapterCount}
            recommendations={recommendationsData.success ? recommendationsData.data : []}
            initialComments={commentsData?.success ? commentsData.data : []}
            contentItemId={contentItemId}
        />
    );
}
