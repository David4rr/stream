/**
 * Provider Home Page — SSR per provider slug
 *
 * Routes: /drama, /animes1, /animes2, /movies1, /movies2, /mangas1, /mangas2
 * Resolves slug -> provider -> fetches data server-side -> renders client component
 */

export const revalidate = 300; // 5 minutes

import { notFound } from "next/navigation";
import {
  getAllProvidersFromAPI,
  getRecommendationsByKategoriFromAPI,
  getNewReleaseByKategoriFromAPI,
  getGenresByKategoriFromAPI,
  getDramasByGenreByKategoriFromAPI,
} from "@/app/actions/drama";
import { resolvePageSlug } from "@/components/beranda/utils/constants";
import { ProviderHomeClient } from "@/app/beranda/ProviderHomeClient";
import { MOCK_BERANDA_DATA } from "@/components/beranda";
import type { Drama, Genre, Provider } from "@/components/beranda/types";

const INITIAL_VISIBLE_GENRES = 9;

interface PageProps {
  params: Promise<{ kategori: string }>;
}

export default async function ProviderHomePage({ params }: PageProps) {
  const { kategori: slug } = await params;

  // Fetch providers
  const providers: Provider[] = await getAllProvidersFromAPI().catch(() => []);
  if (providers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500">Failed to load providers. Please try again later.</p>
      </div>
    );
  }

  // Resolve slug to provider
  const resolved = resolvePageSlug(slug, providers);
  if (!resolved) return notFound();

  const { provider: resolvedProvider, index: providerIndex } = resolved;

  // Parallel data fetch
  const [recommendationsData, newReleaseData, genresData, berandaData] = await Promise.all([
    getRecommendationsByKategoriFromAPI(resolvedProvider.kategori, resolvedProvider.name).catch(() => ({
      data: [] as Drama[],
    })),
    getNewReleaseByKategoriFromAPI(resolvedProvider.kategori, resolvedProvider.name).catch(() => ({
      data: [] as Drama[],
    })),
    getGenresByKategoriFromAPI(resolvedProvider.kategori, resolvedProvider.name).catch(() => ({
      data: [] as Genre[],
    })),
    Promise.resolve(MOCK_BERANDA_DATA),
  ]);

  const recommendations = recommendationsData?.data || [];
  const newRelease = newReleaseData?.data || [];
  const genres = genresData?.data || [];

  // Pre-fetch dramas for first 9 genres SSR
  const initialGenreDramas: Record<number, Drama[]> = {};
  if (genres.length > 0) {
    const genresToFetch = genres.slice(0, INITIAL_VISIBLE_GENRES);
    const genreResults = await Promise.allSettled(
      genresToFetch.map((genre) =>
        getDramasByGenreByKategoriFromAPI(resolvedProvider.kategori, resolvedProvider.name, genre.genreId)
      )
    );
    genreResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.data) {
        initialGenreDramas[genresToFetch[index].genreId] = result.value.data;
      }
    });
  }

  return (
    <ProviderHomeClient
      providers={providers}
      provider={resolvedProvider}
      providerIndex={providerIndex}
      initialRecommendations={recommendations}
      initialNewRelease={newRelease}
      initialGenres={genres}
      initialGenreDramas={initialGenreDramas}
      berandaData={berandaData}
    />
  );
}
