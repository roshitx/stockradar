import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StockListSkeleton } from "@/components/skeletons/stock-list-skeleton";

export default function StocksLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header Skeleton */}
          <div className="mb-8">
            <div className="h-9 w-32 bg-muted/50 rounded animate-pulse mb-2" />
            <div className="h-5 w-64 bg-muted/50 rounded animate-pulse" />
          </div>

          {/* Search and Filters Skeleton */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-10 w-full sm:max-w-xs bg-muted/50 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Stock Grid Skeleton */}
          <StockListSkeleton />
        </div>
      </main>

      <Footer />
    </div>
  );
}
