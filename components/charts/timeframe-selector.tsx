"use client";

import { cn } from "@/lib/utils";
import type { ChartTimeframeDisplay } from "@/lib/api/types";

const timeframes: { value: ChartTimeframeDisplay; label: string }[] = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "1Y", label: "1Y" },
];

interface TimeframeSelectorProps {
  activeTimeframe: ChartTimeframeDisplay;
  onTimeframeChange: (tf: ChartTimeframeDisplay) => void;
  className?: string;
}

export function TimeframeSelector({
  activeTimeframe,
  onTimeframeChange,
  className,
}: TimeframeSelectorProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {timeframes.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onTimeframeChange(tf.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            activeTimeframe === tf.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}
