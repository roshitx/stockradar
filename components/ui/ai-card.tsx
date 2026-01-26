import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface AICardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showIcon?: boolean;
}

export function AICard({
  className,
  children,
  showIcon = false,
  ...props
}: AICardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-gradient-to-br from-ai-background via-ai-background to-ai/5",
        "border border-ai-border",
        "shadow-[0_0_20px_-5px_hsl(var(--ai-glow))]",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-ai/5 via-transparent to-ai-secondary/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-ai/10 to-transparent rounded-bl-full pointer-events-none" />
      
      {showIcon && (
        <div className="absolute top-3 right-3 opacity-10">
          <Sparkles className="h-16 w-16 text-ai" />
        </div>
      )}
      
      <div className="relative">{children}</div>
    </div>
  );
}

interface AICardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AICardHeader({
  title,
  subtitle,
  action,
  className,
  ...props
}: AICardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6 pb-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ai to-ai-secondary shadow-lg shadow-ai/25">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

interface AICardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AICardContent({
  className,
  children,
  ...props
}: AICardContentProps) {
  return (
    <div className={cn("px-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

interface AICardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AICardFooter({
  className,
  children,
  ...props
}: AICardFooterProps) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-ai-border/50 bg-ai/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
