/**
 * Beranda Page - Streaming Platform
 *
 * SSR Pattern (CONTEXT.md):
 * - Server Component fetches initial data
 * - Pass data as props to Client Component
 * - No useEffect/fetch in Client Component for initial load
 *
 * Cache: Revalidate every 5 minutes (300 seconds)
 */

export const revalidate = 300; // 5 minutes

import {
  getAllProvidersFromAPI,
  getRecommendationsByKategoriFromAPI,
  getNewReleaseByKategoriFromAPI,
  getGenresByKategoriFromAPI,
  getDramasByGenreByKategoriFromAPI
} from "@/app/actions/drama";
import { BerandaClient } from "./BerandaClient";
import { MOCK_BERANDA_DATA } from "@/components/beranda";
import type { Drama, Genre, Provider } from "@/components/beranda/types";

const INITIAL_VISIBLE_GENRES = 9; // Pre-fetch first 9 genres for SSR

/**
 * Server Component - Fetch data on server
 * CONTEXT.md: Direct Function Call in Server Component -> Pass as Props
 * CONTEXT.md: Promise.all for parallel fetches (avoid waterfalls)
 */
export default async function BerandaPage() {
  // Fetch ALL providers from all categories (drama, anime, movies, manga)
  const providers: Provider[] = await getAllProvidersFromAPI().catch(() => []);

  // Fallback if no providers found
  if (providers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500">Failed to load providers. Please try again later.</p>
      </div>
    );
  }

  // Get first provider for initial content
  const firstProvider = providers[0];

  // Parallel fetch for efficiency (CONTEXT.md: Promise.all)
  const [recommendationsData, newReleaseData, genresData, berandaData] = await Promise.all([
    // Fetch recommendations for first provider using its kategori
    getRecommendationsByKategoriFromAPI(firstProvider.kategori, firstProvider.name).catch(() => ({
      data: [] as Drama[],
    })),
    // Fetch new release for section 2
    getNewReleaseByKategoriFromAPI(firstProvider.kategori, firstProvider.name).catch(() => ({
      data: [] as Drama[],
    })),
    // Fetch all genres for the provider
    getGenresByKategoriFromAPI(firstProvider.kategori, firstProvider.name).catch(() => ({
      data: [] as Genre[],
    })),
    // Mock data for now (replace with actual API call)
    Promise.resolve(MOCK_BERANDA_DATA),
  ]);

  // Extract arrays
  const recommendations = recommendationsData?.data || [];
  const newRelease = newReleaseData?.data || [];
  const genres = genresData?.data || [];

  // Pre-fetch dramas for the first 9 genres (Server-side optimization)
  const initialGenreDramas: Record<number, Drama[]> = {};
  if (genres.length > 0) {
    const genresToFetch = genres.slice(0, INITIAL_VISIBLE_GENRES);
    const genreResults = await Promise.allSettled(
      genresToFetch.map((genre) =>
        getDramasByGenreByKategoriFromAPI(firstProvider.kategori, firstProvider.name, genre.genreId)
      )
    );

    genreResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.data) {
        initialGenreDramas[genresToFetch[index].genreId] = result.value.data;
      }
    });
  }

  // Pass data as props to Client Component (CONTEXT.md pattern)
  // totalSections is now calculated dynamically in BerandaClient
  return (
    <BerandaClient
      providers={providers}
      initialRecommendations={recommendations}
      initialNewRelease={newRelease}
      initialGenres={genres}
      initialGenreDramas={initialGenreDramas}
      initialProvider={firstProvider}
      berandaData={berandaData}
      totalSections={0} // Calculated dynamically in BerandaClient
    />
  );
}
