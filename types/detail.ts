// API Response Types for Drama Detail

export interface Chapter {
    chapterId: string;
    episodeId?: string; // For anime, use episodeId instead of chapterId
    chapterIndex: number;
}

export interface DramaData {
    id: string;
    title: string;
    descriptions: string;
    description?: string;
    coverImage: string;
    playCount: string;
    chapters: Chapter[];
    episodes?: Chapter[]; // For anime, chapters are called episodes
}

export interface DramaDetailResponse {
    success: boolean;
    source: string;
    path: string;
    type: number;
    chapterCount: number;
    data: DramaData;
}

// API Response Types for Recommendations

export interface RecommendationItem {
    id: string;
    title: string;
    type?: number; // For dramas with multiple providers
    description: string;
    coverImage: string;
    playCount: string;
    chapterCount: number;
}

export interface RecommendationsResponse {
    success: boolean;
    source: string;
    path: string;
    count: number;
    data: RecommendationItem[];
}

// API Response Types for Providers

export interface Provider {
    name: string;
}

export interface ProvidersResponse {
    success: boolean;
    source: string;
    path: string;
    data: Provider[];
}

// Kategori types
export type Kategori = "drama" | "anime" | "movies" | "manga";

// API Response Types for Stream

export interface StreamQuality {
    name?: string;
    quality: number;
    streamUrl: string; // For movies, the qualities are nested under each src entry
    src?: string; // For movies, the stream URL is directly in src
}

export interface StreamData {
    id: string;
    coverImage: string;
    chapterIndex: number;
    streamUrl: string;
    qualities: StreamQuality[];
    servers?: StreamQuality[];
    src?: StreamWatchMovieData[]; // For movies, the stream URL is directly in src
}

export interface StreamWatchMovieData {
    iframe: string;
    src: string;
    source?: string;
}

export interface StreamResponse {
    success: boolean;
    source: string;
    path: string;
    data: StreamData;
}

// Special response type for movies (data is array)
export interface MovieStreamResponse {
    success: boolean;
    source: string;
    path: string;
    data: StreamWatchMovieData[];
}

// API Response Types for Manga Chapter

export interface MangaPage {
    page: number;
    img: string;
}

export interface MangaChapterData {
    desc: string;
    data: MangaPage[];
}

export interface MangaChapterResponse {
    success: boolean;
    source: string;
    path: string;
    desc: string;
    data: MangaPage[];
}

// API Response Types for Genre

export interface Genre {
    genreId: string;
    genreName: string;
    genre?: string;
}

export interface GenreListResponse {
    success: boolean;
    source: string;
    path: string;
    data: Genre[];
}

// API Response Types for Search

export interface SearchItem {
    id: string;
    title: string;
    coverImage: string;
    playCount?: string;
    chapterCount?: number;
    type?: number; // For dramas with multiple providers
}

export interface SearchResponse {
    success: boolean;
    source: string;
    path: string;
    count: number;
    type?: number; // For dramas with multiple providers
    data: SearchItem[];
}

// API Response Types for Comments

export interface CommentUser {
    id: string;
    username: string;
    email: string;
}

export interface Comment {
    id: string;
    userId: string;
    contentItemId: string;
    parentCommentId: string | null;
    body: string;
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
    user: CommentUser;
    children: Comment[];
    contentItem?: {
        id: string;
        categoryId: string;
        providerKey: string;
        sourceId: string;
    };
}

export interface CommentsResponse {
    success: boolean;
    source: string;
    path: string;
    count: number;
    data: Comment[];
}

export interface CreateCommentResponse {
    success: boolean;
    source: string;
    path: string;
    message?: string;
    data?: Comment;
}

export interface CreateCommentRequest {
    userId: string;
    contentItemId: string;
    body: string;
    parentCommentId?: string | null;
}

export interface UpdateCommentRequest {
    body: string;
    isDeleted?: number;
}

export interface UpdateCommentResponse {
    success: boolean;
    source: string;
    path: string;
    message?: string;
    data?: Comment;
}

export interface DeleteCommentResponse {
    success: boolean;
    source: string;
    path: string;
    deletedId?: string;
    data?: {
        id: string;
        isDeleted: number;
    };
    message?: string;
}

export interface ReplyCommentResponse {
    success: boolean;
    source: string;
    path: string;
    parentCommentId?: string;
    count?: number;
    data?: Comment[];
    message?: string;
}

export interface CreateReplyRequest {
    userId: string;
    contentItemId: string;
    body: string;
}

export interface CreateReplyResponse {
    success: boolean;
    source: string;
    path: string;
    parentCommentId?: string;
    data?: Comment;
    message?: string;
}