import { NextResponse } from 'next/server';

export async function GET() {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    return NextResponse.json({ error: 'API_BASE_URL not set' }, { status: 500 });
  }

  try {
    // Test API connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'test',
        password: 'test',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    return NextResponse.json({
      apiBaseUrl,
      status: response.status,
      ok: response.ok,
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      apiBaseUrl,
    }, { status: 500 });
  }
}
