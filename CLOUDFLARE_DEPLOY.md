# Cloudflare Pages Deployment Guide

## Overview
This Next.js app has been converted to run on Cloudflare Pages with edge-compatible API routes. All API routes now proxy requests to a backend server running on Chris's gaming PC.

## Architecture
- **Frontend:** Static pages + client-side React components (hosted on Cloudflare Pages)
- **API Routes:** Edge-compatible proxies (running on Cloudflare's edge network)
- **Backend:** Real tony-dashboard with Postgres, filesystem access, etc. (running on gaming PC)

## Required Environment Variable

Set this in Cloudflare Pages dashboard:

```
NEXT_PUBLIC_API_URL=<backend-url>
```

### Backend URL Options

**Option 1: Local Network (for testing)**
```
NEXT_PUBLIC_API_URL=http://192.168.4.51:3000
```
❌ **Problem:** Cloudflare edge can't reach your local network

**Option 2: Cloudflare Tunnel (RECOMMENDED)**
```
NEXT_PUBLIC_API_URL=https://tony-dashboard.your-tunnel.com
```
✅ **Best solution:** Secure, fast, no open ports needed

**Option 3: ngrok/localtunnel (temporary testing)**
```
NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
```
⚠️ **Temporary:** URL changes each session

## Setting Up Cloudflare Tunnel

1. Install cloudflared on gaming PC:
   ```bash
   winget install Cloudflare.cloudflared
   ```

2. Authenticate:
   ```bash
   cloudflared tunnel login
   ```

3. Create tunnel:
   ```bash
   cloudflared tunnel create tony-dashboard
   ```

4. Configure tunnel (create `config.yml`):
   ```yaml
   tunnel: <tunnel-id>
   credentials-file: C:\Users\chris\.cloudflared\<tunnel-id>.json
   
   ingress:
     - hostname: tony-dashboard.chrisdgraves.com
       service: http://localhost:3000
     - service: http_status:404
   ```

5. Add DNS record in Cloudflare dashboard:
   - Type: CNAME
   - Name: tony-dashboard
   - Target: `<tunnel-id>.cfargotunnel.com`

6. Run tunnel as Windows service:
   ```bash
   cloudflared service install
   ```

7. Update Cloudflare Pages env var:
   ```
   NEXT_PUBLIC_API_URL=https://tony-dashboard.chrisdgraves.com
   ```

## How It Works

Each API route file (`app/api/**/route.ts`) now looks like this:

```typescript
export const runtime = 'edge';

import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: Request) {
  return proxyToBackend(request, '/api/tasks');
}
```

The `proxyToBackend` utility forwards the request to `NEXT_PUBLIC_API_URL` with all headers and body intact.

## Development

**Local development still works:**
```bash
npm run dev
```

The default `NEXT_PUBLIC_API_URL` is `http://localhost:3000`, so it will proxy to your local tony-dashboard backend.

## Deployment

Just push to GitHub — Cloudflare Pages auto-deploys from the main branch.

```bash
git add .
git commit -m "Convert to edge-compatible proxies for Cloudflare"
git push
```

## Troubleshooting

**502 Bad Gateway errors:**
- Check backend is running: `http://localhost:3000/api/tasks`
- Verify Cloudflare Tunnel is active
- Check `NEXT_PUBLIC_API_URL` env var is set correctly

**CORS errors:**
- Backend needs to allow requests from `chrisdgraves.com`
- Add CORS headers to tony-dashboard responses

**Auth issues:**
- Ensure session cookies are configured properly
- May need to share session state between frontend and backend
