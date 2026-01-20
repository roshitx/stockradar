// components/skeletons/market-overview-skeleton.tsx

import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketOverviewSkeleton() {
  return (
    <>
      {/* Market Overview Section Skeleton */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* IHSG Card Skeleton */}
            <GlassCard className="p-6" elevated>
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-16 w-full rounded-md" />
            </GlassCard>

            {/* Top Gainers Skeleton */}
            <GlassCard className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Top Losers Skeleton */}
            <GlassCard className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Trending Stocks Section Skeleton */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <GlassCard key={i} className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-6 w-14" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-7 w-24" />
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
