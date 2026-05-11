'use server';

import { cookies } from 'next/headers';
import type {
    CommentsResponse, CreateCommentRequest, CreateCommentResponse,
    UpdateCommentRequest, UpdateCommentResponse, DeleteCommentResponse,
    ReplyCommentResponse, CreateReplyRequest, CreateReplyResponse, Comment,
} from '@/types/detail';

const API_BASE = process.env.API_BASE_URL;
if (!API_BASE) throw new Error('API_BASE_URL is not defined in environment variables');

const COMMENT_API      = `${API_BASE}/catalog/comment`;
const CONTENT_ITEM_API = `${API_BASE}/catalog/content-item`;
const CATEGORY_API     = `${API_BASE}/catalog/category`;

// ---- Internal Helpers ----

async function getSid() { return (await cookies()).get('sid')?.value; }

function buildHeaders(sid?: string): HeadersInit {
    return sid
        ? { 'Content-Type': 'application/json', Cookie: `sid=${sid}` }
        : { 'Content-Type': 'application/json' };
}

async function apiFetch(url: string, init: RequestInit = {}) {
    const sid = await getSid();
    return fetch(url, { ...init, headers: buildHeaders(sid) });
}

function errResponse(path: string, msg = 'Terjadi kesalahan koneksi') {
    return { success: false as const, source: 'catalog' as const, path, message: msg };
}

// ---- Internal Types ----

interface Category { id: string; key: string; name: string }
interface CategoryResponse { success: boolean; data?: Category | Category[] }
interface ContentItem { id: string; providerKey: string; sourceId: string }
interface ContentItemResponse { success: boolean; data?: ContentItem | ContentItem[] }
interface EnsureContentItemParams { sourceId: string; providerKey: string; categoryName?: string }

// ---- Exports ----

export async function getComments(contentItemId: string): Promise<CommentsResponse | null> {
    try {
        const res = await apiFetch(`${COMMENT_API}/all?contentItemId=${contentItemId}`, { cache: 'no-store' });
        if (!res.ok) return null;

        const result: CommentsResponse = await res.json();
        if (!result.success || !result.data) return result;

        const filtered = result.data.filter(
            (c: Comment) => c.contentItemId === contentItemId && c.isDeleted === 0,
        );
        const map = new Map<string, Comment>(filtered.map((c) => [c.id, { ...c, children: [] }]));
        const roots: Comment[] = [];

        for (const c of filtered) {
            const node = map.get(c.id)!;
            if (c.parentCommentId && map.has(c.parentCommentId)) {
                map.get(c.parentCommentId)!.children.push(node);
            } else {
                roots.push(node);
            }
        }
        return { ...result, data: roots };
    } catch { return null; }
}

export async function createComment(data: CreateCommentRequest): Promise<CreateCommentResponse> {
    try {
        const res = await apiFetch(`${COMMENT_API}/create`, { method: 'POST', body: JSON.stringify(data) });
        const json: CreateCommentResponse = await res.json();
        return res.ok ? json : errResponse('/catalog/comment/create', json.message ?? 'Gagal mengirim komentar') as CreateCommentResponse;
    } catch { return errResponse('/catalog/comment/create') as CreateCommentResponse; }
}

export async function updateComment(id: string, data: UpdateCommentRequest): Promise<UpdateCommentResponse> {
    try {
        const res = await apiFetch(`${COMMENT_API}/update/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        const json: UpdateCommentResponse = await res.json();
        return res.ok ? json : errResponse('/catalog/comment/update', json.message ?? 'Gagal mengupdate komentar') as UpdateCommentResponse;
    } catch { return errResponse('/catalog/comment/update') as UpdateCommentResponse; }
}

export async function deleteComment(id: string): Promise<DeleteCommentResponse> {
    try {
        const res = await apiFetch(`${COMMENT_API}/delete/${id}`, { method: 'DELETE' });
        const json: DeleteCommentResponse = await res.json();
        return res.ok ? json : errResponse('/catalog/comment/delete', json.message ?? 'Gagal menghapus komentar') as DeleteCommentResponse;
    } catch { return errResponse('/catalog/comment/delete') as DeleteCommentResponse; }
}

export async function getReplies(commentId: string): Promise<ReplyCommentResponse | null> {
    try {
        const res = await apiFetch(`${COMMENT_API}/reply/${commentId}`, { cache: 'no-store' });
        return res.ok ? res.json() : null;
    } catch { return null; }
}

export async function createReply(commentId: string, data: CreateReplyRequest): Promise<CreateReplyResponse> {
    try {
        const res = await apiFetch(`${COMMENT_API}/reply/${commentId}`, { method: 'POST', body: JSON.stringify(data) });
        const json: CreateReplyResponse = await res.json();
        return res.ok ? json : errResponse('/catalog/comment/reply', json.message ?? 'Gagal mengirim balasan') as CreateReplyResponse;
    } catch { return errResponse('/catalog/comment/reply') as CreateReplyResponse; }
}

export async function getCurrentUserId(): Promise<string | null> {
    try {
        const { me } = await import('@/app/actions/auth/me');
        const result = await me();
        return result.success ? (result.user?.id ?? null) : null;
    } catch { return null; }
}

async function ensureCategory(name: string): Promise<string | null> {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    try {
        const listRes = await apiFetch(`${CATEGORY_API}/all`, { cache: 'no-store' });
        if (listRes.ok) {
            const { success, data }: CategoryResponse = await listRes.json();
            if (success && data) {
                const items = Array.isArray(data) ? data : [data];
                const found = items.find((c) => c.key === key || c.name.toLowerCase() === name.toLowerCase());
                if (found) return found.id;
            }
        }
        const createRes = await apiFetch(`${CATEGORY_API}/create`, { method: 'POST', body: JSON.stringify({ name }) });
        if (!createRes.ok) return null;
        const { success, data }: CategoryResponse = await createRes.json();
        if (!success || !data) return null;
        return (Array.isArray(data) ? data[0] : data).id;
    } catch { return null; }
}

export async function ensureContentItem({ sourceId, providerKey, categoryName = 'General' }: EnsureContentItemParams): Promise<string | null> {
    try {
        const categoryId = await ensureCategory(categoryName);
        if (!categoryId) return null;

        const findItem = (data: ContentItem | ContentItem[]) => {
            const items = Array.isArray(data) ? data : [data];
            return items.find((i) => i.providerKey === providerKey && String(i.sourceId) === String(sourceId))?.id ?? null;
        };

        const listRes = await apiFetch(`${CONTENT_ITEM_API}/all`, { cache: 'no-store' });
        if (listRes.ok) {
            const { success, data }: ContentItemResponse = await listRes.json();
            if (success && data) { const id = findItem(data); if (id) return id; }
        }

        const createRes = await apiFetch(`${CONTENT_ITEM_API}/create`, {
            method: 'POST',
            body: JSON.stringify({ categoryId, providerKey, sourceId: String(sourceId), isActive: 1 }),
        });

        if (createRes.status === 409) {
            const retry = await apiFetch(`${CONTENT_ITEM_API}/all`, { cache: 'no-store' });
            if (!retry.ok) return null;
            const { success, data }: ContentItemResponse = await retry.json();
            return (success && data) ? findItem(data) : null;
        }

        if (!createRes.ok) return null;
        const { success, data }: ContentItemResponse = await createRes.json();
        if (!success || !data) return null;
        return (Array.isArray(data) ? data[0] : data).id;
    } catch { return null; }
}
