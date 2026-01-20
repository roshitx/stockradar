import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceBadge } from "@/components/stocks/price-badge";
import { Badge } from "@/components/ui/badge";
import type { TrendingStock, MoverStock } from "@/lib/api/types";

type StockCardProps = {
  stock: TrendingStock | MoverStock;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatVolume(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

export function StockCard({ stock }: StockCardProps) {
  return (
    <Link href={`/stocks/${stock.symbol}`} className="block">
      <GlassCard hover className="p-5 h-full">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{stock.symbol}</span>
              <PriceBadge value={stock.changePercent} size="sm" />
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {stock.name}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-mono text-xl font-semibold font-tabular">
              Rp {formatCurrency(stock.price)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Vol: {formatVolume(stock.volume)}
            </p>
          </div>
          {stock.value > 0 && (
            <Badge variant="secondary" className="text-xs">
              Val: {formatVolume(stock.value)}
            </Badge>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}
