"use server";

import type { StreamData, StreamResponse } from "@/types/detail";

const API_BASE_URL = process.env.API_BASE_URL;
const DRAMA_API_KEY = process.env.DRAMA_API_KEY;

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (DRAMA_API_KEY) {
    headers["Authorization"] = `Bearer ${DRAMA_API_KEY}`;
  }
  return headers;
}

interface FetchStreamParams {
  kategori: string;
  provider: string;
  id: string;
  chapterIndex: string;
  type?: string;
}

export async function fetchStreamData(
  params: FetchStreamParams,
): Promise<StreamData | null> {
  const { kategori, provider, id, chapterIndex, type } = params;

  let url: string;

  if (kategori === "drama") {
    url = `${API_BASE_URL}/v2/drama/stream/${id}/${chapterIndex}?type=${type || "1"}`;
  } else if (kategori === "anime" || kategori === "movies") {
    url = `${API_BASE_URL}/${kategori}/${provider}/stream/${chapterIndex}`;
  } else {
    url = `${API_BASE_URL}/${kategori}/${provider}/stream/${id}/${chapterIndex}`;
  }

  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data: StreamResponse = await response.json();
    if (!data.success) return null;

    return data.data;
  } catch {
    return null;
  }
}
