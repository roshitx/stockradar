import { ArrowRight, TrendingUp, BarChart3, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceBadge } from "@/components/stocks/price-badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Mock data for demo (will be replaced with real API data)
const trendingStocks = [
  { symbol: "BBCA", name: "Bank Central Asia", price: 9250, change: 2.5 },
  { symbol: "BMRI", name: "Bank Mandiri", price: 6450, change: 1.89 },
  { symbol: "TLKM", name: "Telkom Indonesia", price: 3820, change: -0.52 },
  { symbol: "ASII", name: "Astra International", price: 5775, change: 0.87 },
];

const topGainers = [
  { symbol: "ARTO", change: 24.76 },
  { symbol: "BUKA", change: 18.52 },
  { symbol: "GOTO", change: 15.38 },
];

const topLosers = [
  { symbol: "SMDR", change: -8.24 },
  { symbol: "MDKA", change: -6.15 },
  { symbol: "ANTM", change: -4.92 },
];

const features = [
  {
    icon: BarChart3,
    title: "Real-time Charts",
    description: "Professional candlestick charts with multiple timeframes",
  },
  {
    icon: Star,
    title: "Personal Watchlist",
    description: "Track your favorite stocks with custom notes",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Optimized caching for instant data access",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          <div className="container mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-display-1 tracking-tight sm:text-5xl lg:text-6xl">
                Track Indonesian Stocks{" "}
                <span className="text-primary">with Confidence</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Real-time IDX market data, professional charts, and personal
                watchlists. Built for Indonesian investors who demand clarity
                and speed.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="lg">
                  Browse Stocks
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Market Overview Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* IHSG Card */}
              <GlassCard className="p-6" elevated>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      IHSG
                    </p>
                    <p className="mt-1 text-2xl font-semibold font-mono font-tabular">
                      7,234.56
                    </p>
                  </div>
                  <PriceBadge value={0.45} size="lg" />
                </div>
                <div className="mt-4 h-16 rounded-md bg-positive/10">
                  {/* Placeholder for mini chart */}
                </div>
              </GlassCard>

              {/* Top Gainers */}
              <GlassCard className="p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp
                    className="h-4 w-4 text-positive"
                    aria-hidden="true"
                  />
                  Top Gainers
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {topGainers.map((stock) => (
                    <li
                      key={stock.symbol}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{stock.symbol}</span>
                      <PriceBadge value={stock.change} size="sm" />
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Top Losers */}
              <GlassCard className="p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp
                    className="h-4 w-4 rotate-180 text-negative"
                    aria-hidden="true"
                  />
                  Top Losers
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {topLosers.map((stock) => (
                    <li
                      key={stock.symbol}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{stock.symbol}</span>
                      <PriceBadge value={stock.change} size="sm" />
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Trending Stocks Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-1">Trending Stocks</h2>
              <Button variant="ghost" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trendingStocks.map((stock) => (
                <GlassCard key={stock.symbol} hover className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {stock.symbol}
                        </span>
                        <PriceBadge value={stock.change} size="sm" />
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {stock.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-mono text-xl font-semibold font-tabular">
                      Rp {formatCurrency(stock.price)}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-heading-1">
                Everything You Need to Track the Market
              </h2>
              <p className="mt-4 text-muted-foreground">
                Professional-grade tools designed for Indonesian retail
                investors.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GlassCard
              className="relative overflow-hidden p-8 sm:p-12"
              elevated
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-display-2">
                  Ready to Start Tracking?
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Create your free account and start building your watchlist
                  today.
                </p>
                <div className="mt-8">
                  <Button size="lg" className="gap-2">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
