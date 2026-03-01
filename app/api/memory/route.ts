export const runtime = 'edge';

import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: Request) {
  return proxyToBackend(request, '/api/memory');
}

export async function POST(request: Request) {
  return proxyToBackend(request, '/api/memory');
}

export async function PUT(request: Request) {
  return proxyToBackend(request, '/api/memory');
}

export async function DELETE(request: Request) {
  return proxyToBackend(request, '/api/memory');
}

export async function PATCH(request: Request) {
  return proxyToBackend(request, '/api/memory');
}
