# Deployment Configuration

## Cloudflare Pages Environment Variables

The following environment variables must be set in the Cloudflare Pages dashboard for the finance page to work correctly:

### Required Variables

```
NEXT_PUBLIC_FINANCE_API_URL=https://dashboard-api.chrisdgraves.com
NEXT_PUBLIC_API_URL=https://dashboard-api.chrisdgraves.com
DASHBOARD_API_KEY=SQqy50zOZp/gI9Bzcj47q0lVHiZ8It/S7UaYi69yvXQ/O3nyaXrz22AM7dtcfHsH
```

### Why These Are Needed

- `NEXT_PUBLIC_FINANCE_API_URL`: The frontend finance page calls this API to fetch financial data
- `NEXT_PUBLIC_API_URL`: General API base URL for other dashboard features
- `DASHBOARD_API_KEY`: Bearer token for authenticating with the tony-dashboard API

### Backend Architecture

1. **Frontend (chrisdgraves-com)**: Static site deployed to Cloudflare Pages
2. **API Backend (tony-dashboard)**: Next.js app running locally on localhost:3000
3. **Cloudflare Tunnel**: Exposes localhost:3000 as https://admin.chrisdgraves.com
4. **Database**: PostgreSQL at localhost:5432 (accessed by tony-dashboard only)

The frontend NEVER connects directly to PostgreSQL - it always proxies through the tony-dashboard API.

## Setting Environment Variables

1. Go to Cloudflare Pages dashboard
2. Select the chrisdgraves-com project
3. Go to Settings → Environment variables
4. Add the variables listed above for both Production and Preview environments
5. Redeploy the site for changes to take effect

## Verifying Deployment

After deployment, check:
- https://chrisdgraves.com/admin/finance should load without 502 errors
- Financial data should display correctly
- Budget progress bar should show current spending

If issues persist, check:
- Cloudflare tunnel is running (admin.chrisdgraves.com is accessible)
- tony-dashboard is running on localhost:3000
- Environment variables are set correctly in Cloudflare Pages
