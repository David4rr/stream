import { WatchPage } from "@/components/watch/watch-page";
import { MangaReaderPage } from "@/components/watch/manga-reader-page";
import type {
  StreamResponse,
  MovieStreamResponse,
  DramaDetailResponse,
  MangaChapterResponse,
  Kategori,
} from "@/types/detail";
import { notFound } from "next/navigation";

/**
 * Dynamic route for watch pages
 *
 * Routes handled:
 * - /drama/watch/[id]/[chapterIndex]/[type]    → Drama with type (no provider)
 * - /anime/[provider]/watch/[id]/[chapterIndex] → Anime with provider (no type)
 * - /movies/[provider]/watch/[id]/[chapterIndex] → Movies with provider (no type)
 * - /manga/[provider]/watch/[id]/[chapterId]    → Manga with provider (no type)
 *
 * Catch-all slug patterns:
 * - Drama:  slug = [id, chapterIndex, type]
 * - Others: slug = [provider, id, chapterIndex/chapterId]
 */

interface WatchPageProps {
  params: Promise<{
    kategori: string;
    slug: string[];
  }>;
}

const API_BASE_URL = process.env.API_BASE_URL;
const DRAMA_API_KEY = process.env.DRAMA_API_KEY;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (DRAMA_API_KEY) {
    headers["Authorization"] = `Bearer ${DRAMA_API_KEY}`;
  }
  return headers;
}

// ==================== API Functions ====================

async function getDramaStream(
  id: string,
  chapterIndex: string,
  type: string,
): Promise<StreamResponse | null> {
  const url = `${API_BASE_URL}/v2/drama/stream/${id}/${chapterIndex}?type=${type}`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
    cache: "force-cache",
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;
  return response.json();
}

async function getProviderStream(
  kategori: string,
  provider: string,
  id: string,
  chapterIndex: string,
): Promise<StreamResponse | null> {
  const url =
    kategori === "anime" || kategori === "movies"
      ? `${API_BASE_URL}/${kategori}/${provider}/stream/${chapterIndex}`
      : `${API_BASE_URL}/${kategori}/${provider}/stream/${id}/${chapterIndex}`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
    cache: "force-cache",
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;
  return response.json();
}

async function getMovieStream(
  provider: string,
  id: string,
): Promise<MovieStreamResponse | null> {
  const url = `${API_BASE_URL}/movies/${provider}/stream/${id}`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
    cache: "force-cache",
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;
  return response.json();
}

async function getDramaDetail(id: string, type: string, chapterId: string) {
  const response = await fetch(
    // `${API_BASE_URL}/drama/${type}/detail/${id}`,
    `${API_BASE_URL}/v2/drama/detail/${id}?type=${type}`,
    {
      headers: getAuthHeaders(),
      cache: "force-cache",
      next: { revalidate: 300 },
    },
  );

  if (!response.ok) return null;
  return response.json() as Promise<DramaDetailResponse>;
}

async function getProviderDetail(
  kategori: string,
  provider: string,
  id: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/${kategori}/${provider}/detail/${id}`,
    {
      headers: getAuthHeaders(),
      cache: "force-cache",
      next: { revalidate: 300 },
    },
  );

  if (!response.ok) return null;
  return response.json() as Promise<DramaDetailResponse>;
}

async function getMangaChapterData(
  kategori: string,
  provider: string,
  chapterIndex: string,
): Promise<MangaChapterResponse | null> {
  const url = `${API_BASE_URL}/${kategori}/${provider}/chapters?id=${chapterIndex}`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
    cache: "force-cache",
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;
  return response.json();
}

// ==================== Provider Resolution ====================

type ProviderKategori = "anime" | "movies" | "manga";

const SLUG_PREFIX: Record<ProviderKategori, string> = {
  anime: "a",
  movies: "m",
  manga: "mg",
};

async function resolveProviderFromSlug(
  kategori: ProviderKategori,
  slug: string,
): Promise<string | null> {
  const prefix = SLUG_PREFIX[kategori];
  const regex = new RegExp(`^${prefix}(\\d+)$`);
  const match = slug.match(regex);

  if (!match) return null;

  const index = parseInt(match[1], 10) - 1;
  if (index < 0) return null;

  const response = await fetch(`${API_BASE_URL}/${kategori}/providers`, {
    headers: getAuthHeaders(),
    cache: "force-cache",
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;

  const data = await response.json();
  if (!data.success || index >= data.data.length) return null;

  return data.data[index].name;
}

// ==================== Validators ====================

function isValidKategori(kategori: string): kategori is Kategori {
  return ["drama", "anime", "movies", "manga"].includes(kategori);
}

function isProviderKategori(kategori: string): kategori is ProviderKategori {
  return ["anime", "movies", "manga"].includes(kategori);
}

// ==================== Route Parsers ====================

interface DramaWatchRoute {
  type: "drama";
  id: string;
  chapterIndex: string;
  dramaType: string;
}

interface ProviderWatchRoute {
  type: "provider";
  kategori: ProviderKategori;
  providerSlug: string;
  providerName: string;
  id: string;
  chapterIndex: string;
}

type ParsedWatchRoute = DramaWatchRoute | ProviderWatchRoute | null;

async function parseWatchRoute(
  kategori: string,
  slug: string[],
): Promise<ParsedWatchRoute> {
  // Drama routes:
  // Type 1: /drama/watch/[dramaId]/[chapterIndex]/[type]  → slug = [dramaId, chapterIndex, type]
  // Type 2: /drama/watch/[dramaId]/[chapterId]/[type]  → slug = [dramaId, chapterId, type]
  if (kategori === "drama") {
    if (slug.length !== 3) return null;

    const [first, second, third] = slug;
    const dramaType = third;

    // First param is ALWAYS dramaId for both type 1 and type 2
    return { type: "drama", id: first, chapterIndex: second, dramaType };
  }

  // Provider route: /[kategori]/[provider]/watch/[id]/[chapterIndex]
  // slug = [provider, id, chapterIndex]
  if (isProviderKategori(kategori)) {
    if (slug.length !== 3) return null;

    const [providerSlug, id, chapterIndex] = slug;
    const providerName = await resolveProviderFromSlug(kategori, providerSlug);

    if (!providerName) return null;

    return {
      type: "provider",
      kategori,
      providerSlug,
      providerName,
      id,
      chapterIndex,
    };
  }

  return null;
}

// ==================== Page Component ====================

export default async function Page({ params }: WatchPageProps) {
  const { kategori, slug } = await params;

  // Validate kategori
  if (!isValidKategori(kategori)) {
    notFound();
  }

  // Parse route based on kategori
  const route = await parseWatchRoute(kategori, slug);

  if (!route) {
    notFound();
  }

  // Handle drama watch
  if (route.type === "drama") {
    const [streamData, detailData] = await Promise.all([
      getDramaStream(route.id, route.chapterIndex, route.dramaType),
      getDramaDetail(route.id, route.dramaType, route.chapterIndex),
    ]);

    if (!streamData || !streamData.success) {
      notFound();
    }

    if (!detailData || !detailData.success) {
      notFound();
    }

    return (
      <WatchPage
        kategori="drama"
        provider={route.dramaType}
        streamData={streamData.data}
        dramaData={detailData.data}
        chapterId={route.id}
        dramaId={route.id}
        currentChapterIndex={parseInt(route.chapterIndex, 10)}
        type={route.dramaType}
      />
    );
  }

  // Handle manga watch/read
  if (route.kategori === "manga") {
    const [mangaChapterData, detailData] = await Promise.all([
      getMangaChapterData(
        route.kategori,
        route.providerName,
        route.chapterIndex,
      ),
      getProviderDetail(route.kategori, route.providerName, route.id),
    ]);

    if (!mangaChapterData || !mangaChapterData.success) {
      notFound();
    }

    if (!detailData || !detailData.success) {
      notFound();
    }

    return (
      <MangaReaderPage
        kategori={route.kategori}
        provider={route.providerSlug}
        mangaPages={mangaChapterData.data}
        chapterDesc={mangaChapterData.desc}
        dramaData={detailData.data}
        currentChapterId={route.chapterIndex}
      />
    );
  }

  // Handle anime/movies watch
  if (route.kategori === "movies") {
    // Movies use different API response format (data is array)
    const [movieStreamData, detailData] = await Promise.all([
      getMovieStream(route.providerName, route.id),
      getProviderDetail(route.kategori, route.providerName, route.id),
    ]);

    if (!movieStreamData || !movieStreamData.success) {
      notFound();
    }

    if (!detailData || !detailData.success) {
      notFound();
    }

    // Transform movie stream data to format expected by WatchPage
    const movieStreamDataFormatted = {
      id: route.id,
      coverImage: detailData.data.coverImage,
      chapterIndex: 0,
      streamUrl: "",
      qualities: [],
      src: movieStreamData.data,
    };

    return (
      <WatchPage
        kategori={route.kategori}
        provider={route.providerSlug}
        streamData={movieStreamDataFormatted}
        dramaData={detailData.data}
        currentChapterIndex={0}
      />
    );
  }

  // Handle anime watch
  const [streamData, detailData] = await Promise.all([
    getProviderStream(
      route.kategori,
      route.providerName,
      route.id,
      route.chapterIndex,
    ),
    getProviderDetail(route.kategori, route.providerName, route.id),
  ]);

  if (!streamData || !streamData.success) {
    notFound();
  }

  if (!detailData || !detailData.success) {
    notFound();
  }

  return (
    <WatchPage
      kategori={route.kategori}
      provider={route.providerSlug}
      streamData={streamData.data}
      dramaData={detailData.data}
      currentChapterIndex={parseInt(route.chapterIndex, 10)}
    />
  );
}
