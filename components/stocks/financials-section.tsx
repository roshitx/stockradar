"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  StockFinancials,
  FinancialReportType,
  FinancialPeriodType,
} from "@/lib/api/types";

interface FinancialsSectionProps {
  symbol: string;
  initialData: StockFinancials | null;
}

function formatValue(value: number): string {
  if (value === 0) return "-";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1_000_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(2)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(2)}M`;
  }

  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const REPORT_TYPES: { value: FinancialReportType; label: string }[] = [
  { value: "income", label: "Income Statement" },
  { value: "balance", label: "Balance Sheet" },
  { value: "cashflow", label: "Key Ratios" },
];

const PERIOD_TYPES: { value: FinancialPeriodType; label: string }[] = [
  { value: "annual", label: "Annual" },
  { value: "quarterly", label: "Quarterly" },
  { value: "ttm", label: "TTM" },
];

export function FinancialsSection({ symbol, initialData }: FinancialsSectionProps) {
  const [reportType, setReportType] = useState<FinancialReportType>("income");
  const [periodType, setPeriodType] = useState<FinancialPeriodType>("annual");
  const [financials, setFinancials] = useState<StockFinancials | null>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportType === "income" && periodType === "annual" && initialData) {
      setFinancials(initialData);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/financials/${symbol}?reportType=${reportType}&periodType=${periodType}`
        );
        if (res.ok) {
          const data = await res.json();
          setFinancials(data);
        } else {
          setFinancials(null);
        }
      } catch {
        setFinancials(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, reportType, periodType, initialData]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select value={reportType} onValueChange={(v) => setReportType(v as FinancialReportType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            {REPORT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={periodType} onValueChange={(v) => setPeriodType(v as FinancialPeriodType)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4" role="status" aria-label="Loading financial data…">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Loading…</span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Item</TableHead>
                  <TableHead className="text-right">Value (IDR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 7 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-[60%]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : !financials || financials.items.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          Financial data is not available for this selection
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="capitalize">{financials.reportType} Statement</span>
            <span>•</span>
            <span className="capitalize">{financials.periodType}</span>
            {financials.period && (
              <>
                <span>•</span>
                <span>{financials.period}</span>
              </>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Item</TableHead>
                  <TableHead className="text-right">Value (IDR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financials.items.map((item, index) => (
                  <TableRow 
                    key={`${item.name}-${index}`}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right font-mono font-tabular">
                      {item.formattedValue || formatValue(item.value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
