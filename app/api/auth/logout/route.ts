export const runtime = 'edge';

export async function POST() {
  const response = Response.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    'admin_authenticated=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
  );
  return response;
}
