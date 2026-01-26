# StockRadar

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)

**Indonesian Stock Market (IDX) Analysis Platform**

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Architecture](#architecture) • [API Reference](#api-reference)

</div>

---

## Overview

StockRadar is a modern, full-stack web application for tracking and analyzing Indonesian stock market (IDX) data. Built with a **freemium model**, it provides retail investors with real-time stock data, interactive charts, and personal watchlists.

### Vision

Provide an easy-to-use platform for Indonesian retail investors with real-time data from Datasaham.io API and personal watchlist features.

---

## Features

### Public Features (No Login Required)

- **Stock List** - Browse all IDX stocks with search and filtering
  - Filter by: Trending, Top Gainers, Top Losers, Top Volume, Top Value
  - Real-time search with instant results
- **Stock Detail** - Comprehensive stock information
  - Live price updates with change percentage
  - Interactive candlestick charts (1D, 1W, 1M, 3M, 1Y timeframes)
  - Key statistics and valuation ratios (P/E, EPS, P/BV, ROE, ROA, etc.)
  - Company profile with management and shareholder data
  - Insider transaction history
- **Market Data** - IHSG composite index tracking

### Protected Features (Login Required)

- **Watchlist** - Personal stock watchlist with notes *(coming soon)*
- **User Settings** - Profile and preferences management *(coming soon)*

### Design Highlights

- **Luxury Financial Terminal** aesthetic with glass morphism effects
- **Dark/Light Mode** with system preference detection
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Accessible** - WCAG 2.1 AA compliant with screen reader support

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Runtime** | [Bun](https://bun.sh) | Latest |
| **Framework** | [Next.js](https://nextjs.org) (App Router) | 16 |
| **Language** | [TypeScript](https://www.typescriptlang.org) | 5.x |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | 3.x |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) | Latest |
| **Database** | [Supabase](https://supabase.com) (PostgreSQL) | Latest |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) | 0.45+ |
| **Authentication** | Supabase Auth | Latest |
| **Charts** | [Lightweight Charts](https://www.tradingview.com/lightweight-charts/) | 5.x |
| **Data Source** | Datasaham.io API + Yahoo Finance | - |

### Key Libraries

- `geist` - Premium typography (Geist Sans & Mono fonts)
- `lucide-react` - Beautiful icon set
- `next-themes` - Dark/light mode switching
- `embla-carousel-react` - Touch-friendly carousels
- `yahoo-finance2` - Fallback chart data source

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+) or Node.js 18+
- [Supabase](https://supabase.com) account (for database & auth)
- Datasaham.io API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stockradar.git
   cd stockradar
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```env
   # Datasaham API
   DATASAHAM_API_URL=https://api.datasaham.io
   DATASAHAM_API_KEY=your_api_key_here

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Database (Supabase Postgres direct connection)
   DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
   ```

4. **Set up the database**
   ```bash
   bun db:push
   ```

5. **Start the development server**
   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with Turbopack |
| `bun build` | Create production build |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |
| `bun db:generate` | Generate Drizzle migrations |
| `bun db:push` | Push schema to database |
| `bun db:studio` | Open Drizzle Studio |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      StockRadar                          │
├─────────────────────────────────────────────────────────┤
│   Next.js 16 App Router (Server + Client Components)    │
├──────────────────┬──────────────────────────────────────┤
│  Public Pages    │  Protected Pages (Login Required)    │
│  - Homepage      │  - Watchlist                         │
│  - Stock List    │  - Settings                          │
│  - Stock Detail  │  - (Future: Alerts, Screener)        │
└────────┬─────────┴────────────────┬─────────────────────┘
         │                          │
    ┌────▼────┐              ┌──────▼──────┐
    │ API     │              │  Supabase   │
    │ Cache   │              │  (User DB)  │
    │ Layer   │              │  + Auth     │
    └────┬────┘              └─────────────┘
         │
    ┌────▼────────────┐
    │ Datasaham.io    │◄──── Yahoo Finance
    │ API             │      (fallback)
    └─────────────────┘
```

### Data Flow

1. **Public data**: Client → Next.js API Route → Check Cache → Datasaham/Yahoo API
2. **User data**: Client → Next.js Server Action → Supabase

### Project Structure

```
stockradar/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── chart/[symbol]/       # Chart data endpoint
│   ├── stocks/                   # Stock pages
│   │   ├── page.tsx              # Stock list
│   │   └── [symbol]/page.tsx     # Stock detail
│   ├── layout.tsx                # Root layout + providers
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles + Tailwind
│
├── components/
│   ├── charts/                   # Chart components
│   │   ├── candlestick-chart.tsx # Lightweight Charts wrapper
│   │   └── timeframe-selector.tsx
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx
│   ├── providers/                # Context providers
│   │   └── theme-provider.tsx
│   ├── skeletons/                # Loading skeletons
│   ├── stocks/                   # Stock-related components
│   │   ├── stock-card.tsx
│   │   ├── stock-search.tsx
│   │   ├── filter-tabs.tsx
│   │   ├── price-badge.tsx
│   │   └── insider-table.tsx
│   └── ui/                       # shadcn/ui components
│
├── lib/
│   ├── api/                      # API clients
│   │   ├── datasaham.ts          # Datasaham API client
│   │   ├── yahoo-finance.ts      # Yahoo Finance fallback
│   │   ├── types.ts              # TypeScript interfaces
│   │   └── index.ts              # Unified exports
│   ├── db/                       # Database
│   │   ├── schema.ts             # Drizzle schema
│   │   └── index.ts              # DB connection
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   └── utils.ts                  # Utility functions
│
├── drizzle/                      # Database migrations
├── docs/                         # Documentation
│   └── plans/
│       ├── PRD.md                # Product requirements
│       └── DESIGN.md             # UI/UX specifications
│
├── drizzle.config.ts             # Drizzle configuration
├── tailwind.config.ts            # Tailwind configuration
├── next.config.ts                # Next.js configuration
└── package.json
```

---

## Database Schema

The application uses Drizzle ORM with Supabase PostgreSQL:

```typescript
// Users - Extended from Supabase Auth
users {
  id: uuid (PK, references auth.users)
  email: text
  displayName: text?
  createdAt: timestamp
  updatedAt: timestamp
}

// Watchlists - User stock watchlist
watchlists {
  id: uuid (PK)
  userId: uuid (FK → users.id)
  symbol: text (e.g., "BBCA")
  addedAt: timestamp
  notes: text?
  UNIQUE(userId, symbol)
}

// API Cache - Cache Datasaham API responses
api_cache {
  id: uuid (PK)
  endpoint: text (UNIQUE, e.g., "/api/chart/BBCA/1d")
  data: jsonb
  cachedAt: timestamp
  expiresAt: timestamp
}
```

### Caching Strategy

| Data Type | Cache Duration | Rationale |
|-----------|----------------|-----------|
| Stock list | 1 hour | Rarely changes |
| Stock detail | 15 minutes | Profile data stable |
| Chart (intraday) | 5 minutes | Near real-time |
| Chart (daily+) | 1 hour | Historical data stable |
| Trending stocks | 5 minutes | Changes frequently |
| Top movers | 5 minutes | Changes frequently |

---

## API Reference

### Internal API Routes

#### GET `/api/chart/[symbol]`

Fetch OHLCV chart data for a stock.

**Query Parameters:**
- `timeframe` - Chart interval: `15m`, `30m`, `1h`, `2h`, `3h`, `4h`, `daily`
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)

**Response:**
```json
{
  "symbol": "BBCA",
  "timeframe": "daily",
  "data": [
    {
      "timestamp": 1705622400000,
      "open": 9100,
      "high": 9300,
      "low": 9050,
      "close": 9250,
      "volume": 45200000
    }
  ]
}
```

### Data Source APIs

The application fetches data from:

1. **Datasaham.io API** (Primary)
   - Stock search, trending, movers
   - Company profiles and key stats
   - Insider transactions

2. **Yahoo Finance** (Fallback for charts)
   - OHLCV candlestick data
   - More reliable for Indonesian stocks

---

## Design System

StockRadar uses a **Luxury Financial Terminal** aesthetic:

### Color Palette

| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| Positive (Gains) | Emerald `hsl(158 64% 40%)` | Emerald `hsl(158 64% 52%)` |
| Negative (Losses) | Rose `hsl(350 89% 55%)` | Rose `hsl(350 89% 60%)` |
| Background | White `hsl(0 0% 100%)` | Near-black `hsl(0 0% 4%)` |
| Glass Effect | White/70% opacity | Dark/60% opacity |

### Typography

- **Sans**: Geist Sans (modern, premium)
- **Mono**: Geist Mono (financial numbers)
- **Tabular Numerals**: Enabled for price alignment

### Key Components

- **GlassCard** - Frosted glass effect with subtle borders
- **PriceBadge** - Color-coded price change indicator
- **CandlestickChart** - TradingView-style interactive charts

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Roadmap

### Phase 1: Core Features ✅
- [x] Project setup with Next.js 16, Tailwind, shadcn/ui
- [x] Stock list page with search and filters
- [x] Stock detail page with charts and stats
- [x] Datasaham API integration with caching
- [x] Dark/light mode support

### Phase 2: Authentication 🚧
- [ ] Supabase Auth (email + Google OAuth)
- [ ] Protected route middleware
- [ ] User profile management

### Phase 3: User Features 📋
- [ ] Personal watchlist with CRUD operations
- [ ] Add notes to watchlist items
- [ ] User settings page

### Phase 4: Advanced Features 🔮
- [ ] Price alerts (email/push notifications)
- [ ] Advanced stock screener
- [ ] Portfolio tracking
- [ ] Technical indicators on charts
- [ ] Premium subscription tier

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Datasaham.io](https://datasaham.io) for Indonesian stock market data
- [TradingView](https://www.tradingview.com/lightweight-charts/) for Lightweight Charts library
- [shadcn/ui](https://ui.shadcn.com) for beautiful, accessible UI components
- [Supabase](https://supabase.com) for database and authentication

---

<div align="center">

**Built with passion for Indonesian investors**

Made by [Your Name](https://github.com/yourusername)

</div>
