/**
 * LocalStorage Cache Utility
 *
 * Caches enriched favorite data to avoid repeated API calls
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheStore<T> {
  private prefix: string;
  private defaultTTL: number;

  constructor(prefix: string, defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.prefix = prefix;
    this.defaultTTL = defaultTTL;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const fullKey = this.getKey(key);
      const item = localStorage.getItem(fullKey);

      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();

      // Check if expired
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(fullKey);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('[Cache] Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Set data in cache with optional custom TTL
   */
  set(key: string, data: T, ttl?: number): void {
    if (typeof window === 'undefined') return;

    try {
      const fullKey = this.getKey(key);
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL,
      };

      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (error) {
      console.error('[Cache] Error writing to cache:', error);
    }
  }

  /**
   * Remove specific entry from cache
   */
  delete(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('[Cache] Error deleting from cache:', error);
    }
  }

  /**
   * Clear all entries with this prefix
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[Cache] Error clearing cache:', error);
    }
  }

  /**
   * Get or set pattern - fetch if not cached
   */
  async getOrSet(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get(key);

    if (cached !== null) {
      console.log(`[Cache] Cache hit for key: ${key}`);
      return cached;
    }

    console.log(`[Cache] Cache miss for key: ${key}`);
    const data = await fetcher();
    this.set(key, data, ttl);

    return data;
  }
}

/**
 * Cache stores for different data types
 */

// Cache for enriched detail data (5 minutes TTL)
export const detailCache = new CacheStore<any>('detail_cache', 5 * 60 * 1000);

// Cache for favorites list (2 minutes TTL)
export const favoritesCache = new CacheStore<any[]>('favorites_cache', 2 * 60 * 1000);

// Cache for user data (10 minutes TTL)
export const userCache = new CacheStore<any>('user_cache', 10 * 60 * 1000);

/**
 * Generate cache key for detail data
 */
export function getDetailCacheKey(providerKey: string, sourceId: string): string {
  return `${providerKey}:${sourceId}`;
}

/**
 * Generate cache key for user favorites
 */
export function getFavoritesCacheKey(userId: string): string {
  return `user:${userId}`;
}

/**
 * Clear all caches (useful for logout)
 */
export function clearAllCaches(): void {
  detailCache.clear();
  favoritesCache.clear();
  userCache.clear();
}

/**
 * Get cache size estimate (in bytes)
 */
export function getCacheSize(): number {
  if (typeof window === 'undefined') return 0;

  try {
    let totalSize = 0;
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith('detail_cache') || key.startsWith('favorites_cache') || key.startsWith('user_cache')) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    });

    return totalSize;
  } catch (error) {
    return 0;
  }
}

/**
 * Clean expired cache entries
 */
export function cleanExpiredCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith('detail_cache') || key.startsWith('favorites_cache') || key.startsWith('user_cache')) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const entry: CacheEntry<any> = JSON.parse(value);
            if (now - entry.timestamp > entry.ttl) {
              localStorage.removeItem(key);
            }
          } catch {
            // Invalid entry, remove it
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error('[Cache] Error cleaning expired cache:', error);
  }
}
