# STOCKRADAR KNOWLEDGE BASE

**Generated:** 2026-01-26
**Commit:** 7953763
**Branch:** feat/ihsg-mini-chart

## OVERVIEW

Indonesian stock market (IDX) analysis platform. Next.js 16 + Bun + Supabase + Datasaham API. Freemium model with public stock data and protected watchlists.

## STRUCTURE

```
stockradar/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (market overview, trending)
│   ├── stocks/             # Stock list + [symbol] detail
│   └── api/chart/          # Chart data proxy endpoint
├── components/
│   ├── ui/                 # ShadCN/UI (auto-generated)
│   ├── stocks/             # StockCard, PriceBadge, FilterTabs
│   ├── charts/             # CandlestickChart, TimeframeSelector
│   ├── layout/             # Header, Footer, ThemeToggle
│   └── home/               # TrendingCarousel, IHSGMiniChart
├── lib/
│   ├── api/                # Datasaham client, Yahoo fallback, types
│   ├── db/                 # Drizzle schema (users, watchlists, api_cache)
│   └── supabase/           # Browser + server clients
├── drizzle/                # DB migrations
└── docs/plans/             # PRD.md, DESIGN.md
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new page | `app/` | Use App Router conventions |
| Add ShadCN component | `bunx shadcn@latest add <component>` | Auto-installs to `components/ui/` |
| Stock-related component | `components/stocks/` | Follow existing patterns |
| API data fetching | `lib/api/datasaham.ts` | Uses DB caching, see `lib/api/AGENTS.md` |
| Database schema | `lib/db/schema.ts` | Drizzle ORM |
| Styling tokens | `app/globals.css`, `tailwind.config.ts` | Semantic colors defined |
| Chart implementation | `components/charts/candlestick-chart.tsx` | Lightweight Charts v5 |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `getTrending` | function | lib/api/datasaham.ts | Fetch trending stocks |
| `getChartData` | function | lib/api/datasaham.ts | OHLCV with Yahoo fallback |
| `getCachedOrFetch` | function | lib/api/datasaham.ts | DB cache layer |
| `CandlestickChart` | component | components/charts | TradingView-style chart |
| `PriceBadge` | component | components/stocks | Semantic +/- badge |
| `GlassCard` | component | components/ui | Frosted glass effect |
| `users`, `watchlists`, `apiCache` | table | lib/db/schema.ts | Core DB tables |

## CONVENTIONS

### Styling
- **Semantic colors**: `text-positive` / `text-negative` for gain/loss (NOT raw green/red)
- **Financial numbers**: `font-mono font-tabular` for price alignment
- **Glass cards**: Use `GlassCard` for elevated surfaces
- **Dark mode**: CSS vars switch via `.dark` class

### TypeScript
- Path alias: `@/*` maps to root
- Strict mode enabled
- Types in `lib/api/types.ts`

### Data Fetching
- Server components fetch via `lib/api/datasaham.ts`
- API routes in `app/api/` for client-side fetches
- Cache stored in Supabase `api_cache` table

### Chart Colors
- Candlestick up: `#10b981` (emerald)
- Candlestick down: `#f43f5e` (rose)
- Volume uses same colors at 50% opacity

## ANTI-PATTERNS

- **Never** use raw hex colors for gain/loss; use semantic tokens
- **Never** hardcode API keys; use env vars
- **Never** skip cache layer for Datasaham calls
- **Never** use `as any` to suppress type errors
- **Avoid** client components unless interactivity required

## UNIQUE STYLES

### ShadCN Config
- Style: `radix-maia`
- Icons: `lucide`
- RSC: enabled

### Tailwind Customizations
- `text-display-1`, `text-heading-1..3`: Custom typography scale
- `positive`, `negative`, `neutral`: Financial semantic colors
- `animate-shimmer`: Skeleton loading effect

### Geist Fonts
- `font-sans`: Geist Sans (via `--font-geist-sans`)
- `font-mono`: Geist Mono (via `--font-geist-mono`)

## COMMANDS

```bash
# Development
bun dev                    # Start dev server (Turbopack)
bun build                  # Production build
bun lint                   # ESLint

# Database
bun db:generate            # Generate Drizzle migrations
bun db:push                # Push schema to Supabase
bun db:studio              # Open Drizzle Studio

# Components
bunx shadcn@latest add <name>   # Add ShadCN component
```

## NOTES

- **WIB Timezone**: Chart timeframe calculations use UTC+7 for IDX market hours
- **Yahoo Finance**: Primary chart source (more reliable), Datasaham as fallback
- **Phase Status**: Phase 1-2 complete (public pages), Phase 3-4 pending (auth, watchlist)
- **No tests yet**: Test infrastructure not configured
- **IHSG data**: Currently mock (API not available), mini-chart uses CSS vars
