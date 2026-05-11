// import { NextRequest, NextResponse } from "next/server";
// import { checkVideoRateLimit } from "@/lib/rate-limit";

// /**
//  * Whitelist domain yang diizinkan untuk di-proxy
//  */
// const ALLOWED_DOMAINS = [
//     "animeinweb.com",
//     "animein.net",
//     "api.animein.net",
//     "xyz-api.animein.net",
// ];

// /**
//  * Headers yang akan dikirim ke upstream server
//  */
// const PROXY_HEADERS = {
//     referer: "https://animeinweb.com/anime/6232",
//     "sec-ch-ua": '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": '"Linux"',
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
// };

// /**
//  * Cek apakah URL dari domain yang diizinkan
//  */
// function isAllowedDomain(url: string): boolean {
//     try {
//         const parsedUrl = new URL(url);
//         return ALLOWED_DOMAINS.some(
//             (domain) =>
//                 parsedUrl.hostname === domain ||
//                 parsedUrl.hostname.endsWith(`.${domain}`)
//         );
//     } catch {
//         return false;
//     }
// }

// /**
//  * GET /api/video-proxy?url=<encoded_url>
//  * 
//  * Proxy endpoint untuk fetch video/m3u8 dari server-side
//  * dengan headers yang di-spoof untuk bypass Cloudflare
//  */
// export async function GET(request: NextRequest) {
//     // Rate limiting berdasarkan IP
//     const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
//         request.headers.get("x-real-ip") ||
//         "unknown";

//     if (!checkVideoRateLimit(ip)) {
//         return NextResponse.json(
//             { error: "Too many requests. Please try again later." },
//             { status: 429 }
//         );
//     }

//     // Ambil query parameter 'url'
//     const url = request.nextUrl.searchParams.get("url");

//     // Validasi: url wajib ada
//     if (!url) {
//         return NextResponse.json(
//             { error: "Missing required parameter: url" },
//             { status: 400 }
//         );
//     }

//     // Validasi: decode dan cek format URL
//     let decodedUrl: string;
//     try {
//         decodedUrl = decodeURIComponent(url);
//         new URL(decodedUrl); // Validate URL format
//     } catch {
//         return NextResponse.json(
//             { error: "Invalid URL format" },
//             { status: 400 }
//         );
//     }

//     // Validasi: hanya domain yang diizinkan
//     if (!isAllowedDomain(decodedUrl)) {
//         return NextResponse.json(
//             { error: "Domain not allowed" },
//             { status: 403 }
//         );
//     }

//     try {
//         // Fetch ke upstream server dengan headers yang di-spoof
//         const response = await fetch(decodedUrl, {
//             method: "GET",
//             headers: PROXY_HEADERS,
//         });

//         // Cek response status
//         if (!response.ok) {
//             return NextResponse.json(
//                 { error: `Upstream server returned ${response.status}` },
//                 { status: response.status }
//             );
//         }

//         // Ambil content-type dari response
//         const contentType = response.headers.get("content-type") || "";

//         // Jika response bertipe JSON
//         if (contentType.includes("application/json")) {
//             const jsonData = await response.json();
//             return NextResponse.json(jsonData, {
//                 status: 200,
//                 headers: {
//                     "Access-Control-Allow-Origin": "*",
//                     "Cache-Control": "no-store",
//                 },
//             });
//         }

//         // Jika response bukan JSON (m3u8, text, video segment, dll)
//         // Untuk m3u8 dan text, return sebagai text
//         if (
//             contentType.includes("text/") ||
//             contentType.includes("application/vnd.apple.mpegurl") ||
//             contentType.includes("application/x-mpegurl") ||
//             decodedUrl.endsWith(".m3u8")
//         ) {
//             const textData = await response.text();

//             return new NextResponse(textData, {
//                 status: 200,
//                 headers: {
//                     "Content-Type": contentType || "text/plain",
//                     "Access-Control-Allow-Origin": "*",
//                     "Cache-Control": "no-store",
//                 },
//             });
//         }

//         // Untuk binary content (video segments .ts, dll), stream langsung
//         const arrayBuffer = await response.arrayBuffer();

//         return new NextResponse(arrayBuffer, {
//             status: 200,
//             headers: {
//                 "Content-Type": contentType || "application/octet-stream",
//                 "Content-Length": arrayBuffer.byteLength.toString(),
//                 "Access-Control-Allow-Origin": "*",
//                 "Cache-Control": "no-store",
//             },
//         });

//     } catch (error) {

//         return NextResponse.json(
//             { error: "Failed to fetch from upstream server" },
//             { status: 502 }
//         );
//     }
// }

// /**
//  * Handle OPTIONS request for CORS preflight
//  */
// export async function OPTIONS() {
//     return new NextResponse(null, {
//         status: 204,
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Methods": "GET, OPTIONS",
//             "Access-Control-Allow-Headers": "Content-Type",
//             "Access-Control-Max-Age": "86400",
//         },
//     });
// }


import { NextRequest, NextResponse } from 'next/server';
// import { logger } from '@/lib/logger';

// Common headers for anime video requests
const getAnimeHeaders = (animeId: string, range?: string) => {
    const headers: Record<string, string> = {
        'referer': `https://animeinweb.com/anime/${animeId}`,
        'sec-ch-ua': '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        'accept': '*/*',
        'accept-encoding': 'identity;q=1, *;q=0',
        'accept-language': 'en-US,en;q=0.9',
        'connection': 'keep-alive',
    };

    if (range) {
        headers['range'] = range;
    }

    return headers;
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const videoUrl = searchParams.get('url');
    const animeId = searchParams.get('animeId');

    // Get range header from incoming request
    const rangeHeader = request.headers.get('range');

    if (!videoUrl) {
        return NextResponse.json({ error: 'Missing video URL' }, { status: 400 });
    }

    if (!animeId) {
        return NextResponse.json({ error: 'Missing anime ID' }, { status: 400 });
    }

    try {
        const decodedUrl = decodeURIComponent(videoUrl);

        // Validate URL to prevent SSRF
        let targetUrl: URL;
        try {
            targetUrl = new URL(decodedUrl);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        // Fetch video with custom headers (include range if present)
        const response = await fetch(decodedUrl, {
            method: 'GET',
            headers: getAnimeHeaders(animeId, rangeHeader || undefined),
            // Support for streaming
            cache: 'no-store',
        });

        if (!response.ok && response.status !== 206) {
            // logger.error(`[Video Proxy] Failed to fetch video: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `Failed to fetch video: ${response.status}` },
                { status: response.status }
            );
        }

        // Get response headers
        const contentType = response.headers.get('content-type') || 'video/mp4';
        const contentLength = response.headers.get('content-length');
        const contentRange = response.headers.get('content-range');
        const acceptRanges = response.headers.get('accept-ranges');

        // Create response headers
        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Accept-Ranges', 'bytes');

        if (contentLength) {
            headers.set('Content-Length', contentLength);
        }

        // Handle range response
        if (contentRange) {
            headers.set('Content-Range', contentRange);
        }

        // Set appropriate status code
        const status = response.status === 206 ? 206 : 200;

        // Copy other important headers
        const cacheControl = response.headers.get('cache-control');
        if (cacheControl) {
            headers.set('Cache-Control', cacheControl);
        } else {
            // Enable caching for video segments to improve performance
            headers.set('Cache-Control', 'public, max-age=3600');
        }

        // CORS headers
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Range, Accept-Encoding');
        headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

        // Additional headers for video streaming
        headers.set('X-Content-Type-Options', 'nosniff');

        // Stream the response
        const body = response.body;
        if (!body) {
            return NextResponse.json({ error: 'Empty response body' }, { status: 502 });
        }

        return new NextResponse(body, {
            status,
            headers,
        });

    } catch (error) {
        // logger.error('[Video Proxy] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle HEAD requests for video preloading
export async function HEAD(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const videoUrl = searchParams.get('url');
    const animeId = searchParams.get('animeId');

    if (!videoUrl || !animeId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        const decodedUrl = decodeURIComponent(videoUrl);

        const response = await fetch(decodedUrl, {
            method: 'HEAD',
            headers: getAnimeHeaders(animeId),
        });

        const headers = new Headers();
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        const acceptRanges = response.headers.get('accept-ranges');

        if (contentType) headers.set('Content-Type', contentType);
        if (contentLength) headers.set('Content-Length', contentLength);
        headers.set('Accept-Ranges', 'bytes');

        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

        return new NextResponse(null, {
            status: response.status,
            headers,
        });

    } catch (error) {
        // logger.error('[Video Proxy HEAD] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Range, Accept-Encoding, Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}