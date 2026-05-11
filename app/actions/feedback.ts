'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) throw new Error('API_BASE_URL is not defined in environment variables');
const BACKEND_FEEDBACK_URL = `${API_BASE_URL}/feedback`;

export async function sendFeedback(data: {
  title: string;
  content: string;
  category: string;
  rating: number;
}) {
  const cookieStore = await cookies();
  const sidCookie = cookieStore.get("sid");

  if (!sidCookie) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch(BACKEND_FEEDBACK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `sid=${sidCookie.value}`
      },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("[Feedback Action] Backend Error:", response.status, result);
      return { success: false, message: result?.message || "Gagal mengirim feedback" };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("[Feedback Action] Error:", error);
    return { success: false, message: "Terjadi kesalahan koneksi" };
  }
}
