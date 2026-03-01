export const runtime = 'edge';

import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '/api/crons/[id]/run';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(`[${key}]`, value);
  }
  return proxyToBackend(request, dynamicPath);
}

export async function POST(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '/api/crons/[id]/run';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(`[${key}]`, value);
  }
  return proxyToBackend(request, dynamicPath);
}

export async function PUT(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '/api/crons/[id]/run';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(`[${key}]`, value);
  }
  return proxyToBackend(request, dynamicPath);
}

export async function DELETE(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '/api/crons/[id]/run';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(`[${key}]`, value);
  }
  return proxyToBackend(request, dynamicPath);
}

export async function PATCH(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '/api/crons/[id]/run';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(`[${key}]`, value);
  }
  return proxyToBackend(request, dynamicPath);
}
