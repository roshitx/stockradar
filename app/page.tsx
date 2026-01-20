import Link from "next/link";
import { ArrowRight, TrendingUp, BarChart3, Star, Zap } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceBadge } from "@/components/stocks/price-badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MarketOverviewSkeleton } from "@/components/skeletons/market-overview-skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getTrendingStocks,
  getTopGainerStocks,
  getTopLoserStocks,
  getIHSGData,
} from "@/lib/api";

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

async function MarketOverview() {
  const [ihsgData, topGainers, topLosers, trendingStocks] = await Promise.all([
    getIHSGData(),
    getTopGainerStocks(),
    getTopLoserStocks(),
    getTrendingStocks(),
  ]);

  return (
    <>
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
                    {formatCurrency(ihsgData.price)}
                  </p>
                </div>
                <PriceBadge value={ihsgData.changePercent} size="lg" />
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
                {topGainers.slice(0, 3).map((stock) => (
                  <li
                    key={stock.symbol}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{stock.symbol}</span>
                    <PriceBadge value={stock.changePercent} size="sm" />
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
                {topLosers.slice(0, 3).map((stock) => (
                  <li
                    key={stock.symbol}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{stock.symbol}</span>
                    <PriceBadge value={stock.changePercent} size="sm" />
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-heading-1">Trending Stocks</h2>
            <Button variant="ghost" className="gap-1" asChild>
              <Link href="/stocks?tab=trending">
                View All
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="group relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {trendingStocks.map((stock) => (
                  <CarouselItem key={stock.symbol} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <Link href={`/stocks/${stock.symbol}`} className="block">
                      <GlassCard hover className="p-5 relative">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold">
                                {stock.symbol}
                              </span>
                              <PriceBadge value={stock.changePercent} size="sm" />
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
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Custom Navigation Buttons with hover effect */}
              <CarouselPrevious className="hidden lg:flex -left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CarouselNext className="hidden lg:flex -right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Carousel>
          </div>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 min-h-screen flex items-center">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

            {/* Grid pattern with gradient fade */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(to bottom,
                    hsl(var(--foreground) / 0.1) 0%,
                    hsl(var(--foreground) / 0.1) 40%,
                    transparent 70%,
                    transparent 100%
                  ),
                  linear-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--foreground) / 0.08) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 80px 80px, 80px 80px',
                backgroundPosition: '0 0, 0 0, 0 0',
                maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 80%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 80%)'
              }}
            />
          </div>

          <div className="container mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 w-full">
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
                <Button variant="outline" size="lg" asChild>
                  <Link href="/stocks">Browse Stocks</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Market Overview and Trending Stocks - with Suspense */}
        <Suspense fallback={<MarketOverviewSkeleton />}>
          <MarketOverview />
        </Suspense>

        {/* Features Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent -z-10" />

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-heading-1">
                Everything You Need to Track the Market
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Professional-grade tools designed for Indonesian retail
                investors.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <GlassCard
                  key={feature.title}
                  className="group p-8 hover:border-primary/30 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Icon with gradient background */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
                      <feature.icon
                        className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>

                  {/* Decorative bottom accent */}
                  <div className="mt-6 h-0.5 w-12 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </GlassCard>
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
