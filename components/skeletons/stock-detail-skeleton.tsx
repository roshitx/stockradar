import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/glass-card";

export function StockDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>
      </div>

      {/* Chart */}
      <GlassCard className="p-6">
        <div className="mb-4 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-12 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </GlassCard>

      {/* Tabs skeleton */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {/* Key Stats Grid */}
      <GlassCard className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
