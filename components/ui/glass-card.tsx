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
          // Base glass effect with ultra-subtle border
          "group relative rounded-2xl overflow-hidden",
          "bg-[hsl(var(--glass-background))]/50",
          "backdrop-blur-[var(--glass-blur)]",

          // Ultra-subtle border with minimal opacity
          "ring-1 ring-inset",
          "ring-[hsl(var(--foreground))]/[0.03]",
          "dark:ring-[hsl(var(--foreground))]/[0.05]",

          // Inner glow effect - more subtle
          "before:absolute before:inset-0 before:rounded-2xl",
          "before:bg-gradient-to-br before:from-white/[0.02] before:via-transparent before:to-transparent",
          "before:pointer-events-none",

          // Refined shadow for depth - softer
          elevated
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.15)]"
            : "shadow-[0_4px_16px_rgba(0,0,0,0.02),0_1px_4px_rgba(0,0,0,0.01)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.1)]",

          // Optional hover effect with smooth transitions
          hover && [
            "transition-all duration-300 ease-out",
            "hover:shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.03)]",
            "dark:hover:shadow-[0_24px_72px_rgba(0,0,0,0.4),0_6px_16px_rgba(0,0,0,0.2)]",
            "hover:ring-[hsl(var(--primary))]/10",
            "hover:-translate-y-0.5",
            "hover:before:from-white/[0.04]",
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
