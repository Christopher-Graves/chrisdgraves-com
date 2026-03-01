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
