# Bug Fix Report: Cloudflare Pages Build Failure

## Date
2026-03-01

## Issue
Cloudflare Pages build was failing due to incorrect import of `getRequestContext` from `@cloudflare/next-on-pages` in `lib/proxy.ts`.

## Root Cause Analysis

### Timeline of Changes
1. **Commit 40d2ce8** (Feb 28): Added API key authentication to dashboard proxy
   - Called `getRequestContext()` but did NOT import it
   - This would cause a ReferenceError at runtime: "getRequestContext is not defined"

2. **Commit e8675a7** (Mar 1, 12:52 PM): Attempted fix #1
   - Added top-level import: `import { getRequestContext } from '@cloudflare/next-on-pages'`
   - This BROKE the Cloudflare Pages build
   - **Why it failed:** The module `@cloudflare/next-on-pages` is only available in the Cloudflare Pages edge runtime, NOT during the Node.js build process

3. **Commit 0f062b2** (Mar 1, 12:58 PM): Reverted the broken import
   - Removed the import, but left the code calling `getRequestContext()`
   - Site still worked because old deployment was cached, but would fail on new builds

4. **Commit 6dfaf58** (Mar 1, 1:01 PM): **CORRECT FIX**
   - Used dynamic import: `const { getRequestContext } = await import('@cloudflare/next-on-pages')`
   - Dynamic imports happen at runtime, NOT during build
   - Build succeeds, runtime works correctly

## The Problem

### Static Import (BROKEN)
```typescript
// ❌ This breaks the build
import { getRequestContext } from '@cloudflare/next-on-pages';

export async function proxyToBackend(request: Request, apiPath: string) {
  const { env } = getRequestContext();
  // ...
}
```

**Why it fails:**
- During the Cloudflare Pages build, Next.js runs in a Node.js environment
- `@cloudflare/next-on-pages` is an edge-runtime-only module
- Static imports are evaluated at module load time (during build)
- Build fails: "Module not found" or similar error

### Dynamic Import (CORRECT)
```typescript
// ✅ This works
export async function proxyToBackend(request: Request, apiPath: string) {
  try {
    // Dynamic import happens at runtime, not during build
    const { getRequestContext } = await import('@cloudflare/next-on-pages');
    const { env } = getRequestContext();
    apiKey = (env as any).DASHBOARD_API_KEY;
  } catch {
    // Fallback for local development
    apiKey = process.env.DASHBOARD_API_KEY;
  }
}
```

**Why it works:**
- Dynamic imports (`await import()`) happen at runtime
- Build process doesn't try to resolve the module
- At runtime in Cloudflare Pages edge, the module is available
- Try/catch provides graceful fallback for local dev

## Verification

### Local Build Test
```bash
npm run build
```
✅ Result: Build succeeded with no errors

### Live Site Test
- URL: https://chrisdgraves.com/admin
- Status: ✅ Loading correctly
- Console: No errors (only informational autocomplete warnings)

## Key Learnings

1. **Edge runtime modules cannot be statically imported** in files that are processed during build
2. **Use dynamic imports** for edge-runtime-only dependencies
3. **Always verify builds succeed** before reporting fixes
4. **Test locally first** with `npm run build` before pushing to production

## Related Files
- `lib/proxy.ts` - The fixed file
- `app/api/auth/route.ts` - Example of static import (works because route is marked `runtime = 'edge'`)
- All `app/api/**/route.ts` - These files use the proxy utility

## Prevention
- When using Cloudflare Pages edge runtime features, prefer dynamic imports in shared utilities
- Mark API routes with `export const runtime = 'edge'` when they directly import edge modules
- Always run local builds before deploying
