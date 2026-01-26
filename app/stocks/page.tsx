import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StockCard } from "@/components/stocks/stock-card";
import { StockSearch } from "@/components/stocks/stock-search";
import { FilterTabs, type FilterTab } from "@/components/stocks/filter-tabs";
import { StockListSkeleton } from "@/components/skeletons/stock-list-skeleton";
import {
  getTrendingStocks,
  getTopGainerStocks,
  getTopLoserStocks,
  getTopVolumeStocks,
  getTopValueStocks,
  searchStocksData,
  getStockInfoData,
} from "@/lib/api";
import type { TrendingStock, MoverStock } from "@/lib/api/types";

interface StocksPageProps {
  searchParams: Promise<{ tab?: string; q?: string }>;
}

async function getStocksForTab(tab: FilterTab): Promise<(TrendingStock | MoverStock)[]> {
  switch (tab) {
    case "trending":
      return getTrendingStocks();
    case "top-gainer":
      return getTopGainerStocks();
    case "top-loser":
      return getTopLoserStocks();
    case "top-volume":
      return getTopVolumeStocks();
    case "top-value":
      return getTopValueStocks();
    default:
      return getTrendingStocks();
  }
}

async function StockGrid({ tab, query }: { tab: FilterTab; query?: string }) {
  let stocks: (TrendingStock | MoverStock)[];

  if (query) {
    const results = await searchStocksData(query);
    // Fetch stock info for each search result to get price data
    const stockInfoPromises = results.slice(0, 12).map(async (result) => {
      const info = await getStockInfoData(result.symbol);
      if (info) {
        return {
          symbol: info.symbol,
          name: info.name,
          price: info.price,
          change: info.change,
          changePercent: info.changePercent,
          volume: info.volume,
          value: info.value,
          frequency: info.frequency,
        } as TrendingStock;
      }
      return {
        symbol: result.symbol,
        name: result.name,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        value: 0,
        frequency: 0,
      } as TrendingStock;
    });
    stocks = await Promise.all(stockInfoPromises);
  } else {
    stocks = await getStocksForTab(tab);
  }

  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          {query ? `No stocks found for "${query}"` : "No stocks available"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {query ? "Try a different search term" : "Check back later"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
}

export default async function StocksPage({ searchParams }: StocksPageProps) {
  const params = await searchParams;
  const tab = (params.tab as FilterTab) || "trending";
  const query = params.q;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-display-2 mb-2">Stocks</h1>
            <p className="text-muted-foreground">
              Browse Indonesian stock market data
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <StockSearch defaultValue={query} className="w-full sm:max-w-xs" />
            {!query && <FilterTabs activeTab={tab} />}
          </div>

          {/* Stock Grid */}
          <Suspense fallback={<StockListSkeleton />}>
            <StockGrid tab={tab} query={query} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
