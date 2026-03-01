/**
 * Convert all API routes to edge-compatible proxies
 */
const fs = require('fs');
const path = require('path');

const appApiDir = path.join(__dirname, '..', 'app', 'api');

function getRouteTemplate(apiPath) {
  return `export const runtime = 'edge';

import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: Request) {
  return proxyToBackend(request, '${apiPath}');
}

export async function POST(request: Request) {
  return proxyToBackend(request, '${apiPath}');
}

export async function PUT(request: Request) {
  return proxyToBackend(request, '${apiPath}');
}

export async function DELETE(request: Request) {
  return proxyToBackend(request, '${apiPath}');
}

export async function PATCH(request: Request) {
  return proxyToBackend(request, '${apiPath}');
}
`;
}

function getRouteTemplateDynamic(apiPath) {
  // For routes with dynamic segments like [id] or [slug]
  return `export const runtime = 'edge';

import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '${apiPath}';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(\`[\${key}]\`, value);
  }
  return proxyToBackend(request, dynamicPath);
}

export async function POST(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '${apiPath}';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(\`[\${key}]\`, value);
  }
  return proxyToBackend(request, dynamicPath);
}

export async function PUT(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '${apiPath}';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(\`[\${key}]\`, value);
  }
  return proxyToBackend(request, dynamicPath);
}

export async function DELETE(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '${apiPath}';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(\`[\${key}]\`, value);
  }
  return proxyToBackend(request, dynamicPath);
}

export async function PATCH(request: Request, { params }: { params: Promise<Record<string, string>> }) {
  const resolved = await params;
  let dynamicPath = '${apiPath}';
  for (const [key, value] of Object.entries(resolved)) {
    dynamicPath = dynamicPath.replace(\`[\${key}]\`, value);
  }
  return proxyToBackend(request, dynamicPath);
}
`;
}

function findRoutes(dir, base = '') {
  const routes = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(base, item.name);

    if (item.isDirectory()) {
      routes.push(...findRoutes(fullPath, relativePath));
    } else if (item.name === 'route.ts') {
      routes.push({ filePath: fullPath, apiPath: '/api/' + base.replace(/\\/g, '/') });
    }
  }

  return routes;
}

function convertRoute(route) {
  const { filePath, apiPath } = route;
  const hasDynamicSegment = apiPath.includes('[');
  
  const template = hasDynamicSegment 
    ? getRouteTemplateDynamic(apiPath)
    : getRouteTemplate(apiPath);

  fs.writeFileSync(filePath, template, 'utf-8');
  console.log(`✓ Converted: ${apiPath}`);
}

// Main execution
const routes = findRoutes(appApiDir);
console.log(`Found ${routes.length} API routes to convert...\n`);

for (const route of routes) {
  convertRoute(route);
}

console.log(`\n✅ Converted ${routes.length} routes to edge-compatible proxies`);
console.log(`\nNext steps:`);
console.log(`1. Remove 'pg' from package.json dependencies`);
console.log(`2. Set NEXT_PUBLIC_API_URL env var on Cloudflare Pages`);
console.log(`3. Run: npm run build`);
console.log(`4. Push to GitHub`);
