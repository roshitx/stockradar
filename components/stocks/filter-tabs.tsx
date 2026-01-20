"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type FilterTab =
  | "trending"
  | "top-gainer"
  | "top-loser"
  | "top-volume"
  | "top-value";

const tabs: { value: FilterTab; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "top-gainer", label: "Top Gainers" },
  { value: "top-loser", label: "Top Losers" },
  { value: "top-volume", label: "Top Volume" },
  { value: "top-value", label: "Top Value" },
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
      className={cn(
        "flex gap-2 overflow-x-auto pb-2 scrollbar-hide",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabChange(tab.value)}
          className={cn(
            "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
