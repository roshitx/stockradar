import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LayoutDashboard, BarChart3, Building2, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceBadge } from "@/components/stocks/price-badge";
import { InsiderTable } from "@/components/stocks/insider-table";
import { ForeignOwnershipCard } from "@/components/stocks/foreign-ownership-card";
import { MarketStatusBadge } from "@/components/stocks/market-status-badge";
import { Week52RangeBar } from "@/components/stocks/week-52-range-bar";
import { FinancialsSection } from "@/components/stocks/financials-section";
import { WatchlistButton } from "@/components/stocks/watchlist-button";
import { AIInsightCard } from "@/components/stocks/ai-insight-card";
import { AIInsightSkeleton } from "@/components/stocks/ai-insight-skeleton";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { StockDetailSkeleton } from "@/components/skeletons/stock-detail-skeleton";
import {
  getStockInfoData,
  getStockProfileData,
  getStockKeyStatsData,
  getStockInsidersData,
  getStockFinancialsData,
  getStockForeignOwnershipData,
  getAIInsightData,
} from "@/lib/api";

interface StockDetailPageProps {
  params: Promise<{ symbol: string }>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number | undefined, decimals = 2): string {
  if (value === undefined || value === null) return "-";
  return value.toFixed(decimals);
}

function formatLargeNumber(value: number | undefined): string {
  if (value === undefined || value === null) return "-";
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  return formatCurrency(value);
}

async function StockContent({ symbol }: { symbol: string }) {
  const [info, profile, keyStats, insiders, financials, foreignOwnership, aiInsight] = await Promise.all([
    getStockInfoData(symbol),
    getStockProfileData(symbol),
    getStockKeyStatsData(symbol),
    getStockInsidersData(symbol),
    getStockFinancialsData(symbol, "income", "annual"),
    getStockForeignOwnershipData(symbol),
    getAIInsightData(symbol),
  ]);

  if (!info) {
    notFound();
  }

  const statsItems = [
    // Open/High/Low not available from info endpoint - exclude or show N/A
    ...(info.open > 0 ? [{ label: "Open", value: `Rp ${formatCurrency(info.open)}` }] : []),
    ...(info.high > 0 ? [{ label: "High", value: `Rp ${formatCurrency(info.high)}` }] : []),
    ...(info.low > 0 ? [{ label: "Low", value: `Rp ${formatCurrency(info.low)}` }] : []),
    { label: "Prev Close", value: info.previousClose > 0 ? `Rp ${formatCurrency(info.previousClose)}` : "-" },
    { label: "Volume", value: info.volume > 0 ? formatLargeNumber(info.volume) : "-" },
    { label: "Value", value: info.value > 0 ? `Rp ${formatLargeNumber(info.value)}` : "-" },
    { label: "Frequency", value: info.frequency > 0 ? formatCurrency(info.frequency) : "-" },
    { label: "Market Cap", value: info.marketCap ? `Rp ${formatLargeNumber(info.marketCap)}` : "-" },
  ];

  const ratioItems = keyStats ? [
    { label: "P/E Ratio", value: formatNumber(keyStats.pe) },
    { label: "EPS", value: keyStats.eps ? `Rp ${formatCurrency(keyStats.eps)}` : "-" },
    { label: "P/BV", value: formatNumber(keyStats.pbv) },
    { label: "ROE", value: keyStats.roe ? `${formatNumber(keyStats.roe)}%` : "-" },
    { label: "ROA", value: keyStats.roa ? `${formatNumber(keyStats.roa)}%` : "-" },
    { label: "DER", value: formatNumber(keyStats.der) },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/stocks"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Stocks
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{info.symbol}</h1>
            <PriceBadge value={info.changePercent} size="lg" />
            {info.sector && (
              <Badge variant="secondary" className="text-xs sm:text-sm">{info.sector}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground truncate">{info.name}</p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="font-mono text-2xl sm:text-3xl font-bold font-tabular">
            Rp {formatCurrency(info.price)}
          </p>
          <p className={`text-xs sm:text-sm font-mono font-tabular ${info.change >= 0 ? "text-positive" : "text-negative"}`}>
            {info.change >= 0 ? "+" : ""}{formatCurrency(info.change)} ({info.changePercent >= 0 ? "+" : ""}{info.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <WatchlistButton symbol={symbol} />
        <MarketStatusBadge />
      </div>

      {/* AI Insight Card */}
      <AIInsightCard data={aiInsight} />

      {/* Chart */}
      <GlassCard className="p-4 sm:p-6">
        <CandlestickChart symbol={symbol} />
      </GlassCard>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <TabsList className="inline-flex w-max sm:w-auto">
            <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
              <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="financials" className="gap-1.5 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
              <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="insider" className="gap-1.5 text-xs sm:text-sm">
              <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
              Insider
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          {/* Key Stats */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pretty">Today&apos;s Trading</h3>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              {statsItems.map((item) => (
                <div key={item.label}>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-mono text-sm sm:text-base font-semibold font-tabular">{item.value}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Valuation Ratios */}
          {ratioItems.length > 0 && (
            <GlassCard className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pretty">Key Ratios</h3>
              <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                {ratioItems.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-mono text-sm sm:text-base font-semibold font-tabular">{item.value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {keyStats?.week52High && keyStats?.week52Low && (
            <GlassCard className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pretty">52-Week Range</h3>
              <Week52RangeBar
                currentPrice={info.price}
                week52High={keyStats.week52High}
                week52Low={keyStats.week52Low}
              />
            </GlassCard>
          )}

          <ForeignOwnershipCard ownership={foreignOwnership} />
        </TabsContent>

        <TabsContent value="financials" className="mt-4 sm:mt-6">
          <FinancialsSection symbol={symbol} initialData={financials} />
        </TabsContent>

        <TabsContent value="profile" className="mt-4 sm:mt-6">
          <GlassCard className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {profile?.description ? (
              <>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-pretty">About</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {profile.description}
                  </p>
                </div>

                {profile.website && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">Website</h4>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-primary hover:underline break-all"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}

                <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
                  {profile.sector && (
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Sector</p>
                      <p className="text-sm sm:text-base font-medium">{profile.sector}</p>
                    </div>
                  )}
                  {profile.subsector && (
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Subsector</p>
                      <p className="text-sm sm:text-base font-medium">{profile.subsector}</p>
                    </div>
                  )}
                  {profile.listingDate && (
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">IPO Date</p>
                      <p className="text-sm sm:text-base font-medium">{profile.listingDate}</p>
                    </div>
                  )}
                  {profile.employees && (
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Employees</p>
                      <p className="text-sm sm:text-base font-medium">{formatCurrency(profile.employees)}</p>
                    </div>
                  )}
                </div>

                {profile.shareholders && profile.shareholders.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-pretty">Major Shareholders</h3>
                    <div className="space-y-2">
                      {profile.shareholders.slice(0, 5).map((sh, i) => (
                        <div key={i} className="flex justify-between items-center gap-2">
                          <span className="text-sm sm:text-base text-muted-foreground truncate min-w-0">{sh.name}</span>
                          <span className="font-mono text-sm sm:text-base font-tabular shrink-0">{sh.percentage.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-muted-foreground">
                Company profile information is not available
              </div>
            )}
          </GlassCard>
        </TabsContent>

        <TabsContent value="insider" className="mt-4 sm:mt-6">
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pretty">Recent Insider Transactions</h3>
            <InsiderTable transactions={insiders} />
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const { symbol } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<StockDetailSkeleton />}>
            <StockContent symbol={symbol.toUpperCase()} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
