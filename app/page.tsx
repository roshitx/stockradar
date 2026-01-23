import Link from "next/link";
import { ArrowRight, TrendingUp, BarChart3, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceBadge } from "@/components/stocks/price-badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrendingCarousel } from "@/components/home/trending-carousel";
import { IHSGMiniChart } from "@/components/home/ihsg-mini-chart";
import {
  getTrendingStocks,
  getTopGainerStocks,
  getTopLoserStocks,
  getIHSGData,
  getIHSGIntradayChartData,
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

export default async function HomePage() {
  const [trendingStocks, topGainers, topLosers, ihsgData, ihsgChartData] = await Promise.all([
    getTrendingStocks(),
    getTopGainerStocks(),
    getTopLoserStocks(),
    getIHSGData(),
    getIHSGIntradayChartData(),
  ]);

  const displayGainers = topGainers.slice(0, 5);
  const displayLosers = topLosers.slice(0, 5);
  const displayTrending = trendingStocks.slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-20 bg-grid" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/5 via-background/80 to-background" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-70" />
          <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px] opacity-50 mix-blend-screen" />

          <div className="container mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 sm:pt-48 sm:pb-32 lg:px-8 lg:pt-56">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="animate-fade-in-up opacity-0 text-display-1 tracking-tight sm:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 drop-shadow-sm">
                Track Indonesian Stocks{" "}
                <span className="text-primary block mt-2 sm:inline sm:mt-0">with Confidence</span>
              </h1>
              <p className="animate-fade-in-up delay-100 opacity-0 mt-8 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Real-time IDX market data, professional charts, and personal
                watchlists. Built for Indonesian investors who demand clarity
                and speed.
              </p>
              <div className="animate-fade-in-up delay-200 opacity-0 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base backdrop-blur-sm bg-background/50 hover:bg-background/80" asChild>
                  <Link href="/stocks">Browse Stocks</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <GlassCard className="p-6" elevated>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      IHSG
                    </p>
                    <p className="mt-1 text-2xl font-semibold font-mono font-tabular">
                      {ihsgData.price.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <PriceBadge value={ihsgData.changePercent} size="lg" />
                </div>
                <div className="mt-4">
                  <IHSGMiniChart data={ihsgChartData} isPositive={ihsgData.changePercent >= 0} />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-positive" aria-hidden="true" />
                  Top Gainers
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {displayGainers.map((stock) => (
                    <li key={stock.symbol} className="flex items-center justify-between">
                      <Link href={`/stocks/${stock.symbol}`} className="font-medium hover:text-primary transition-colors">
                        {stock.symbol}
                      </Link>
                      <PriceBadge value={stock.changePercent} size="sm" />
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4 rotate-180 text-negative" aria-hidden="true" />
                  Top Losers
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {displayLosers.map((stock) => (
                    <li key={stock.symbol} className="flex items-center justify-between">
                      <Link href={`/stocks/${stock.symbol}`} className="font-medium hover:text-primary transition-colors">
                        {stock.symbol}
                      </Link>
                      <PriceBadge value={stock.changePercent} size="sm" />
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </section>

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

            <TrendingCarousel stocks={displayTrending} />
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-heading-1">
                Everything You Need to Track the Market
              </h2>
              <p className="mt-4 text-muted-foreground">
                Professional-grade tools designed for Indonesian retail investors.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
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

        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GlassCard className="relative overflow-hidden p-8 sm:p-12" elevated>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-display-2">Ready to Start Tracking?</h2>
                <p className="mt-4 text-muted-foreground">
                  Create your free account and start building your watchlist today.
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
