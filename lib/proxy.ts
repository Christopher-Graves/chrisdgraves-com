/**
 * Edge-compatible proxy utility for forwarding requests to the backend API
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function proxyToBackend(request: Request, apiPath: string) {
  try {
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (!['host', 'connection'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // Add API key authentication for dashboard API
    // In Cloudflare Pages edge runtime, env vars are in getRequestContext().env
    // For local dev, use process.env
    let apiKey: string | undefined;
    try {
      // Dynamic import to avoid build-time errors
      const { getRequestContext } = await import('@cloudflare/next-on-pages');
      const { env } = getRequestContext();
      apiKey = (env as any).DASHBOARD_API_KEY;
    } catch {
      // Fallback for local development or non-edge environments
      apiKey = process.env.DASHBOARD_API_KEY;
    }

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
      console.warn('[SECURITY] DASHBOARD_API_KEY not found in environment');
    }

    const options: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        options.body = await request.text();
      } catch {
        // No body
      }
    }

    const response = await fetch(backendUrl, options);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error(`Proxy error for ${apiPath}:`, error);
    return new Response(
      JSON.stringify({ 
        error: 'Backend connection failed', 
        details: error instanceof Error ? error.message : String(error),
        backendUrl: BACKEND_URL 
      }),
      { 
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
