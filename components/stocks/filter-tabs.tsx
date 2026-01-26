"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterTab =
  | "trending"
  | "top-gainer"
  | "top-loser"
  | "top-volume"
  | "top-value";

const tabs: { value: FilterTab; label: string; icon: LucideIcon }[] = [
  { value: "trending", label: "Trending", icon: Flame },
  { value: "top-gainer", label: "Top Gainers", icon: TrendingUp },
  { value: "top-loser", label: "Top Losers", icon: TrendingDown },
  { value: "top-volume", label: "Top Volume", icon: BarChart3 },
  { value: "top-value", label: "Top Value", icon: Wallet },
];

interface FilterTabsProps {
  activeTab: FilterTab;
  className?: string;
}

export function FilterTabs({ activeTab, className }: FilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: FilterTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.delete("q");
    router.push(`/stocks?${params.toString()}`);
  };

  return (
    <div
      role="tablist"
      aria-label="Stock filters"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-muted p-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.value}`}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
