"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SignalBadgeProps {
  signal: string;
  confidence: number;
}

export function SignalBadge({ signal, confidence }: SignalBadgeProps) {
  const upperSignal = signal.toUpperCase();
  const isBullish = upperSignal.includes("BULLISH") || upperSignal === "BUY" || upperSignal === "STRONG_BUY";
  const isBearish = upperSignal.includes("BEARISH") || upperSignal === "SELL" || upperSignal === "STRONG_SELL";
  const isStrong = upperSignal.includes("STRONG");

  const getColorClasses = () => {
    if (isBullish) {
      return isStrong
        ? "bg-positive text-white shadow-lg shadow-positive/30"
        : "bg-positive/15 text-positive border border-positive/30";
    }
    if (isBearish) {
      return isStrong
        ? "bg-negative text-white shadow-lg shadow-negative/30"
        : "bg-negative/15 text-negative border border-negative/30";
    }
    return "bg-muted text-muted-foreground border border-muted-foreground/20";
  };

  const Icon = isBullish ? TrendingUp : isBearish ? TrendingDown : Minus;
  const displaySignal = signal.replace(/_/g, " ");

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-all",
        "px-2.5 py-1 text-xs gap-1 sm:px-3 sm:py-1.5 sm:text-sm sm:gap-1.5",
        getColorClasses()
      )}
    >
      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
      <span>{displaySignal}</span>
      <span className="font-mono font-tabular opacity-80 text-[10px] sm:text-xs shrink-0">
        {confidence}%
      </span>
    </div>
  );
}
