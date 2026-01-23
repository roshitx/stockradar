"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  type IChartApi,
  ColorType,
  AreaSeries,
  type Time,
} from "lightweight-charts";
import type { IHSGChartPoint } from "@/lib/api";

interface IHSGMiniChartProps {
  data: IHSGChartPoint[];
  isPositive: boolean;
}

export function IHSGMiniChart({ data, isPositive }: IHSGMiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "transparent",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 80,
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: {
        horzLine: { visible: false },
        vertLine: { visible: false },
      },
      handleScroll: false,
      handleScale: false,
    });

    const lineColor = isPositive ? "#10b981" : "#f43f5e";
    const topColor = isPositive
      ? "rgba(16, 185, 129, 0.4)"
      : "rgba(244, 63, 94, 0.4)";

    const areaSeries = chart.addSeries(AreaSeries, {
      topColor,
      bottomColor: "transparent",
      lineColor,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    if (data.length > 0) {
      areaSeries.setData(
        data.map((d) => ({
          time: d.time as Time,
          value: d.value,
        }))
      );
      chart.timeScale().fitContent();
    }

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, isPositive]);

  if (data.length === 0) {
    return (
      <div className="h-20 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      className="h-20 w-full"
      aria-label="IHSG intraday chart"
      role="img"
    />
  );
}
