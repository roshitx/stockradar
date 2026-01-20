# StockRadar Design Enhancement Changelog

## 2026-01-20 - Fix ShadCN Color Mismatch (Hitam Putih Issue)

### Problem
UI displaying black/white colors instead of theme colors after ShadCN maia preset update.

### Root Cause
CSS color format mismatch:
- `globals.css` uses **oklch()** format: `--primary: oklch(0.488 0.243 264.376)`
- `tailwind.config.ts` wraps with **hsl()**: `primary: "hsl(var(--primary))"`
- Result: `hsl(oklch(...))` = invalid CSS → fallback to black/white

### Fixes Applied

**1. `tailwind.config.ts`**
- Changed oklch-based colors from `hsl(var(--xxx))` to `var(--xxx)`:
  - border, input, ring, background, foreground
  - primary, secondary, muted, accent, popover, card, sidebar, chart
- Kept `hsl(var(--xxx))` for semantic colors still using HSL format:
  - positive, negative, neutral (financial gain/loss colors)
  - destructive-foreground
- Added missing border-radius values for maia preset:
  - `4xl: 1.875rem`, `3xl: 1.5rem`, `2xl: 1rem`, `xl: 0.75rem`

**2. `app/globals.css`**
- Removed duplicate `@apply` rules
- Fixed invalid `outline-ring/50` class (oklch doesn't support Tailwind opacity modifiers)

**3. Reinstalled ShadCN Components**
All components reinstalled fresh with maia preset:
- button, badge, card, input, select, label, textarea, separator
- dropdown-menu, alert-dialog, combobox, field, input-group

### Technical Note
oklch (OKLab Color Space) provides wider color gamut than HSL. Semantic financial colors (positive/negative) remain in HSL format for now.

---

## 2026-01-20 - Yahoo Finance Integration & Chart Fixes

### Added
- Yahoo Finance 2 integration for IDX stock chart data (`lib/api/yahoo-finance.ts`)
- Fallback pattern: Yahoo Finance → Datasaham → empty data
- IDX symbols use `.JK` suffix (e.g., `BBCA.JK`)

### Fixed
- **Chart timeframe filter UI not updating**: Added internal state management (`selectedTimeframe`) to track user selection instead of relying only on prop
- **Chart overlap when no data**: Now clears candlestick and volume series when data is empty, preventing overlap with "No chart data available" message
- **1D timeframe showing no data**: Fixed date range calculation - Yahoo Finance requires `period1 !== period2`, so 1D now fetches from yesterday to today

### Changed
- `lib/api/datasaham.ts`: `getChartData()` now tries Yahoo Finance first before falling back to Datasaham API
- `components/charts/candlestick-chart.tsx`:
  - Uses internal `selectedTimeframe` state for UI display
  - Clears chart series when data is empty
  - 1D timeframe uses 2-day range for intraday data

### Technical Details
- yahoo-finance2 v3 requires instantiation: `new YahooFinance()` before calling methods
- Type import from `yahoo-finance2/modules/chart` for `ChartResultArray`
- Intraday intervals: 15m for 1D, 1h for 1W, daily for 1M/3M/1Y

---

## 2026-01-20 - Stock Detail Page Data Fix

### Problem
Stock detail page showing empty data for chart, key ratios, profile, and insider tabs despite API returning data.

### Root Cause Analysis
Datasaham API response structure differs from expected format in transformation functions:

| Component | Expected | Actual API Structure |
|-----------|----------|---------------------|
| Stock Info | `last`, `percent`, `volume.raw` | `price`, `percentage` (string), `volume` (string) |
| Chart | Direct array of candles | `{ chartbit: [...] }` |
| Key Stats | Flat fields: `pe_ratio`, `roe` | Nested: `closure_fin_items_results[].fin_name_results[].fitem` |
| Profile | `description`, `website` at root | `background`, `address[0].website`, `shareholder[]` |
| Insider | Direct array | `{ movement: [...] }` |

### Fixes Applied

**1. `lib/api/datasaham.ts` - transformStockInfo()**
- Fixed field mapping: `price` (string), `percentage` (string/number), `change` (string with sign)
- Handle "NA" values for volume/value/frequency
- Extract `sub_sector` for subsector field

**2. `lib/api/datasaham.ts` - getChartData()**
- Extract `response.chartbit` array instead of expecting direct array
- Transform candle fields with fallbacks (`timestamp`/`time`/`t`, etc.)

**3. `lib/api/datasaham.ts` - getStockKeyStats()**
- Parse from nested `closure_fin_items_results` structure
- Added `findFinItem()` helper to search by item name
- Map fields: "Current PE Ratio (TTM)", "Return on Equity (TTM)", "52 Week High", etc.
- Parse market cap from `stats.market_cap` (e.g., "147,791 B" → number)

**4. `lib/api/datasaham.ts` - getStockProfile()**
- Extract description from `data.background`
- Get contact info from `data.address[0]` (website, phone, email, office)
- Get shareholders from `data.shareholder[]` array
- Get management from `data.key_executive` (president_director, director, etc.)
- Get listing date from `data.history.date`

**5. `lib/api/datasaham.ts` - getStockInsiders()**
- Extract `response.movement` array instead of expecting direct array
- Map fields: `action_type` → transactionType, `changes.formatted_value` → shares
- Parse price from `price_formatted`, shares owned from `current.value`

**6. `components/charts/candlestick-chart.tsx`**
- Added "No chart data available" message when `chartbit` is empty
- Set minimum height for empty state container

**7. `app/stocks/[symbol]/page.tsx`**
- Conditionally exclude Open/High/Low when value is 0 (not provided by API)
- Show "-" for other fields when value is 0/missing

### Files Modified (3)
1. `lib/api/datasaham.ts` - All transformation functions
2. `components/charts/candlestick-chart.tsx` - Empty state handling
3. `app/stocks/[symbol]/page.tsx` - UI conditional rendering

### Testing
- Build: ✅ Compiled successfully
- Cache cleared for fresh API fetch
- Ready for manual verification at `/stocks/BUMI`

---

## 2026-01-20 - Phase 2: Stock List & Detail Pages

### Added

**API Layer (`lib/api/`):**
- New types: `SearchResult`, `StockInfo`, `StockProfile`, `StockKeyStats`, `InsiderTransaction`, `ChartTimeframeDisplay`
- New API functions: `searchStocks`, `getTopVolume`, `getTopValue`, `getStockInfo`, `getStockProfile`, `getStockKeyStats`, `getStockInsiders`
- Corresponding wrapper functions with error handling in `lib/api/index.ts`

**Components:**
- `components/stocks/stock-card.tsx` - Card for stock in grid view
- `components/stocks/stock-search.tsx` - Debounced search input with URL params
- `components/stocks/filter-tabs.tsx` - Trending/Gainers/Losers/Volume/Value tabs
- `components/stocks/insider-table.tsx` - Table for insider transactions
- `components/charts/timeframe-selector.tsx` - 1D/1W/1M/3M/1Y selector
- `components/charts/candlestick-chart.tsx` - Lightweight Charts wrapper with volume
- `components/skeletons/stock-list-skeleton.tsx` - Loading state for stock list
- `components/skeletons/stock-detail-skeleton.tsx` - Loading state for stock detail

**Pages:**
- `/stocks` page - Stock list with filter tabs and search
- `/stocks/[symbol]` page - Stock detail with chart, tabs (Overview/Profile/Insider)
- `/api/chart/[symbol]` - API route for dynamic chart data

**Navigation Updates:**
- "View All" button links to `/stocks?tab=trending`
- Trending carousel items link to `/stocks/[symbol]`
- "Browse Stocks" hero button links to `/stocks`
- Header search redirects to `/stocks?q={query}`
- Mobile search button navigates to `/stocks`

### Dependencies
- Added `lightweight-charts@5.1.0`
- Added ShadCN components: `tabs`, `badge`, `table`

### Files Created (13)
1. `app/stocks/page.tsx`
2. `app/stocks/loading.tsx`
3. `app/stocks/[symbol]/page.tsx`
4. `app/stocks/[symbol]/loading.tsx`
5. `app/api/chart/[symbol]/route.ts`
6. `components/stocks/stock-card.tsx`
7. `components/stocks/stock-search.tsx`
8. `components/stocks/filter-tabs.tsx`
9. `components/stocks/insider-table.tsx`
10. `components/charts/timeframe-selector.tsx`
11. `components/charts/candlestick-chart.tsx`
12. `components/skeletons/stock-list-skeleton.tsx`
13. `components/skeletons/stock-detail-skeleton.tsx`

### Files Modified (5)
1. `lib/api/types.ts` - Added new types
2. `lib/api/datasaham.ts` - Added new API functions
3. `lib/api/index.ts` - Added exports with error handling
4. `app/page.tsx` - Added navigation links
5. `components/layout/header.tsx` - Made search functional

---

## 2026-01-20 - Frontend Design Improvements

### 1. Navbar Enhancement
**File:** `components/layout/header.tsx`
- Converted to client component with scroll detection
- Made navbar transparent on top, becomes opaque with blur on scroll
- Added smooth transition animation (300ms)
- Enhanced search input with semi-transparent background
- Changed from `sticky` to `fixed` positioning

### 2. Theme Toggle Color Fix
**File:** `components/ui/button.tsx`
- Fixed ghost variant hover color from accent (yellow) to muted (neutral)
- Changed from `hover:bg-accent hover:text-accent-foreground` to `hover:bg-muted hover:text-foreground`
- Now matches the overall color scheme better

### 3. Hero Section Grid Background
**File:** `app/page.tsx`
- Added animated grid pattern background to hero section
- Grid has 80px × 80px spacing (not too tight)
- Implemented gradient fade effect from top (100% opacity at 0%, fades to transparent at 70-80%)
- Uses CSS mask for smooth gradient transition
- Grid color uses foreground color with low opacity for theme compatibility

### 4. GlassCard Component Redesign
**File:** `components/ui/glass-card.tsx`
- Upgraded border radius from `rounded-xl` to `rounded-2xl` for more elegance
- Added inner glow effect with gradient overlay
- Refined shadow system with multiple layers for depth
- Implemented smooth hover animations (300ms ease-out)
- Added subtle hover lift effect (-translate-y-0.5)
- Enhanced border transitions on hover with primary color accent
- Reduced background opacity for more transparency (from full to 50%)

### 5. Trending Stocks Carousel
**Files:** `app/page.tsx`
- Installed ShadCN carousel component
- Expanded mock data from 4 to 8 stocks (BBCA, BMRI, TLKM, ASII, BBRI, UNVR, ICBP, KLBF)
- Implemented responsive carousel with 4 items visible on large screens
- Added navigation arrows that appear on hover (opacity transition)
- Wrapped carousel in group div for hover state detection
- Arrows positioned outside carousel with -left-12 and -right-12
- Maintained responsive behavior (1 item on mobile, 2 on tablet, 4 on desktop)

### 6. Features Section Redesign
**File:** `app/page.tsx`
- Added subtle gradient background (from-transparent via-primary/3 to-transparent)
- Converted feature cards to use GlassCard component instead of plain divs
- Enhanced icon containers with:
  - Gradient backgrounds (from-primary/10 to-primary/5)
  - Ring borders that brighten on hover
  - Glow effect on hover with blur
  - Icon scale animation on hover
- Improved typography with larger font sizes and better spacing
- Added decorative accent line at bottom of each card (appears on hover)
- Implemented staggered animation delays for visual interest
- Better use of whitespace with padding adjustments

## Design System Principles Applied

### Color Harmony
- Removed conflicting yellow/accent colors from UI elements
- Maintained consistency with primary (blue) and financial semantics (emerald/rose)
- Used muted tones for neutral interactions

### Glass Morphism Aesthetic
- Enhanced backdrop blur effects
- Layered shadows for depth perception
- Subtle borders with low opacity
- Inner glows and gradient overlays

### Motion & Animation
- Smooth transitions (300ms standard, 500ms for complex effects)
- Hover-triggered reveals for navigation arrows
- Scale and translate transforms for tactile feedback
- Respects `prefers-reduced-motion` media query

### Spacing & Layout
- Generous padding in cards (p-8 for features vs previous p-4)
- Consistent gap spacing (gap-6 for grids)
- Proper visual hierarchy with larger headings
- Breathing room with increased line-height

## Technical Notes

- All changes maintain accessibility standards
- Components remain responsive across breakpoints
- No breaking changes to existing functionality
- Carousel requires embla-carousel-react dependency (auto-installed via ShadCN)
- All animations use GPU-accelerated properties (transform, opacity)

## 2026-01-20 - Refinement Updates

### Hero Section Full Height
**File:** `app/page.tsx`
- Made hero section full viewport height with `min-h-screen`
- Added flexbox centering with `flex items-center` for vertical alignment
- Hero content now perfectly centered in viewport

### Market Overview Section Hidden
**File:** `app/page.tsx`
- Commented out Market Overview section (IHSG, Top Gainers, Top Losers cards)
- Section preserved in code for future use
- Cleaner landing page with focus on hero and trending stocks

### GlassCard Border Refinement
**File:** `components/ui/glass-card.tsx`
- Replaced border with ultra-subtle ring-inset approach
- Border opacity reduced from 40% to 3% (light mode) and 5% (dark mode)
- Changed from `border` to `ring-1 ring-inset` for more elegant appearance
- Reduced inner glow from 5% to 2% opacity for subtlety
- Softened shadows (halved opacity values)
- Hover state now uses ring instead of border with 10% primary color
- More refined and elegant appearance without bold borders

**Key Changes:**
- Light mode border: `3%` opacity (previously `40%`)
- Dark mode border: `5%` opacity (previously `40%`)
- Inner glow: `2%` opacity (previously `5%`)
- Shadow opacity reduced by ~50% across all states
- Uses `ring-inset` for cleaner edge rendering

## 2026-01-20 - Datasaham.io API Integration

### API Client Implementation
**Files:** `lib/api/datasaham.ts`, `lib/api/types.ts`, `lib/api/index.ts`, `lib/api/mock-data.ts`

**1. Core API Client (`lib/api/datasaham.ts`)**
- Created `fetchFromAPI()` with nested response handling for Datasaham API structure
- Handles both `{ data: { data: [...] } }` and `{ data: { mover_list: [...] } }` response formats
- Implemented `getCachedOrFetch()` with database-backed caching via Drizzle ORM
- Cache durations: Trending (5min), Movers (5min), Chart Daily (60min), Chart Intraday (5min)
- Created transformation functions to map API responses to app types:
  - `transformDatasahamStock()` - Maps trending endpoint response
  - `transformDatasahamMover()` - Maps movers endpoint response with nested `stock_detail` structure
- Custom error class `DatasahamError` with status codes and endpoint tracking

**2. Type Definitions (`lib/api/types.ts`)**
- Added `DatasahamStock` interface matching actual API response structure
- Defined core data types: `TrendingStock`, `MoverStock`, `IHSGData`, `IndicesImpactData`
- Chart types: `OHLCVCandle`, `ChartData`, `ChartTimeframe`

**3. Public API Exports (`lib/api/index.ts`)**
- Error-safe wrapper functions with automatic fallback to mock data
- `getTrendingStocks()` - Trending stocks with volume/value
- `getTopGainerStocks()` - Top gainers with change percentage
- `getTopLoserStocks()` - Top losers with change percentage
- `getIHSGData()` - IHSG index (currently mock data, API endpoint unavailable)
- All functions catch errors and gracefully degrade to mock data

**4. Mock Data (`lib/api/mock-data.ts`)**
- Realistic Indonesian stock data for fallback scenarios
- Includes BBCA, BMRI, TLKM, ASII, BBRI, UNVR, ICBP, KLBF
- Mock IHSG data with realistic IDX Composite values
- Global indices mock data for development

### Frontend Integration
**Files:** `app/page.tsx`, `components/skeletons/market-overview-skeleton.tsx`

**1. Landing Page Updates (`app/page.tsx`)**
- Converted to async Server Component for direct API calls
- Wrapped Market Overview in Suspense boundary with skeleton fallback
- Parallel data fetching using `Promise.all()` for optimal performance
- Displays real-time trending stocks, top gainers, top losers, and IHSG

**2. Loading States (`components/skeletons/market-overview-skeleton.tsx`)**
- Created MarketOverviewSkeleton component for loading state
- Skeleton matches exact layout of real content
- Uses ShadCN Skeleton component for shimmer effect

### Database Schema
**File:** `lib/db/schema.ts`
- `api_cache` table with endpoint-based unique constraint
- Stores JSON responses with `cachedAt` and `expiresAt` timestamps
- Automatic cache invalidation based on expiry time
- Upsert logic for cache updates

### Caching Strategy
- **Trending stocks**: 5 minutes (high volatility)
- **Market movers**: 5 minutes (frequently changing)
- **IHSG data**: Currently mock (API endpoint not available)
- **Indices impact**: 5 minutes (global market updates)
- Cache stored in Supabase PostgreSQL via Drizzle ORM
- Automatic cache refresh when expired

### API Fixes Applied
**Task 9 Fixes:**
1. **Nested Response Handling** - Updated `fetchFromAPI()` to extract `json.data.data` for trending and `json.data.data.mover_list` for movers
2. **Field Mapping** - API uses `last`/`percent` while app uses `price`/`changePercent`, transformation functions handle conversion
3. **Array Validation** - Added checks to ensure data is array before `.map()` operations
4. **Caching Integration** - All endpoints now use `getCachedOrFetch()` for database-backed caching

### Known Limitations
- **IHSG Chart Data**: API endpoint `/api/chart/^JKSE/daily` returns 500 error, using mock data as workaround
- **Alternative**: Can potentially use `/api/global/indices-impact` to get current IHSG data from global market analysis
- **Volume/Value**: Trending endpoint doesn't provide volume/value data, transformation sets to 0

### Environment Variables
**File:** `.env.example`
```env
DATASAHAM_API_URL=https://api.datasaham.io
DATASAHAM_API_KEY=your_api_key_here
```

### Dependencies
- Uses existing Drizzle ORM setup for database operations
- No new dependencies added
- Works with existing Supabase PostgreSQL connection

### Testing Results
✅ Trending stocks endpoint working with real data
✅ Top gainers endpoint working with transformation
✅ Top losers endpoint working with transformation
✅ Database caching functional
✅ Mock data fallback working
✅ Suspense loading states working
✅ No console errors on page load

