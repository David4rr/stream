/**
 * Drama API Client
 *
 * Centralized API client for Drama API endpoints.
 * Eliminates code duplication across Server Actions and SSR fetch functions.
 *
 * CONTEXT.md compliance:
 * - ALL API URLs use process.env (Fail Fast validation)
 * - Client UI NEVER calls external API directly
 * - Flow: Server Component/Action -> External API
 */

// Env Vars with Fail Fast validation
const API_BASE_URL_VAR = process.env.API_BASE_URL;

if (!API_BASE_URL_VAR) {
  throw new Error(
    "API_BASE_URL is not defined. Please set API_BASE_URL in .env.local"
  );
}

const DRAMA_API_KEY = process.env.DRAMA_API_KEY;

// Type-safe constant (validated above)
const API_BASE: string = API_BASE_URL_VAR;

// Cache durations (in seconds)
export const CACHE_DURATION = {
  HOUR: 3600,
  TEN_MINUTES: 600,
} as const;

/**
 * Build headers with optional authentication
 */
export function getHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth && DRAMA_API_KEY) {
    headers["Authorization"] = `Bearer ${DRAMA_API_KEY}`;
  }

  return headers;
}

/**
 * Build API URL with optional path
 */
export function buildUrl(path: string = ""): string {
  if (!path) return API_BASE;
  return `${API_BASE}${path}`;
}

/**
 * Generic fetch for Server Actions with error handling
 */
export async function fetchAction<T>(
  path: string,
  options: {
    revalidate?: number;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
  } = {}
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const { revalidate = CACHE_DURATION.TEN_MINUTES, method = "GET", body } = options;

  try {
    const url = buildUrl(path);
    const headers = getHeaders();

    const fetchOptions: RequestInit = {
      method,
      headers,
      next: { revalidate },
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    // Don't log sensitive paths - use generic message
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch data",
    };
  }
}

/**
 * Generic fetch for Server Components (SSR)
 * Throws error on failure (expected by React SSR)
 */
export async function fetchSSR<T>(
  path: string,
  options: {
    revalidate?: number;
  } = {}
): Promise<T> {
  const { revalidate = CACHE_DURATION.TEN_MINUTES } = options;

  const url = buildUrl(path);
  const headers = getHeaders();

  const response = await fetch(url, {
    method: "GET",
    headers,
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`API returned ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch with query parameters for pagination
 */
export async function fetchWithPagination<T>(
  path: string,
  params: { limit?: number; offset?: number },
  options: { revalidate?: number } = {}
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.offset) queryParams.set("offset", params.offset.toString());

  const fullPath = queryParams.toString() ? `${path}?${queryParams}` : path;
  return fetchAction<T>(fullPath, options);
}
