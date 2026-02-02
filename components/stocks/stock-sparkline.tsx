"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  type IChartApi,
  ColorType,
  LineSeries,
} from "lightweight-charts";

export interface SparklinePoint {
  time: string;
  value: number;
}

interface StockSparklineProps {
  data: SparklinePoint[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export function StockSparkline({
  data,
  isPositive,
  width = 80,
  height = 40,
}: StockSparklineProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const styles = getComputedStyle(document.documentElement);
    const positiveHsl = styles.getPropertyValue("--positive").trim();
    const negativeHsl = styles.getPropertyValue("--negative").trim();

    const hslToColor = (hsl: string) => `hsl(${hsl})`;

    const lineColor = isPositive
      ? hslToColor(positiveHsl)
      : hslToColor(negativeHsl);

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "transparent",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width,
      height,
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

    const lineSeries = chart.addSeries(LineSeries, {
      color: lineColor,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    lineSeries.setData(
      data.map((d) => ({
        time: d.time,
        value: d.value,
      }))
    );

    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
    };
  }, [data, isPositive, width, height]);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width, height }}
      >
        <div className="h-0.5 w-8 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      style={{ width, height }}
      aria-label="Stock price trend"
      role="img"
    />
  );
}
