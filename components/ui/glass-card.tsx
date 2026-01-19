import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  elevated?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, elevated = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base glass effect
          "rounded-xl border",
          "bg-[hsl(var(--glass-background))]",
          "border-[hsl(var(--glass-border))]",
          "backdrop-blur-[var(--glass-blur)]",

          // Shadow for depth
          elevated
            ? "shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.48)]"
            : "shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.32)]",

          // Optional hover effect
          hover && [
            "transition-all duration-200",
            "hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]",
            "dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.48)]",
            "hover:border-[hsl(var(--glass-border)/0.3)]",
          ],

          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
