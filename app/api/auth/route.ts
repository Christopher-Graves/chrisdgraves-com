import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { password } = await request.json();
  
  // Try Cloudflare runtime context first, fall back to process.env
  let adminPassword: string | undefined;
  try {
    const { env } = getRequestContext();
    adminPassword = (env as any).ADMIN_PASSWORD;
  } catch {
    // Fallback to process.env for local development
    adminPassword = process.env.ADMIN_PASSWORD;
  }

  if (!adminPassword) {
    return Response.json({ success: false, error: 'ADMIN_PASSWORD not configured' }, { status: 500 });
  }

  if (password === adminPassword) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `admin_authenticated=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
      }
    });
  }

  return Response.json({ success: false, error: 'Invalid password' }, { status: 401 });
}
