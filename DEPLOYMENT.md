# Deployment Guide

## What Was Built

✅ **Landing Page (`/`)** - GQ Magazine-inspired design rebuilt in Next.js
- Hero section with name and tagline
- Social links (YouTube, Twitter, LinkedIn, GitHub, Email)
- 5 content pillars with SpotlightCard components
- About section ("The Journey")
- Framer Motion animations
- Brand colors: Deep Navy, Charcoal, Burnt Orange, Cream, Beige
- Fonts: Bebas Neue (display) + Inter (body)

✅ **Admin Dashboard (`/admin`)** - Password-protected admin area
- Dashboard overview with Cozmos status, YouTube progress, 2026 goals
- Quick notes section
- Tony Dashboard components integrated (Sidebar, Card, Badge, Button)

✅ **Finance Tracker (`/admin/finance`)** - Frontend UI for Python/Plaid backend
- Account overview (total balance, monthly income/expenses, savings rate)
- Connected accounts display
- Recent transactions list
- Note about Python backend integration

✅ **Authentication** - Middleware-based password protection
- Login page at `/admin/login`
- Cookie-based session (7 days)
- Logout functionality
- Env var: `ADMIN_PASSWORD`

✅ **Cloudflare Pages Compatible** - Static export configuration
- `output: 'export'` in next.config.ts
- Images unoptimized for static hosting

## Tech Stack

- **Framework:** Next.js 15.3.2 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4.19
- **Animation:** Framer Motion 12.34.3
- **UI Components:** Radix UI primitives (Dialog, Dropdown, Select, Slot, Tabs)
- **Icons:** Lucide React
- **Charts:** Recharts (for future finance visualizations)

## Deployment Instructions

### 1. Local Development

```bash
cd C:\Users\chris\.openclaw\workspace-engineering\chrisdgraves-com
npm install
npm run dev
```

Visit `http://localhost:3000`

### 2. Set Environment Variables

Create `.env.local`:
```env
ADMIN_PASSWORD=your-secure-password
```

### 3. Build for Production

```bash
npm run build
```

This creates a static export in the `/out` directory.

### 4. Deploy to Cloudflare Pages

#### Option A: GitHub Integration (Recommended)
1. Go to Cloudflare Dashboard → Pages
2. Connect to GitHub repository: `Christopher-Graves/chrisdgraves-com`
3. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variable: `ADMIN_PASSWORD=your-password`
4. Deploy

#### Option B: Direct Upload
1. Build locally: `npm run build`
2. Upload `/out` directory via Cloudflare Pages dashboard

### 5. Custom Domain

In Cloudflare Pages:
1. Go to Custom Domains
2. Add `chrisdgraves.com` and `www.chrisdgraves.com`
3. DNS records are auto-configured

## File Structure

```
chrisdgraves-com/
├── app/
│   ├── admin/
│   │   ├── finance/
│   │   │   └── page.tsx          # Finance tracker UI
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   └── page.tsx              # Admin dashboard
│   ├── api/
│   │   └── auth/
│   │       ├── route.ts          # Login API
│   │       └── logout/
│   │           └── route.ts      # Logout API
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Radix UI components (from tony-dashboard)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── Sidebar.tsx               # Admin sidebar navigation
│   └── SpotlightCard.tsx         # Interactive spotlight effect card
├── lib/
│   └── utils.ts                  # Tailwind merge utility
├── middleware.ts                 # Auth middleware (protects /admin)
├── next.config.ts                # Next.js config (static export)
├── tailwind.config.ts            # Tailwind config (brand colors)
└── package.json
```

## Authentication Flow

1. User visits `/admin/*` routes
2. Middleware checks for `admin_authenticated` cookie
3. If not authenticated → redirect to `/admin/login`
4. User enters password
5. POST to `/api/auth` → validates against `ADMIN_PASSWORD`
6. If valid → sets cookie, redirects to `/admin`
7. Logout → DELETE cookie via `/api/auth/logout`

## Finance Tracker Integration

The finance tracker UI (`/admin/finance`) is a frontend for the Python/Plaid backend located at:
```
C:\Users\chris\.openclaw\workspace\finance-tracker
```

To connect:
1. Start the Python backend separately
2. Update API endpoints in `/admin/finance/page.tsx` to point to backend
3. Currently shows mock data - replace with real API calls

## Brand Guidelines

### Colors
- **Deep Navy** (#1C2A3A) - Primary background
- **Charcoal** (#2B2B2B) - Cards, surfaces
- **Burnt Orange** (#D97642) - Accents, CTAs, highlights
- **Cream** (#F4F1E8) - Primary text, headings
- **Beige** (#D4C5A9) - Secondary text

### Typography
- **Bebas Neue** - Display font (headings, hero)
- **Inter** - Body font (paragraphs, UI)

### Design Philosophy
- Cinematic, premium feel
- Warm and refined aesthetic
- GQ Magazine-inspired layout
- Generous whitespace
- Subtle grain texture overlay
- Spotlight hover effects on cards

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. ⬜ Connect real finance tracker API
3. ⬜ Add social media links (YouTube, Twitter URLs)
4. ⬜ Add analytics (Cloudflare Web Analytics)
5. ⬜ Consider blog/content section for YouTube video embeds
6. ⬜ Add contact form (could use Cloudflare Workers for backend)

## GitHub Repository

**Repo:** `git@github-tony:Christopher-Graves/chrisdgraves-com.git`
**Branch:** `main`
**Last commit:** Initial Next.js rebuild

---

Built by Gilfoyle (Engineering) for Tony HQ
Deployed: 2026-02-28
