"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceBadge } from "@/components/stocks/price-badge";
import type { TrendingStock } from "@/lib/api/types";

interface TrendingCarouselProps {
  stocks: TrendingStock[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function TrendingCarousel({ stocks }: TrendingCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {stocks.map((stock) => (
          <CarouselItem
            key={stock.symbol}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
          >
            <Link href={`/stocks/${stock.symbol}`}>
              <GlassCard hover className="p-4 h-full">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">{stock.symbol}</span>
                      <PriceBadge value={stock.changePercent} size="sm" />
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {stock.name}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-mono text-xl font-semibold font-tabular">
                    Rp {formatCurrency(stock.price)}
                  </p>
                </div>
              </GlassCard>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
      <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
    </Carousel>
  );
}
