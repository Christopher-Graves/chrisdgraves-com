# chrisdgraves.com

Personal website for Christopher Graves — Next.js app with admin dashboard.

## Features

- **Landing Page** — GQ Magazine-inspired design with hero, content pillars, social links, and about section
- **Admin Dashboard** — Password-protected admin area with Tony Dashboard components
- **Finance Tracker** — Frontend for Python/Plaid backend integration
- **Cloudflare Pages** — Static export for Cloudflare Pages deployment

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React

## Getting Started

### Install dependencies:
```bash
npm install
```

### Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production:
```bash
npm run build
```

### Build for Cloudflare Pages:
```bash
npm run pages:build
```

## Environment Variables

Create `.env.local`:

```env
ADMIN_PASSWORD=your-secure-password
```

## Admin Access

1. Navigate to `/admin`
2. Enter password (default: set via `ADMIN_PASSWORD` env var)
3. Access dashboard and finance tracker

## Deployment

### Cloudflare Pages

This app uses static export (`output: 'export'`) for Cloudflare Pages compatibility.

1. Build: `npm run build`
2. Deploy the `/out` directory to Cloudflare Pages
3. Set `ADMIN_PASSWORD` environment variable in Cloudflare

## Project Structure

```
chrisdgraves-com/
├── app/                # Next.js App Router
│   ├── admin/         # Admin dashboard
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Landing page
├── components/        # React components
│   ├── ui/           # UI primitives (from tony-dashboard)
│   ├── Sidebar.tsx   # Admin sidebar
│   └── SpotlightCard.tsx
├── lib/              # Utilities
└── middleware.ts     # Auth middleware
```

## Finance Tracker Integration

The finance tracker UI connects to a Python/Plaid backend located at:
`C:\Users\chris\.openclaw\workspace\finance-tracker`

Start the backend separately to sync real account data.

## Brand Style

- **Colors:** Deep Navy, Charcoal, Burnt Orange, Cream, Beige
- **Fonts:** Bebas Neue (display), Inter (body)
- **Vibe:** Warm, refined, cinematic, premium

---

Built with intention. © 2026 Christopher Graves
