# StockRadar - UI/UX Design Document

> **Luxury Financial Terminal** aesthetic — Stockbit-inspired, elevated with modern polish.
> Created: 2026-01-19

---

## 1. Design Philosophy

### Vision
StockRadar delivers a **premium financial terminal experience** that feels sophisticated yet approachable. We combine the data-density of professional trading platforms with the refinement of modern SaaS design.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Clarity First** | Financial data must be instantly scannable. Numbers, trends, and status are immediately clear. |
| **Calm Confidence** | Avoid harsh colors and jarring transitions. The interface should feel stable and trustworthy. |
| **Layered Depth** | Use subtle shadows, blur, and elevation to create visual hierarchy without clutter. |
| **Purposeful Motion** | Animations guide attention and confirm actions—never decorative delay. |
| **Breathing Room** | Data-dense doesn't mean cramped. Generous spacing improves comprehension. |

### Design DNA

```
Stockbit Foundation → Glass Morphism Layer → Geist Typography → Emerald/Rose Palette
```

**Differentiators from Stockbit:**
1. **Typography**: Geist Sans + Geist Mono (modern, premium) vs Inter
2. **Colors**: Sophisticated emerald/rose tones vs harsh green/red
3. **Depth**: Layered glass effects with frosted backgrounds
4. **Motion**: Orchestrated page transitions with Framer Motion
5. **Spacing**: Generous negative space (8-point grid, looser)

---

## 2. Color System

### Design Tokens (CSS Custom Properties)

```css
/* globals.css */

@layer base {
  :root {
    /* === SEMANTIC COLORS === */

    /* Backgrounds */
    --background: 0 0% 100%;
    --background-subtle: 0 0% 98%;
    --background-muted: 0 0% 96%;

    /* Foregrounds */
    --foreground: 0 0% 3.9%;
    --foreground-muted: 0 0% 45%;
    --foreground-subtle: 0 0% 63%;

    /* Cards & Surfaces */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --card-border: 0 0% 89.8%;

    /* Glass Effect (Light) */
    --glass-background: 0 0% 100% / 0.7;
    --glass-border: 0 0% 100% / 0.2;
    --glass-blur: 12px;

    /* === FINANCIAL SEMANTICS === */

    /* Positive (Gains) - Emerald */
    --positive: 158 64% 40%;
    --positive-foreground: 158 64% 98%;
    --positive-muted: 158 45% 92%;
    --positive-subtle: 158 45% 96%;

    /* Negative (Losses) - Rose */
    --negative: 350 89% 55%;
    --negative-foreground: 350 89% 98%;
    --negative-muted: 350 70% 93%;
    --negative-subtle: 350 70% 96%;

    /* Neutral (No Change) */
    --neutral: 0 0% 63%;
    --neutral-foreground: 0 0% 98%;

    /* === INTERACTIVE === */

    /* Primary */
    --primary: 220 70% 50%;
    --primary-foreground: 0 0% 98%;
    --primary-hover: 220 70% 45%;

    /* Secondary */
    --secondary: 220 14% 96%;
    --secondary-foreground: 220 9% 46%;

    /* Accent */
    --accent: 38 92% 50%;
    --accent-foreground: 38 92% 10%;

    /* Destructive */
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;

    /* === COMPONENT TOKENS === */

    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 220 70% 50%;
    --radius: 0.75rem;

    /* Chart Colors */
    --chart-1: 158 64% 40%;  /* Emerald */
    --chart-2: 220 70% 50%;  /* Blue */
    --chart-3: 38 92% 50%;   /* Amber */
    --chart-4: 280 65% 60%;  /* Purple */
    --chart-5: 350 89% 55%;  /* Rose */
  }

  .dark {
    /* === SEMANTIC COLORS === */

    /* Backgrounds */
    --background: 0 0% 4%;
    --background-subtle: 0 0% 7%;
    --background-muted: 0 0% 10%;

    /* Foregrounds */
    --foreground: 0 0% 95%;
    --foreground-muted: 0 0% 64%;
    --foreground-subtle: 0 0% 45%;

    /* Cards & Surfaces */
    --card: 0 0% 7%;
    --card-foreground: 0 0% 95%;
    --card-border: 0 0% 15%;

    /* Glass Effect (Dark) */
    --glass-background: 0 0% 10% / 0.6;
    --glass-border: 0 0% 100% / 0.08;
    --glass-blur: 16px;

    /* === FINANCIAL SEMANTICS === */

    /* Positive (Gains) - Emerald */
    --positive: 158 64% 52%;
    --positive-foreground: 158 64% 10%;
    --positive-muted: 158 35% 15%;
    --positive-subtle: 158 35% 10%;

    /* Negative (Losses) - Rose */
    --negative: 350 89% 60%;
    --negative-foreground: 350 89% 10%;
    --negative-muted: 350 50% 15%;
    --negative-subtle: 350 50% 10%;

    /* Neutral */
    --neutral: 0 0% 50%;
    --neutral-foreground: 0 0% 10%;

    /* === INTERACTIVE === */

    --primary: 220 70% 55%;
    --primary-foreground: 0 0% 98%;
    --primary-hover: 220 70% 60%;

    --secondary: 220 10% 15%;
    --secondary-foreground: 220 10% 70%;

    --accent: 38 92% 55%;
    --accent-foreground: 38 92% 10%;

    --destructive: 0 62% 50%;
    --destructive-foreground: 0 0% 98%;

    /* === COMPONENT TOKENS === */

    --border: 0 0% 15%;
    --input: 0 0% 15%;
    --ring: 220 70% 55%;
  }
}
```

### Color Usage Guidelines

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Price Up | `hsl(var(--positive))` | `hsl(var(--positive))` |
| Price Down | `hsl(var(--negative))` | `hsl(var(--negative))` |
| No Change | `hsl(var(--neutral))` | `hsl(var(--neutral))` |
| Card Background | `hsl(var(--card))` | `hsl(var(--card))` |
| Glass Card | `hsl(var(--glass-background))` | `hsl(var(--glass-background))` |
| Body Text | `hsl(var(--foreground))` | `hsl(var(--foreground))` |
| Secondary Text | `hsl(var(--foreground-muted))` | `hsl(var(--foreground-muted))` |

### Tailwind Utility Classes

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        positive: {
          DEFAULT: "hsl(var(--positive))",
          foreground: "hsl(var(--positive-foreground))",
          muted: "hsl(var(--positive-muted))",
          subtle: "hsl(var(--positive-subtle))",
        },
        negative: {
          DEFAULT: "hsl(var(--negative))",
          foreground: "hsl(var(--negative-foreground))",
          muted: "hsl(var(--negative-muted))",
          subtle: "hsl(var(--negative-subtle))",
        },
        neutral: {
          DEFAULT: "hsl(var(--neutral))",
          foreground: "hsl(var(--neutral-foreground))",
        },
      },
    },
  },
}
```

---

## 3. Typography Scale

### Font Stack

```css
/* Geist Font Family */
--font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
```

### Type Scale (8-point rhythm)

| Token | Size | Line Height | Weight | Use Case |
|-------|------|-------------|--------|----------|
| `display-1` | 48px / 3rem | 1.1 | 600 | Hero headlines |
| `display-2` | 36px / 2.25rem | 1.15 | 600 | Page titles |
| `heading-1` | 30px / 1.875rem | 1.2 | 600 | Section headers |
| `heading-2` | 24px / 1.5rem | 1.25 | 600 | Card titles |
| `heading-3` | 20px / 1.25rem | 1.3 | 600 | Subsection headers |
| `body-lg` | 18px / 1.125rem | 1.5 | 400 | Lead paragraphs |
| `body` | 16px / 1rem | 1.5 | 400 | Body text |
| `body-sm` | 14px / 0.875rem | 1.5 | 400 | Secondary text |
| `caption` | 12px / 0.75rem | 1.4 | 400 | Labels, metadata |
| `overline` | 11px / 0.6875rem | 1.4 | 600 | All-caps labels |

### Financial Number Typography

```css
/* Use tabular numerals for alignment in tables/lists */
.font-tabular {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}

/* Price display - large, monospace */
.price-display {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

/* Percentage badge */
.percentage {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
```

### Tailwind Typography Classes

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      fontSize: {
        'display-1': ['3rem', { lineHeight: '1.1', fontWeight: '600' }],
        'display-2': ['2.25rem', { lineHeight: '1.15', fontWeight: '600' }],
        'heading-1': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-2': ['1.5rem', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-3': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
    },
  },
}
```

---

## 4. Component Specifications

### 4.1 Glass Card

The signature component of StockRadar—frosted glass effect with subtle borders.

```tsx
// components/ui/glass-card.tsx

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base glass effect
        "rounded-xl border",
        "bg-[hsl(var(--glass-background))]",
        "border-[hsl(var(--glass-border))]",
        "backdrop-blur-[var(--glass-blur)]",

        // Shadow for depth
        "shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        "dark:shadow-[0_8px_32px_rgba(0,0,0,0.32)]",

        // Optional hover effect
        hover && [
          "transition-all duration-200",
          "hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]",
          "dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.48)]",
          "hover:border-[hsl(var(--glass-border)/0.3)]",
        ],

        className
      )}
    >
      {children}
    </div>
  );
}
```

**Variants:**
- `default` - Standard glass card
- `elevated` - Increased shadow for floating elements
- `inset` - Subtle inner glow for input containers

### 4.2 Price Badge

Displays price changes with semantic coloring.

```tsx
// components/stocks/price-badge.tsx

interface PriceBadgeProps {
  value: number;        // Percentage change
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function PriceBadge({ value, size = 'md', showIcon = true }: PriceBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-mono font-medium",
        sizeClasses[size],
        isPositive && "bg-positive-subtle text-positive",
        isNegative && "bg-negative-subtle text-negative",
        !isPositive && !isNegative && "bg-muted text-muted-foreground",
      )}
    >
      {showIcon && (
        isPositive ? <TrendingUp className="w-3 h-3" /> :
        isNegative ? <TrendingDown className="w-3 h-3" /> :
        <Minus className="w-3 h-3" />
      )}
      <span className="font-tabular">
        {isPositive && '+'}
        {value.toFixed(2)}%
      </span>
    </span>
  );
}
```

### 4.3 Stock Card

Preview card for stock list pages.

```tsx
// components/stocks/stock-card.tsx

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export function StockCard({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume
}: StockCardProps) {
  return (
    <GlassCard hover className="p-4">
      <div className="flex items-start justify-between">
        {/* Left: Symbol & Name */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-heading-3 font-semibold">{symbol}</span>
            <PriceBadge value={changePercent} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {name}
          </p>
        </div>

        {/* Right: Price */}
        <div className="text-right">
          <p className="price-display">
            {formatCurrency(price, 'IDR')}
          </p>
          <p className={cn(
            "text-sm font-mono",
            change >= 0 ? "text-positive" : "text-negative"
          )}>
            {change >= 0 ? '+' : ''}{formatCurrency(change, 'IDR')}
          </p>
        </div>
      </div>

      {/* Optional: Volume */}
      {volume && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex justify-between text-caption text-muted-foreground">
            <span>Volume</span>
            <span className="font-mono">{formatNumber(volume)}</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
```

### 4.4 Button Variants

```tsx
// Extended ShadCN button variants

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        glass: "bg-[hsl(var(--glass-background))] backdrop-blur-sm border border-[hsl(var(--glass-border))] hover:bg-accent/10",
        positive: "bg-positive text-positive-foreground hover:bg-positive/90",
        negative: "bg-negative text-negative-foreground hover:bg-negative/90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 4.5 Data Table

Financial data table with alternating rows and hover states.

```tsx
// components/ui/data-table.tsx

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((column, i) => (
              <TableHead
                key={i}
                className="text-overline uppercase tracking-wider text-muted-foreground"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={i}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "transition-colors cursor-pointer",
                "hover:bg-accent/5",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((column, j) => (
                <TableCell key={j} className="font-tabular">
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### 4.6 Chart Container

Wrapper for Lightweight Charts with consistent styling.

```tsx
// components/charts/chart-container.tsx

interface ChartContainerProps {
  children: React.ReactNode;
  title?: string;
  timeframes?: string[];
  activeTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
}

export function ChartContainer({
  children,
  title,
  timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'],
  activeTimeframe = '1D',
  onTimeframeChange,
}: ChartContainerProps) {
  return (
    <GlassCard className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-heading-3">{title}</h3>}

        {/* Timeframe Selector */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange?.(tf)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTimeframe === tf
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[400px] w-full">
        {children}
      </div>
    </GlassCard>
  );
}
```

---

## 5. Page Layouts

### 5.1 Global Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header (64px)                           │
│  ┌─────┐  ┌──────────────────────────┐  ┌─────────────────────┐│
│  │Logo │  │       Search Bar          │  │ Theme │ Auth │ Menu ││
│  └─────┘  └──────────────────────────┘  └─────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        Main Content                             │
│                                                                 │
│   Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8            │
│                                                                 │
│                                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                         Footer (80px)                           │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Homepage Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          Header                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Hero Section                            │  │
│  │  "Track Indonesian Stocks with Confidence"                 │  │
│  │  [Search stocks...]                    [Get Started]       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌───────────┐  │
│  │   Market Overview   │ │    Top Gainers      │ │Top Losers │  │
│  │   IHSG: 7,234.56    │ │    BBCA +5.23%      │ │GOTO -3.2% │  │
│  │   ▲ +0.45%          │ │    BMRI +4.12%      │ │BUKA -2.8% │  │
│  └─────────────────────┘ └─────────────────────┘ └───────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Trending Stocks                          │  │
│  │  [BBCA] [BMRI] [TLKM] [ASII] [UNVR] [BBRI]               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Sector Performance                      │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │  │
│  │  │Finance │ │Mining  │ │Consumer│ │Property│ │Infra   │   │  │
│  │  │+1.23%  │ │-0.45%  │ │+0.89%  │ │+0.12%  │ │-0.33%  │   │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          Footer                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Stock List Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          Header                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Stocks    [Search...]    [Filter ▼]    [Sort ▼]          │  │
│  │            Showing 50 of 850 stocks                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Symbol   │   Name            │   Price    │  Change      │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  BBCA     │   Bank Central    │  9,250     │  +2.34%  ▲   │  │
│  │  BMRI     │   Bank Mandiri    │  6,450     │  +1.89%  ▲   │  │
│  │  TLKM     │   Telkom          │  3,820     │  -0.52%  ▼   │  │
│  │  ASII     │   Astra Intl      │  5,775     │  +0.87%  ▲   │  │
│  │  UNVR     │   Unilever        │  4,320     │  -1.14%  ▼   │  │
│  │  ...      │   ...             │  ...       │  ...         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         [< Prev]    1  2  3  ...  17    [Next >]          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          Footer                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Stock Detail Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          Header                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ← Back to Stocks                                          │  │
│  │                                                            │  │
│  │  ┌──────┐  BBCA                              [★ Watchlist] │  │
│  │  │ Logo │  Bank Central Asia Tbk                           │  │
│  │  └──────┘  IDX • Finance • Blue Chip                       │  │
│  │                                                            │  │
│  │  Rp 9,250          +225 (+2.50%)  ▲                        │  │
│  │  Last updated: 15:45 WIB                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [1D] [1W] [1M] [3M] [1Y] [ALL]                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                                                      │  │  │
│  │  │              📈 Candlestick Chart                    │  │  │
│  │  │                   (400px height)                     │  │  │
│  │  │                                                      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              📊 Volume Chart (100px)                 │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │     Key Statistics      │  │     Company Profile         │  │
│  │  Open:      9,100       │  │  Sector: Finance            │  │
│  │  High:      9,300       │  │  Industry: Banking          │  │
│  │  Low:       9,050       │  │  Market Cap: 1,150T         │  │
│  │  Volume:    45.2M       │  │  P/E Ratio: 18.5            │  │
│  │  Prev Close: 9,025      │  │  EPS: 500.00                │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          Footer                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 Watchlist Layout (Protected)

```
┌─────────────────────────────────────────────────────────────────┐
│                          Header                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  My Watchlist                                  [+ Add]    │  │
│  │  Track your favorite stocks                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ BBCA  Bank Central Asia     9,250  +2.50%  ▲   [×]  │  │  │
│  │  ├─────────────────────────────────────────────────────┤  │  │
│  │  │ Mini sparkline chart                                 │  │  │
│  │  │ Notes: "Target 10,000"                              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ TLKM  Telkom Indonesia      3,820  -0.52%  ▼   [×]  │  │  │
│  │  ├─────────────────────────────────────────────────────┤  │  │
│  │  │ Mini sparkline chart                                 │  │  │
│  │  │ Notes: "Long term hold"                             │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💡 Tip: Click on a stock to view detailed analysis      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          Footer                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Animation Guidelines

### Framer Motion Configuration

```typescript
// lib/motion.ts

export const motionConfig = {
  // Reduced motion support
  reducedMotion: "user" as const,
};

// Standard easing curves
export const easing = {
  smooth: [0.4, 0, 0.2, 1],        // Material standard
  decelerate: [0, 0, 0.2, 1],      // Enter transitions
  accelerate: [0.4, 0, 1, 1],      // Exit transitions
  spring: { type: "spring", stiffness: 300, damping: 30 },
};

// Duration tokens
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
};
```

### Animation Patterns

#### 1. Page Transitions

```tsx
// components/layout/page-transition.tsx

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easing.decelerate,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: easing.accelerate,
    },
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

#### 2. Staggered List Animation

```tsx
// For stock lists, watchlist items, etc.

const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: easing.decelerate,
    },
  },
};
```

#### 3. Number Counter Animation

```tsx
// For price updates, percentage changes

import { useSpring, animated } from '@react-spring/web';

function AnimatedNumber({ value }: { value: number }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 100,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return <animated.span>{number.to((n) => n.toFixed(2))}</animated.span>;
}
```

#### 4. Hover Micro-interactions

```tsx
// Card hover effect
const cardHover = {
  scale: 1.01,
  transition: { duration: 0.2, ease: easing.smooth },
};

// Button press effect
const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// Icon spin (loading)
const iconSpin = {
  rotate: 360,
  transition: { duration: 1, repeat: Infinity, ease: "linear" },
};
```

#### 5. Chart Reveal Animation

```tsx
// Animate chart drawing on load
const chartReveal: Variants = {
  initial: {
    clipPath: "inset(0 100% 0 0)",
  },
  animate: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.8,
      ease: easing.decelerate,
    },
  },
};
```

### Animation DOs and DON'Ts

| DO ✓ | DON'T ✗ |
|------|---------|
| Use `will-change` for animated elements | Animate layout properties (width, height) |
| Respect `prefers-reduced-motion` | Add delay without purpose |
| Keep durations under 500ms | Use bounce/elastic for data-heavy UIs |
| Animate opacity + transform only | Animate colors during scrolling |
| Use `layout` prop for layout shifts | Block user interaction during animations |

---

## 7. Responsive Design

### Breakpoint System

```typescript
// tailwind.config.ts
{
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Tablet landscape / small laptop
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large desktop
    },
  },
}
```

### Container Widths

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;    /* 16px */
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { padding-left: 1.5rem; padding-right: 1.5rem; }  /* 24px */
}

@media (min-width: 1024px) {
  .container { padding-left: 2rem; padding-right: 2rem; }  /* 32px */
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

### Responsive Patterns

#### Navigation

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<768px) | Hamburger menu, collapsible search |
| Tablet (768-1024px) | Full nav, inline search |
| Desktop (>1024px) | Full nav, prominent search bar |

#### Stock Table

| Breakpoint | Visible Columns |
|------------|-----------------|
| Mobile | Symbol, Price, Change |
| Tablet | + Name, Volume |
| Desktop | + High, Low, Market Cap |

#### Charts

| Breakpoint | Height | Features |
|------------|--------|----------|
| Mobile | 280px | Touch zoom, swipe timeframes |
| Tablet | 360px | Standard controls |
| Desktop | 400px+ | Full tooltip, crosshair |

### Mobile-First Component Example

```tsx
// Responsive stock card
<div className={cn(
  // Mobile: Full width, stacked layout
  "w-full p-3",

  // Tablet: Side-by-side layout
  "md:flex md:items-center md:justify-between md:p-4",

  // Desktop: Larger padding, hover effects
  "lg:p-5 lg:hover:shadow-lg lg:transition-shadow",
)}>
  <div className="mb-2 md:mb-0">
    <span className="text-lg font-semibold md:text-xl">{symbol}</span>
  </div>
  <div className="flex items-center justify-between md:gap-8">
    <span className="font-mono">{price}</span>
    <PriceBadge value={changePercent} size="sm" />
  </div>
</div>
```

---

## 8. Accessibility (WCAG 2.1 AA)

### Color Contrast Requirements

| Element | Minimum Ratio | StockRadar Implementation |
|---------|---------------|---------------------------|
| Normal text | 4.5:1 | `--foreground` on `--background`: 16:1 |
| Large text (18px+ bold) | 3:1 | All headings pass |
| UI components | 3:1 | Borders and icons pass |
| Positive/Negative | 4.5:1 | Emerald/Rose adjusted for contrast |

### Focus Indicators

```css
/* Custom focus ring - visible on all interactive elements */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: var(--radius);
}

/* High contrast focus for Windows High Contrast Mode */
@media (forced-colors: active) {
  *:focus-visible {
    outline: 3px solid CanvasText;
  }
}
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus forward |
| `Shift + Tab` | Move focus backward |
| `Enter` / `Space` | Activate focused element |
| `Escape` | Close modals/dropdowns |
| `Arrow keys` | Navigate within components (tables, tabs) |

### ARIA Implementation

```tsx
// Price badge with ARIA
<span
  role="status"
  aria-label={`Price change: ${value > 0 ? 'up' : 'down'} ${Math.abs(value).toFixed(2)} percent`}
  className={cn(/* ... */)}
>
  {/* visual content */}
</span>

// Data table with ARIA
<table role="grid" aria-label="Stock list">
  <thead>
    <tr role="row">
      <th role="columnheader" aria-sort="ascending">Symbol</th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    {data.map((row) => (
      <tr
        role="row"
        tabIndex={0}
        aria-selected={selectedRow === row.id}
      >
        {/* ... */}
      </tr>
    ))}
  </tbody>
</table>

// Chart with accessible description
<figure aria-label="Stock price chart">
  <div role="img" aria-describedby="chart-description">
    {/* Chart component */}
  </div>
  <figcaption id="chart-description" className="sr-only">
    BBCA stock price from January 1 to January 19, 2026.
    Starting at 8,900, ending at 9,250, representing a 3.9% gain.
  </figcaption>
</figure>
```

### Screen Reader Announcements

```tsx
// Live region for price updates
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {`${symbol} price updated to ${price}, ${change > 0 ? 'up' : 'down'} ${Math.abs(changePercent)}%`}
</div>

// Loading states
<div aria-busy="true" aria-label="Loading stock data">
  <Skeleton className="h-20 w-full" />
</div>
```

### Reduced Motion Support

```tsx
// Check user preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Framer Motion config
<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
>
  {/* content */}
</motion.div>
```

### Accessibility Checklist

- [ ] All images have meaningful `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages are programmatically associated with inputs
- [ ] Color is not the only means of conveying information
- [ ] Page has proper heading hierarchy (h1 → h2 → h3)
- [ ] Skip-to-content link available
- [ ] Modal focus is trapped when open
- [ ] Touch targets are at least 44×44px
- [ ] Timeouts can be extended or disabled
- [ ] No content flashes more than 3 times per second

---

## 9. Icon System

### Icon Library: Lucide React

```tsx
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Search,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';
```

### Icon Sizes

| Size | Pixels | Use Case |
|------|--------|----------|
| `xs` | 12px | Inline with caption text |
| `sm` | 16px | Badges, buttons (sm) |
| `md` | 20px | Default, buttons |
| `lg` | 24px | Headers, empty states |
| `xl` | 32px | Hero sections |

### Icon Colors

```tsx
// Semantic icon colors
<TrendingUp className="text-positive" />    // Gains
<TrendingDown className="text-negative" />  // Losses
<Star className="text-accent" />            // Watchlist
<Settings className="text-muted-foreground" /> // Secondary actions
```

---

## 10. Loading States

### Skeleton Components

```tsx
// Stock card skeleton
function StockCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-border">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-16" /> {/* Symbol */}
          <Skeleton className="h-4 w-32" /> {/* Name */}
        </div>
        <div className="space-y-2 text-right">
          <Skeleton className="h-6 w-24" /> {/* Price */}
          <Skeleton className="h-4 w-16" /> {/* Change */}
        </div>
      </div>
    </div>
  );
}

// Chart skeleton
function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-12 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
```

### Loading Spinner

```tsx
function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <RefreshCw
      className={cn(sizeClasses[size], "animate-spin text-primary")}
    />
  );
}
```

---

## 11. Dark/Light Mode

### Theme Provider Setup

```tsx
// components/theme-provider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

### Theme Toggle Component

```tsx
// components/layout/theme-toggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-19 | 1.0.0 | Initial design document created |
