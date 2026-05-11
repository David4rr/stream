/**
 * Favorites Page
 *
 * SSR Pattern (CONTEXT.md):
 * - Server Component fetches initial data
 * - Pass data as props to Client Component
 * - No useEffect/fetch in Client Component for initial load
 * - Protected by middleware
 */

// Force dynamic rendering to prevent caching of user-specific favorites
export const dynamic = 'force-dynamic';

import { getAllFavorites } from "@/app/actions/favorites";
import { FavoritesClient } from "./FavoritesClient";
import type { FavoriteDrama } from "@/app/actions/favorites";

/**
 * Server Component - Fetch data on server
 */
export default async function FavoritesPage() {
  // Fetch favorites data on server
  const result = await getAllFavorites();

  const favorites: FavoriteDrama[] = result.success ? result.data : [];

  // Get API base URL from server-side env
  const apiBaseUrl = process.env.API_BASE_URL || '';

  // Pass data as props to Client Component (CONTEXT.md pattern)
  return <FavoritesClient initialFavorites={favorites} apiBaseUrl={apiBaseUrl} />;
}
