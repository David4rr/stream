/**
 * Daftar domain yang memerlukan proxy untuk gambar
 * (HANYA domain yang punya hotlink protection atau CORS issues)
 *
 * NOTE: Domain lain seperti animein.net, dramaboxdb.com TIDAK perlu proxy
 */
const PROXY_IMAGE_DOMAINS = [
    // Manga - perlu proxy untuk bypass hotlink
    'p19-novel-sign-sg.fizzopic.org',
    'p16-novel-sign-sg.fizzopic.org',
    'fizzopic.org',
    'fmcdn.mangahere.com',
    'mangahere.com',
];

/**
 * Cek apakah URL gambar perlu di-proxy
 */
function needsProxy(imageUrl: string): boolean {
    if (!imageUrl) return false;

    try {
        const url = new URL(imageUrl);
        return PROXY_IMAGE_DOMAINS.some(domain =>
            url.hostname === domain || url.hostname.endsWith('.' + domain)
        );
    } catch {
        return false;
    }
}

/**
 * Konversi URL gambar .heic atau dari domain yang perlu proxy
 * Menggunakan proxy API untuk handle konversi dan hotlink protection
 * @param imageUrl - URL gambar original
 * @returns URL gambar yang telah di-proxy atau original jika tidak perlu
 */
export function convertHeicUrl(imageUrl: string): string {
    if (!imageUrl) return imageUrl;

    // Cek jika URL berisi .heic (dengan atau tanpa query parameters)
    if (/\.heic(\?|$)/i.test(imageUrl)) {
        return `/api/image?url=${encodeURIComponent(imageUrl)}`;
    }

    // Cek jika domain memerlukan proxy (hotlink protection)
    if (needsProxy(imageUrl)) {
        return `/api/image?url=${encodeURIComponent(imageUrl)}`;
    }

    return imageUrl;
}

/**
 * Tambahkan fallback jika gambar gagal load
 * @param imageUrl - URL gambar original
 * @returns URL dengan fallback placeholder
 */
export function getImageWithFallback(imageUrl: string): string {
    if (!imageUrl) {
        return '/placeholder-drama.jpg'; // Placeholder default
    }

    return convertHeicUrl(imageUrl);
}

/**
 * Handler untuk error loading gambar
 * @param event - Event error dari img element
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
    const img = event.currentTarget;
    const originalSrc = img.src;

    // Jika sudah gagal ke placeholder, jangan retry lagi
    if (originalSrc.includes('placeholder')) return;

    // Jika dari API proxy dan masih gagal
    if (originalSrc.includes('/api/image')) {

        // Extract original URL dari query parameter
        try {
            const urlParam = new URL(originalSrc).searchParams.get('url');
            if (urlParam) {
                // Coba ganti .heic ke .jpg atau .webp
                const alternativeUrl = urlParam
                    .replace(/\.heic(\?|$)/i, '.jpg$1')
                    .replace(/\.heic(\?|$)/i, '.webp$1');

                if (alternativeUrl !== urlParam) {
                    img.src = alternativeUrl;
                    return;
                }
            }
        } catch (e) {
        }

        // Jika gagal, langsung ke placeholder
        img.src = '/placeholder-drama.jpg';
        return;
    }

    // Coba gunakan proxy API untuk .heic
    if (/\.heic(\?|$)/i.test(originalSrc)) {
        img.src = `/api/image?url=${encodeURIComponent(originalSrc)}`;
        return;
    }

    // Fallback ke placeholder
    img.src = '/placeholder-drama.jpg';
}

export const TYPE1_CROP_CLASS = "h-[250%] object-top object-cover";

export function getCropClass(isType1: boolean, defaultClass: string): string {
    return isType1 ? TYPE1_CROP_CLASS : defaultClass;
}

export function isType1ForKategori(kategori: string, type?: number): boolean {
    return kategori === "drama" ? (type || 1) === 1 : type === 1;
}
