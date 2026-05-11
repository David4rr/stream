export type Kategori = "drama" | "anime" | "movies" | "manga";

export interface Provider {
  name: string;
  kategori: Kategori;
  slug: string;
}

export interface RawProvider {
  name: string;
}

export interface ProvidersResponse {
  success: boolean;
  source: string;
  path: string;
  data: RawProvider[];
}

export interface Movie {
  id: string;
  title: string;
  poster?: string;
  episodes?: number;
  views?: string;
  category?: string;
  duration?: string;
  rating?: number;
  year?: number;
  type?: number;
}

export interface Drama {
  id: string;
  title: string;
  description?: string;
  descriptions?: string; // Some providers (melolo) use plural form
  coverImage?: string;
  playCount?: string | null; // Can be null for some providers
  chapterCount?: number;
  type?: number;
}

export interface RecommendationsResponse {
  success: boolean;
  source: string;
  path: string;
  count: number;
  data: Drama[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface HeroData {
  id: string;
  title: string;
  description: string;
  category: string;
  episodes: number;
  views: string;
  duration?: string;
  rating?: number;
  year?: number;
  featured?: boolean;
}

export interface PromoData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
}

export interface MovieCategory {
  id: string;
  title: string;
  movies: Movie[];
}

/**
 * Genre type from Drama API genre endpoint
 */
export interface Genre {
  genreId: number;
  genreName: string;
  genre?: string; // For providers that use 'genre' instead of 'genreName'
  lang: string;
}

export interface GenreResponse {
  success: boolean;
  source: string;
  path: string;
  count: number;
  data: Genre[];
}

export interface GenreDramasResponse {
  source: string;
  path: string;
  count: number;
  data: Drama[];
}

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface BerandaData {
  hero: HeroData;
  categories: MovieCategory[];
  promo: PromoData;
  faqs: FAQItem[];
  footer: {
    sections: FooterSection[];
    copyright: string;
    legalLinks: FooterLink[];
  };
}

// Redux State Type
export interface BerandaState {
  data: BerandaData | null;
  loading: boolean;
  error: string | null;
  currentSlide: number;
}
