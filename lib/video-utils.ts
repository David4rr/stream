/**
 * Video proxy utilities untuk bypass Cloudflare protection
 */

/**
 * Daftar domain yang memerlukan proxy
 */
const PROXY_REQUIRED_DOMAINS = [
    "animeinweb.com",
    "animein.net",
    "api.animein.net",
    "xyz-api.animein.net",
];

/**
 * Cek apakah URL memerlukan proxy
 * @param url - URL video yang akan dicek
 * @returns true jika URL perlu di-proxy
 */
export function isProxyRequired(url: string): boolean {
    if (!url) return false;

    try {
        const parsedUrl = new URL(url);
        return PROXY_REQUIRED_DOMAINS.some(
            (domain) =>
                parsedUrl.hostname === domain ||
                parsedUrl.hostname.endsWith(`.${domain}`)
        );
    } catch {
        return false;
    }
}

/**
 * Konversi URL video ke URL proxy jika diperlukan
 * @param originalUrl - URL video asli
 * @param animeId - ID anime (required untuk domain animein)
 * @returns URL proxy jika domain memerlukan proxy, atau URL asli
 *
 * @example
 * // URL yang perlu di-proxy
 * proxyVideoUrl("https://xyz-api.animein.net/video.m3u8", "12345")
 * // Returns: "/api/video-proxy?url=https%3A%2F%2Fxyz-api.animein.net%2Fvideo.m3u8&animeId=12345"
 *
 * // URL yang tidak perlu di-proxy
 * proxyVideoUrl("https://example.com/video.mp4")
 * // Returns: "https://example.com/video.mp4"
 */
export function proxyVideoUrl(originalUrl: string, animeId?: string): string {
    if (!originalUrl) return originalUrl;

    if (isProxyRequired(originalUrl)) {
        if (!animeId) {
            console.warn("[video-proxy] animeId required for animein domain, returning original URL");
            return originalUrl;
        }
        return `/api/video-proxy?url=${encodeURIComponent(originalUrl)}&animeId=${encodeURIComponent(animeId)}`;
    }

    return originalUrl;
}

/**
 * Contoh penggunaan dari client component:
 * 
 * ```tsx
 * import { proxyVideoUrl } from "@/lib/video-utils";
 * 
 * // Di dalam component
 * const videoUrl = "https://xyz-api.animein.net/stream/video.m3u8";
 * const proxiedUrl = proxyVideoUrl(videoUrl);
 * 
 * // Gunakan di video element
 * <video src={proxiedUrl} />
 * ```
 * 
 * Atau fetch manual:
 * 
 * ```tsx
 * const fetchVideo = async (url: string) => {
 *   const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(url)}`;
 *   const response = await fetch(proxyUrl);
 *   
 *   if (!response.ok) {
 *     const error = await response.json();
 *     throw new Error(error.error);
 *   }
 *   
 *   // Untuk m3u8/text
 *   const data = await response.text();
 *   return data;
 * };
 * ```
 */
