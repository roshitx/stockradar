import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StockFinancials } from "@/lib/api/types";

interface FinancialsTableProps {
  financials: StockFinancials | null;
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

export function FinancialsTable({ financials }: FinancialsTableProps) {
  if (!financials || financials.items.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        Financial data is not available
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
              <TableRow key={`${item.name}-${index}`}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right font-mono font-tabular">
                  {item.formattedValue || formatValue(item.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
