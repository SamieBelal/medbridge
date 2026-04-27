import { CheckCircle2, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { CashVsInsuranceComparison } from "@/lib/availity/types";

interface ComparisonCardProps {
  comparison: CashVsInsuranceComparison;
  serviceName?: string;
  providerName?: string;
}

export function ComparisonCard({ comparison, serviceName, providerName }: ComparisonCardProps) {
  const { cashPrice, insuranceCost, savings, cashIsCheaper, deductible, trajectoryMessage } = comparison;

  return (
    <Card className="overflow-hidden border-2 shadow-lg">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Insurance Side */}
          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Through Insurance
            </p>
            <p className="text-4xl font-bold text-danger">
              {insuranceCost > 0 ? formatCurrency(insuranceCost) : "N/A"}
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Deductible: {formatCurrency(deductible.total)}</p>
              <p>Used so far: {formatCurrency(deductible.met)}</p>
              <p>Remaining: {formatCurrency(deductible.remaining)}</p>
              <p>Your estimated cost: {insuranceCost > 0 ? formatCurrency(insuranceCost) : "Not covered"}</p>
            </div>
          </div>

          {/* Cash Side */}
          <div className="p-6 md:p-8 bg-success-light/30">
            <div className="flex items-center gap-2 mb-2">
              {cashIsCheaper && <CheckCircle2 className="h-4 w-4 text-success" />}
              <p className="text-xs font-semibold uppercase tracking-wider text-success">
                {cashIsCheaper ? "Cash Price on MedBridge" : "Cash Price"}
              </p>
            </div>
            <p className="text-4xl font-bold text-success">
              {formatCurrency(cashPrice)}
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Transparent price, no surprise bills</p>
              <p>HSA/FSA card accepted</p>
              <p>Submit receipt to your HSA</p>
              {cashIsCheaper && savings > 0 && (
                <p className="font-semibold text-success">
                  You save {formatCurrency(savings)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Smart Insight Bar */}
        {trajectoryMessage && (
          <div className="bg-navy-deep/5 border-t border-border px-6 py-4">
            <p className="text-sm text-navy-deep flex items-start gap-2">
              <TrendingDown className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{trajectoryMessage}</span>
            </p>
          </div>
        )}
      </CardContent>

      {/* Caption */}
      {serviceName && providerName && (
        <p className="text-center text-xs text-muted-foreground py-3 border-t border-border">
          Comparison for {serviceName} at {providerName}. Actual savings vary by plan.
        </p>
      )}
    </Card>
  );
}
