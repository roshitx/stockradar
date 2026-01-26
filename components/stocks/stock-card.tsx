import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
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
    <Link href={`/stocks/${stock.symbol}`} className="block h-full">
      <Card
        size="sm"
        className="h-full transition-all hover:ring-primary/20 hover:-translate-y-0.5"
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {stock.symbol}
          </CardTitle>
          <CardAction>
            <PriceBadge value={stock.changePercent} size="sm" />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="truncate text-sm text-muted-foreground">{stock.name}</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-xl font-semibold tabular-nums">
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
        </CardContent>
      </Card>
    </Link>
  );
}
