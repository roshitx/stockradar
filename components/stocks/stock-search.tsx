"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

interface StockSearchProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function StockSearch({
  defaultValue = "",
  placeholder = "Search stocks…",
  className,
}: StockSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setValue(term);

    const debounceId = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
          params.set("q", term);
          params.delete("tab");
        } else {
          params.delete("q");
        }
        router.push(`/stocks?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(debounceId);
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
          isPending && "animate-pulse"
        )}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        aria-label="Search stocks"
        className={cn(
          "h-10 w-full rounded-lg border border-input bg-background/50 pl-10 pr-4",
          "text-sm placeholder:text-muted-foreground backdrop-blur-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "transition-colors"
        )}
      />
    </div>
  );
}
