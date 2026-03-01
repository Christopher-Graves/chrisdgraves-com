# Amex-Focused Finance Dashboard

## Overview
Complete overhaul of the finance dashboard to focus on **Amex expense monitoring** instead of net worth tracking.

## What's Different
- **Statement-based view** (not rolling 30 days)
- **$2,500 budget** prominently displayed
- **Category breakdown** including "Cal" for kid expenses
- **Alerts** for unusual activity
- **No net worth calculations** (by design)

## Quick Start
See `../QUICK_START.md` in the root directory.

## Architecture
Full documentation in `../AMEX_DASHBOARD_ARCHITECTURE.md`.

## Deployment
Follow `../DEPLOYMENT_CHECKLIST.md` for step-by-step deployment.

## API Endpoints

### New Endpoints
- `GET /api/finance/amex-statement` — current Amex statement summary + transactions
- `GET /api/finance/amex-budget` — budget progress by category
- `GET /api/finance/alerts` — unusual transactions
- `POST /api/finance/alerts` — acknowledge/dismiss alerts

### Existing Endpoints (still available)
- `GET /api/finance/accounts` — all accounts
- `GET /api/finance/transactions` — paginated transactions
- `GET /api/finance/budgets` — legacy monthly budgets
- `GET /api/finance/spending` — spending by category

## Database Requirements
Requires PostgreSQL with updated schema. See `../amex_statement_schema.sql`.

Run setup script first:
```bash
python ../setup_amex_dashboard.py
```

## Environment Variables
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tony_brain
DB_USER=tony
DB_PASSWORD=<your_password>
NEXT_PUBLIC_FINANCE_API_URL=http://localhost:3001/api/finance
```

## Components

### Main Dashboard (`app/admin/finance/page.tsx`)
- Budget progress card
- Category breakdown
- Alerts section
- Current statement transactions

### API Routes (`app/api/finance/`)
- `amex-statement/route.ts` — statement data
- `amex-budget/route.ts` — budget tracking
- `alerts/route.ts` — unusual transaction detection

## Testing
1. Apply schema: `python setup_amex_dashboard.py`
2. Pull transactions: `python scripts/pull_transactions.py 30`
3. Start API: `npm run dev` in tony-dashboard
4. Start frontend: `npm run dev` in chrisdgraves-com
5. Visit: `http://localhost:3000/admin/finance`

## Deployment
```bash
npm run build
npm run start
```

---

**Version:** 1.0  
**Last Updated:** 2026-03-01
