import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/glass-card";

export function StockListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <GlassCard key={i} className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
