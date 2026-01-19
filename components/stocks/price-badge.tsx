import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceBadgeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-xs px-1.5 py-0.5 gap-0.5",
  md: "text-sm px-2 py-1 gap-1",
  lg: "text-base px-3 py-1.5 gap-1.5",
};

const iconSizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function PriceBadge({
  value,
  size = "md",
  showIcon = true,
  className,
}: PriceBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <span
      role="status"
      aria-label={`Price change: ${isPositive ? "up" : isNegative ? "down" : "unchanged"} ${Math.abs(value).toFixed(2)} percent`}
      className={cn(
        "inline-flex items-center rounded-md font-mono font-medium",
        sizeClasses[size],
        isPositive && "bg-positive-subtle text-positive",
        isNegative && "bg-negative-subtle text-negative",
        !isPositive && !isNegative && "bg-muted text-muted-foreground",
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive && (
            <TrendingUp className={iconSizes[size]} aria-hidden="true" />
          )}
          {isNegative && (
            <TrendingDown className={iconSizes[size]} aria-hidden="true" />
          )}
          {!isPositive && !isNegative && (
            <Minus className={iconSizes[size]} aria-hidden="true" />
          )}
        </>
      )}
      <span className="font-tabular">
        {isPositive && "+"}
        {value.toFixed(2)}%
      </span>
    </span>
  );
}
