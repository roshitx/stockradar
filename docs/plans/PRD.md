# StockRadar - Product Requirements Document (PRD)

> **Single Source of Truth** for StockRadar project implementation.
> Created: 2026-01-19

---

## 1. Project Overview

**StockRadar** adalah platform analisis saham Indonesia (IDX) untuk semua level investor dengan model freemium.

### Vision
Menyediakan platform yang mudah digunakan untuk investor retail Indonesia, dengan data real-time dari Datasaham.io API dan fitur watchlist personal.

### MVP Scope
- **Public**: Stock list, stock detail, OHLCV chart
- **Protected**: Watchlist, settings

### Business Model
- **Free tier**: Public data access (dengan cache)
- **Premium (future)**: Real-time data, advanced analytics, alerts

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Bun | Latest |
| Framework | Next.js (App Router) | 16 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | ShadCN/UI | Latest |
| Database | Supabase (PostgreSQL) | Latest |
| ORM | Drizzle ORM | Latest |
| Authentication | Supabase Auth | Latest |
| Charts | Lightweight Charts | 4.x |
| Data Source | Datasaham.io API | v1.0.0 |

### Design Decisions
- **Next.js 16**: Menggunakan versi terbaru dengan cache components
- **Bun**: Fast runtime, native TypeScript support
- **ShadCN/UI**: Accessible, customizable, Tailwind-based
- **Lightweight Charts**: Professional financial charts, TradingView-like
- **Dark/Light toggle**: User preference support

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     StockRadar                          │
├─────────────────────────────────────────────────────────┤
│  Next.js 16 App Router (Server + Client Components)    │
├──────────────────┬──────────────────────────────────────┤
│  Public Pages    │  Protected Pages (Login Required)    │
│  - Homepage      │  - Watchlist                         │
│  - Stock List    │  - Settings                          │
│  - Stock Detail  │  - (Future: Alerts, Screener)        │
│  - Chart         │                                      │
└────────┬─────────┴────────────────┬─────────────────────┘
         │                          │
    ┌────▼────┐              ┌──────▼──────┐
    │ API     │              │  Supabase   │
    │ Cache   │              │  (User DB)  │
    │ Layer   │              │  + Auth     │
    └────┬────┘              └─────────────┘
         │
    ┌────▼────────────┐
    │ Datasaham.io    │
    │ API             │
    └─────────────────┘
```

### Data Flow
1. **Public data**: Client → Next.js API Route → Check Cache → Datasaham API
2. **User data**: Client → Next.js Server Action → Supabase

---

## 4. Database Schema

```typescript
// lib/db/schema.ts - Drizzle ORM Schema

import { pgTable, uuid, text, timestamp, jsonb, unique } from 'drizzle-orm/pg-core'

// users - Extended from Supabase Auth
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // references auth.users
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// watchlists - User stock watchlist
export const watchlists = pgTable('watchlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  symbol: text('symbol').notNull(), // e.g., "BBCA"
  addedAt: timestamp('added_at').defaultNow().notNull(),
  notes: text('notes'),
}, (table) => ({
  uniqueUserSymbol: unique().on(table.userId, table.symbol),
}))

// api_cache - Cache Datasaham API responses
export const apiCache = pgTable('api_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  endpoint: text('endpoint').notNull().unique(), // e.g., "/api/chart/BBCA/1d"
  data: jsonb('data').notNull(),
  cachedAt: timestamp('cached_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
})
```

---

## 5. Project Structure

```
stockradar/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Homepage - market overview
│   │   ├── stocks/
│   │   │   ├── page.tsx             # Stock list dengan search/filter
│   │   │   └── [symbol]/
│   │   │       └── page.tsx         # Stock detail + chart
│   │   └── sectors/
│   │       └── page.tsx             # Sector overview
│   │
│   ├── (protected)/
│   │   ├── layout.tsx               # Auth check wrapper
│   │   ├── watchlist/
│   │   │   └── page.tsx             # User watchlist
│   │   └── settings/
│   │       └── page.tsx             # User settings
│   │
│   ├── auth/
│   │   ├── login/page.tsx           # Supabase Auth login
│   │   ├── register/page.tsx        # Register
│   │   └── callback/route.ts        # OAuth callback
│   │
│   ├── api/
│   │   └── stocks/
│   │       └── [symbol]/route.ts    # Proxy + cache to Datasaham
│   │
│   ├── layout.tsx                   # Root layout + ThemeProvider
│   └── globals.css                  # Tailwind imports
│
├── components/
│   ├── ui/                          # ShadCN components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── header.tsx               # Navbar + search + auth status
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx              # Quick navigation
│   │   └── theme-toggle.tsx         # Dark/light switch
│   │
│   ├── stocks/
│   │   ├── stock-card.tsx           # Card preview saham
│   │   ├── stock-table.tsx          # Table list saham
│   │   ├── stock-search.tsx         # Search + filter component
│   │   └── price-badge.tsx          # Badge harga + persentase
│   │
│   ├── charts/
│   │   ├── candlestick-chart.tsx    # Lightweight Charts wrapper
│   │   ├── volume-chart.tsx         # Volume bars
│   │   └── chart-timeframe.tsx      # Selector: 1D, 1W, 1M, etc
│   │
│   └── watchlist/
│       ├── watchlist-table.tsx      # User watchlist table
│       └── add-to-watchlist.tsx     # Button + modal
│
├── lib/
│   ├── api/
│   │   └── datasaham.ts             # Datasaham API client
│   │
│   ├── db/
│   │   ├── schema.ts                # Drizzle schema (above)
│   │   └── index.ts                 # DB connection
│   │
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   └── server.ts                # Server client
│   │
│   └── utils.ts                     # cn() helper, formatters
│
├── drizzle/
│   └── migrations/                  # Drizzle migration files
│
├── public/
│   └── ...
│
├── drizzle.config.ts                # Drizzle configuration
├── tailwind.config.ts               # Tailwind configuration
├── components.json                  # ShadCN configuration
├── next.config.ts                   # Next.js configuration
├── package.json
├── tsconfig.json
├── .env.local                       # Environment variables
└── .env.example                     # Template
```

---

## 6. Caching Strategy

### Cache Durations

| Data Type | Duration | Rationale |
|-----------|----------|-----------|
| Stock list | 1 hour | Rarely changes |
| Stock detail | 15 minutes | Profile data stable |
| Chart (intraday) | 5 minutes | Real-time-ish |
| Chart (daily+) | 1 hour | Historical data stable |
| Trending stocks | 5 minutes | Changes frequently |
| Movers | 5 minutes | Changes frequently |

### Cache Flow

```
Request → Check api_cache table
  ├── Cache hit + not expired → Return cached data
  └── Cache miss or expired →
      ├── Fetch from Datasaham API
      ├── Upsert to api_cache
      └── Return fresh data
```

### Implementation

```typescript
// lib/api/datasaham.ts

async function getCachedOrFetch<T>(
  endpoint: string,
  cacheDurationMinutes: number
): Promise<T> {
  // Check cache
  const cached = await db.query.apiCache.findFirst({
    where: eq(apiCache.endpoint, endpoint)
  })

  if (cached && new Date(cached.expiresAt) > new Date()) {
    return cached.data as T
  }

  // Fetch fresh data
  const data = await fetchFromDatasaham(endpoint)

  // Update cache
  await db.insert(apiCache)
    .values({
      endpoint,
      data,
      expiresAt: new Date(Date.now() + cacheDurationMinutes * 60 * 1000)
    })
    .onConflictDoUpdate({
      target: apiCache.endpoint,
      set: { data, cachedAt: new Date(), expiresAt: new Date(...) }
    })

  return data
}
```

---

## 7. Environment Variables

```env
# .env.example

# Datasaham API
DATASAHAM_API_KEY=your_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database (Supabase Postgres direct connection)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

---

## 8. Implementation Phases

### Phase 1: Project Setup
1. Initialize Next.js 16 with Bun: `bunx create-next-app@latest`
2. Install & configure Tailwind CSS
3. Setup ShadCN/UI: `bunx shadcn@latest init`
4. Configure Drizzle ORM + Supabase connection
5. Create `.env.example` template
6. Setup root layout with ThemeProvider (dark/light toggle)
7. Add basic header & footer components

**Verification**: `bun dev` runs without errors, dark/light toggle works

### Phase 2: Public Pages (Stock Data)
1. Create Datasaham API client with caching logic
2. Implement homepage with market overview (trending, movers)
3. Build stock list page with search/filter
4. Create stock detail page with company profile
5. Integrate Lightweight Charts for OHLCV data
6. Add timeframe selector (1D, 1W, 1M, 3M, 1Y)

**Verification**: Navigate to /stocks, see list, click stock, see chart

### Phase 3: Authentication
1. Configure Supabase Auth (email + Google OAuth)
2. Create login/register pages
3. Implement auth callback handler
4. Add protected route middleware
5. Create auth context provider
6. Add auth status to header

**Verification**: Register new user, login, access protected routes

### Phase 4: User Features
1. Create users table trigger (sync with auth.users)
2. Implement watchlist CRUD operations
3. Build watchlist page with table view
4. Add "Add to Watchlist" button on stock detail
5. Create user settings page (display name, preferences)

**Verification**: Add stock to watchlist, view watchlist, remove stock

### Phase 5: Polish & Deploy
1. Add loading states & skeleton components
2. Implement error boundaries
3. Add SEO meta tags (title, description, og:image)
4. Optimize images & bundle size
5. Setup Vercel project
6. Configure production environment variables
7. Deploy to production

**Verification**: Lighthouse score > 90, no console errors

---

## 9. Key Files to Create

| Priority | File | Purpose |
|----------|------|---------|
| 1 | `package.json` | Dependencies |
| 1 | `drizzle.config.ts` | Drizzle config |
| 1 | `lib/db/schema.ts` | Database schema |
| 1 | `lib/db/index.ts` | Database connection |
| 2 | `lib/api/datasaham.ts` | API client + caching |
| 2 | `lib/supabase/client.ts` | Supabase browser client |
| 2 | `lib/supabase/server.ts` | Supabase server client |
| 2 | `app/layout.tsx` | Root layout + providers |
| 3 | `components/layout/header.tsx` | Navigation bar |
| 3 | `components/layout/theme-toggle.tsx` | Dark/light switch |
| 3 | `components/charts/candlestick-chart.tsx` | Chart component |
| 3 | `app/(public)/stocks/page.tsx` | Stock list page |
| 3 | `app/(public)/stocks/[symbol]/page.tsx` | Stock detail page |
| 4 | `middleware.ts` | Auth protection |
| 4 | `app/(protected)/watchlist/page.tsx` | Watchlist page |

---

## 10. API Reference (Datasaham.io)

### Key Endpoints for MVP

| Endpoint | Description | Cache |
|----------|-------------|-------|
| `GET /api/main/search?q={query}` | Search stocks | 1 hour |
| `GET /api/main/trending` | Trending stocks | 5 min |
| `GET /api/movers/top-gainer` | Top gainers | 5 min |
| `GET /api/movers/top-loser` | Top losers | 5 min |
| `GET /api/chart/{symbol}/{timeframe}` | OHLCV data | 5 min (intraday) / 1 hour |
| `GET /api/emiten/{symbol}/profile` | Company profile | 1 hour |
| `GET /api/sectors` | Sector list | 1 hour |

### Authentication
```
x-api-key: {DATASAHAM_API_KEY}
```

---

## 11. UI/UX Guidelines

### Theme
- **Dark mode**: Primary, financial-style (green/red for gain/loss)
- **Light mode**: Clean, whitespace, professional
- Default to system preference, with manual toggle

### Color Palette
```css
/* Dark mode */
--background: 0 0% 7%;
--foreground: 0 0% 95%;
--positive: 142 71% 45%; /* Green - gains */
--negative: 0 84% 60%;   /* Red - losses */

/* Light mode */
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
--positive: 142 71% 35%;
--negative: 0 84% 50%;
```

### Typography
- **Font**: Inter (default Next.js font)
- **Monospace**: For numbers/prices (tabular numerals)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 12. Future Enhancements (Post-MVP)

- [ ] Price alerts (email/push notification)
- [ ] Advanced screener with filters
- [ ] Portfolio tracking
- [ ] Technical indicators on charts
- [ ] Bandarmology analysis
- [ ] Insider trading signals
- [ ] Sector rotation analysis
- [ ] Export data to CSV/Excel
- [ ] Premium subscription tier

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-19 | 1.0.0 | Initial PRD created |
