export const runtime = 'edge';

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return Response.json({ success: false, error: 'ADMIN_PASSWORD not configured' }, { status: 500 });
  }

  if (password === adminPassword) {
    const response = Response.json({ success: true });
    response.headers.set(
      'Set-Cookie',
      `admin_authenticated=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
    );
    return response;
  }

  return Response.json({ success: false, error: 'Invalid password' }, { status: 401 });
}
