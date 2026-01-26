import { GlassCard } from "@/components/ui/glass-card";
import { Globe } from "lucide-react";
import type { ForeignOwnershipData } from "@/lib/api/types";

interface ForeignOwnershipCardProps {
  ownership: ForeignOwnershipData | null;
}

function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatShares(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  return new Intl.NumberFormat("id-ID").format(value);
}

export function ForeignOwnershipCard({ ownership }: ForeignOwnershipCardProps) {
  if (!ownership || ownership.holders.length === 0) {
    return null;
  }

  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-base sm:text-lg font-semibold">Foreign Ownership</h3>
      </div>
      
      {ownership.totalForeignPercentage > 0 && (
        <div className="mb-3 sm:mb-4 p-3 rounded-lg bg-muted/50">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Foreign Ownership</p>
          <p className="text-xl sm:text-2xl font-bold font-mono font-tabular">
            {formatPercentage(ownership.totalForeignPercentage)}
          </p>
        </div>
      )}
      
      <div className="space-y-2 sm:space-y-3">
        <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">Top Institutional Holders</h4>
        {ownership.holders.slice(0, 5).map((holder, index) => (
          <div key={`${holder.name}-${index}`} className="flex justify-between items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium truncate">{holder.name}</p>
              {holder.shares > 0 && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {formatShares(holder.shares)} shares
                </p>
              )}
            </div>
            <div className="text-right ml-2 sm:ml-4 shrink-0">
              <p className="font-mono font-tabular text-xs sm:text-sm font-semibold">
                {formatPercentage(holder.percentage)}
              </p>
              {holder.change !== undefined && holder.change !== 0 && (
                <p className={`text-xs font-mono font-tabular ${holder.change > 0 ? "text-positive" : "text-negative"}`}>
                  {holder.change > 0 ? "+" : ""}{formatPercentage(holder.change)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {ownership.lastUpdated && (
        <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted-foreground">
          Last updated: {ownership.lastUpdated}
        </p>
      )}
    </GlassCard>
  );
}
