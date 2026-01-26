"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type MarketStatus = "pre-market" | "open" | "lunch-break" | "closed" | "after-hours";

interface MarketStatusConfig {
  label: string;
  dotColor: string;
  badgeClass: string;
}

const STATUS_CONFIG: Record<MarketStatus, MarketStatusConfig> = {
  "pre-market": {
    label: "Pre-Market",
    dotColor: "text-yellow-500",
    badgeClass: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  open: {
    label: "Market Open",
    dotColor: "text-positive",
    badgeClass: "bg-positive/10 text-positive",
  },
  "lunch-break": {
    label: "Lunch Break",
    dotColor: "text-yellow-500",
    badgeClass: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  closed: {
    label: "Market Closed",
    dotColor: "text-muted-foreground",
    badgeClass: "bg-muted text-muted-foreground",
  },
  "after-hours": {
    label: "After Hours",
    dotColor: "text-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
};

function getMarketStatus(now: Date): MarketStatus {
  const wibOffset = 7 * 60;
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const wibMinutes = utcMinutes + wibOffset;
  const wibHours = Math.floor((wibMinutes % 1440) / 60);
  const wibMins = wibMinutes % 60;
  const time = wibHours * 100 + wibMins;

  const utcDay = now.getUTCDay();
  const wibDay = wibMinutes >= 1440 ? (utcDay + 1) % 7 : utcDay;

  if (wibDay === 0 || wibDay === 6) return "closed";

  const isFriday = wibDay === 5;

  if (time >= 845 && time < 900) return "pre-market";
  if (time >= 900 && time < (isFriday ? 1130 : 1200)) return "open";
  if (time >= (isFriday ? 1130 : 1200) && time < (isFriday ? 1400 : 1330)) return "lunch-break";
  if (time >= (isFriday ? 1400 : 1330) && time < 1550) return "open";
  if (time >= 1550 && time < 1615) return "after-hours";

  return "closed";
}

export function MarketStatusBadge() {
  const [status, setStatus] = useState<MarketStatus>("closed");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateStatus = () => setStatus(getMarketStatus(new Date()));
    updateStatus();

    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <Badge variant="outline" className="gap-1.5 bg-muted text-muted-foreground">
        <Circle className="h-2 w-2 fill-current" />
        Loading...
      </Badge>
    );
  }

  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border-transparent", config.badgeClass)}
    >
      <Circle className={cn("h-2 w-2 fill-current animate-pulse", config.dotColor)} />
      {config.label}
    </Badge>
  );
}
