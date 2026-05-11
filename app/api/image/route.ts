import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route untuk proxy dan konversi gambar HEIC ke JPEG
 * SECURE: Hanya mengizinkan domain yang sudah di-whitelist
 * Usage: /api/image?url=https://example.com/image.heic
 */

// Whitelist domain yang DIIZINKAN (security measure)
const ALLOWED_DOMAINS = [
    'p19-novel-sign-sg.fizzopic.org',
    'p16-novel-sign-sg.fizzopic.org',
    'fmcdn.mangahere.com',
    'mangahere.com',
    'hwztchapter.dramaboxdb.com',
    'thwztchapter.dramaboxdb.com',
    'api.animein.net',
    'xyz-api.animein.net',
    'img.komiku.org',
    'thumbnail.komiku.org',
    'komiku.org',
];

// Domain-specific headers untuk bypass hotlink protection
const DOMAIN_HEADERS: Record<string, Record<string, string>> = {
    'p19-novel-sign-sg.fizzopic.org': {
        'Referer': 'https://mangabox.me/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
    },
    'p16-novel-sign-sg.fizzopic.org': {
        'Referer': 'https://mangabox.me/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
    },
    'fmcdn.mangahere.com': {
        'Referer': 'https://www.mangahere.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
    },
    'mangahere.com': {
        'Referer': 'https://www.mangahere.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
    },
    'img.komiku.org': {
        'Referer': 'https://komiku.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
    },
    'thumbnail.komiku.org': {
        'Referer': 'https://komiku.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
    },
    'komiku.org': {
        'Referer': 'https://komiku.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
    },
};

/**
 * Validasi URL - cek apakah domain diizinkan
 */
function isUrlAllowed(urlString: string): { allowed: boolean; hostname?: string } {
    try {
        const url = new URL(urlString);

        // Hanya izinkan HTTP/HTTPS
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return { allowed: false };
        }

        // Cek whitelist domain
        const isAllowed = ALLOWED_DOMAINS.some(domain =>
            url.hostname === domain || url.hostname.endsWith('.' + domain)
        );

        return { allowed: isAllowed, hostname: url.hostname };
    } catch {
        return { allowed: false };
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = request.nextUrl.searchParams.get('url');

        if (!url) {
            return new NextResponse('Missing url parameter', { status: 400 });
        }

        // SECURITY: Validasi URL sebelum fetch
        const validation = isUrlAllowed(url);
        if (!validation.allowed) {
            return new NextResponse('URL not allowed', { status: 403 });
        }


        // Cek domain untuk headers khusus
        let headers: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'sec-fetch-dest': 'image',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-site': 'cross-site',
        };

        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            // Gunakan headers khusus untuk domain tertentu
            for (const [domain, domainHeaders] of Object.entries(DOMAIN_HEADERS)) {
                if (hostname === domain || hostname.endsWith('.' + domain)) {
                    headers = { ...headers, ...domainHeaders };
                    break;
                }
            }

            // Fallback: gunakan origin sebagai referer
            if (!headers['Referer']) {
                headers['Referer'] = urlObj.origin;
            }
        } catch { /* invalid URL */ }

        // Fetch gambar dari URL original dengan timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const imageResponse = await fetch(url, {
            headers,
            signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));

        if (!imageResponse.ok) {
            return new NextResponse(`Failed to fetch image: ${imageResponse.status}`, {
                status: imageResponse.status
            });
        }

        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await imageResponse.arrayBuffer();


        // Cek jika gambar adalah HEIC
        const isHeic = url.toLowerCase().includes('.heic') || contentType.includes('heic');

        let outputBuffer: ArrayBuffer;
        let outputContentType: string;

        if (isHeic) {
            try {

                // Import heic-convert secara dinamis
                // @ts-expect-error: heic-convert does not have type definitions
                const heicConvert = (await import('heic-convert')).default;

                // Konversi HEIC ke JPEG
                const jpegBuffer = await heicConvert({
                    buffer: Buffer.from(arrayBuffer),
                    format: 'JPEG',
                    quality: 0.9,
                });

                outputBuffer = jpegBuffer;
                outputContentType = 'image/jpeg';
            } catch (conversionError) {
                // Jika konversi gagal, return buffer asli
                outputBuffer = arrayBuffer;
                outputContentType = 'image/jpeg';
            }
        } else {
            // Bukan HEIC, return as-is
            outputBuffer = arrayBuffer;
            outputContentType = contentType;
        }

        // Return image dengan proper headers dan caching
        return new NextResponse(outputBuffer, {
            status: 200,
            headers: {
                'Content-Type': outputContentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            return new NextResponse('Request timeout', { status: 504 });
        }
        return new NextResponse(`Internal Server Error: ${(error as Error).message}`, { status: 500 });
    }
}
