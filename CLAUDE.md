# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StockRadar is an Indonesian stock market (IDX) analysis platform with a freemium model. It uses data from the Datasaham.io API and provides features like stock listings, OHLCV charts, and personal watchlists.

**Current Status**: Pre-implementation phase. PRD and Design docs exist but no code has been written yet.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x + ShadCN/UI
- **Database**: Supabase (PostgreSQL) via Drizzle ORM
- **Auth**: Supabase Auth
- **Charts**: Lightweight Charts 4.x
- **Data Source**: Datasaham.io API

## Commands

```bash
# Development
bun dev              # Start development server
bun build            # Production build
bun start            # Start production server

# Database
bun drizzle-kit generate   # Generate migrations
bun drizzle-kit push       # Push schema to database
bun drizzle-kit studio     # Open Drizzle Studio

# ShadCN
bunx shadcn@latest add <component>  # Add a component
```

## Architecture

```
app/
├── (public)/           # Public pages (homepage, stock list, stock detail)
├── (protected)/        # Auth-required pages (watchlist, settings)
├── auth/               # Login, register, OAuth callback
└── api/                # API routes (proxy + cache to Datasaham)

lib/
├── api/datasaham.ts    # Datasaham API client with caching
├── db/                 # Drizzle schema and connection
└── supabase/           # Supabase client (browser + server)

components/
├── ui/                 # ShadCN components
├── layout/             # Header, footer, sidebar, theme-toggle
├── stocks/             # Stock card, table, search, price badge
├── charts/             # Candlestick, volume, timeframe selector
└── watchlist/          # Watchlist table, add-to-watchlist
```

## Data Flow

1. **Public data**: Client → Next.js API Route → Check Cache → Datasaham API
2. **User data**: Client → Next.js Server Action → Supabase

## Caching Strategy

Cache is stored in Supabase `api_cache` table:
- Stock list: 1 hour
- Stock detail: 15 minutes
- Chart (intraday): 5 minutes
- Chart (daily+): 1 hour
- Trending/Movers: 5 minutes

## Environment Variables

Required in `.env.local`:
```
DATASAHAM_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

## Design System

Uses "Luxury Financial Terminal" aesthetic with:
- **Colors**: Emerald for gains, Rose for losses (semantic CSS variables)
- **Typography**: Geist Sans/Mono with tabular numerals for prices
- **Components**: Glass cards with frosted effect, responsive data tables
- **Theme**: Dark/Light mode via next-themes

## Key Implementation Notes

- Use `hsl(var(--positive))` / `hsl(var(--negative))` for gain/loss colors
- Financial numbers should use `font-mono font-tabular` classes
- All animations should respect `prefers-reduced-motion`
- Charts require accessible descriptions for screen readers

## Documentation

- `docs/plans/PRD.md` - Product requirements and implementation phases
- `docs/plans/DESIGN.md` - UI/UX specifications, components, layouts
- `datasaham-openapi.json` - Datasaham API specification
