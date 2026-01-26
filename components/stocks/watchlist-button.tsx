"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Heart } from "lucide-react";

interface WatchlistButtonProps {
  symbol: string;
  isLoggedIn?: boolean;
  isInWatchlist?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function WatchlistButton({
  isLoggedIn = false,
  isInWatchlist = false,
  onAdd,
  onRemove,
}: WatchlistButtonProps) {
  if (isLoggedIn) {
    return (
      <Button
        variant={isInWatchlist ? "default" : "outline"}
        className="gap-2"
        onClick={isInWatchlist ? onRemove : onAdd}
      >
        {isInWatchlist ? (
          <>
            <Heart className="h-4 w-4 fill-current" />
            In Watchlist
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add to Watchlist
          </>
        )}
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-block">
          <Button variant="outline" disabled className="gap-2 pointer-events-none">
            <Plus className="h-4 w-4" />
            Add to Watchlist
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Login required to use watchlist</p>
      </TooltipContent>
    </Tooltip>
  );
}
