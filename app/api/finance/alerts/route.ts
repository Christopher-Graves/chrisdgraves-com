export const runtime = 'edge';

import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: Request) {
  return proxyToBackend(request, '/api/finance/alerts');
}

export async function POST(request: Request) {
  return proxyToBackend(request, '/api/finance/alerts');
}
