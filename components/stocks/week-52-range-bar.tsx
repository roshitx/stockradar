import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Week52RangeBarProps {
  currentPrice: number;
  week52High: number;
  week52Low: number;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function Week52RangeBar({
  currentPrice,
  week52High,
  week52Low,
  className,
}: Week52RangeBarProps) {
  if (!week52High || !week52Low || week52High <= week52Low) {
    return null;
  }

  const range = week52High - week52Low;
  const position = ((currentPrice - week52Low) / range) * 100;
  const clampedPosition = Math.max(0, Math.min(100, position));

  const isNearHigh = position >= 80;
  const isNearLow = position <= 20;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>52W Range</span>
        <span className="font-mono font-tabular">
          Rp {formatCurrency(week52Low)} - Rp {formatCurrency(week52High)}
        </span>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative h-2 w-full rounded-full bg-muted cursor-help">
              <div
                className={cn(
                  "absolute left-0 h-full rounded-full transition-all",
                  isNearHigh
                    ? "bg-positive/30"
                    : isNearLow
                      ? "bg-negative/30"
                      : "bg-primary/30"
                )}
                style={{ width: `${clampedPosition}%` }}
              />

              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-4 w-1 rounded-full shadow-sm transition-all",
                  isNearHigh
                    ? "bg-positive"
                    : isNearLow
                      ? "bg-negative"
                      : "bg-primary"
                )}
                style={{ left: `calc(${clampedPosition}% - 2px)` }}
              />

              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-0.5 rounded-full bg-muted-foreground/50" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-0.5 rounded-full bg-muted-foreground/50" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm space-y-1">
              <p className="font-semibold">Current: Rp {formatCurrency(currentPrice)}</p>
              <p className="text-muted-foreground">
                {isNearHigh
                  ? "Near 52-week high"
                  : isNearLow
                    ? "Near 52-week low"
                    : `${position.toFixed(1)}% from low`}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex justify-between text-xs">
        <span className="text-negative font-mono font-tabular">
          Low: Rp {formatCurrency(week52Low)}
        </span>
        <span className="text-positive font-mono font-tabular">
          High: Rp {formatCurrency(week52High)}
        </span>
      </div>
    </div>
  );
}
