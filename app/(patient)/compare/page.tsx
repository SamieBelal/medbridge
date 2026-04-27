"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ComparisonCard } from "@/components/shared/ComparisonCard";
import { cn } from "@/lib/utils";
import type { EligibilityResponse, CashVsInsuranceComparison } from "@/lib/availity/types";

function buildComparison(eligibility: EligibilityResponse, cashPrice: number): CashVsInsuranceComparison {
  const insuranceCost = eligibility.eligible ? eligibility.estimatedPatientCost : 0;
  const savings = insuranceCost - cashPrice;
  const cashIsCheaper = !eligibility.eligible || savings > 0;

  const deductiblePct = eligibility.deductible.total > 0
    ? eligibility.deductible.met / eligibility.deductible.total
    : 0;

  let trajectoryMessage = "";
  if (!eligibility.eligible) {
    trajectoryMessage = "This service is not covered by your plan. Cash pay is your best option.";
  } else if (cashIsCheaper) {
    const monthsLeft = 12 - new Date().getMonth();
    trajectoryMessage = `You've used ${Math.round(deductiblePct * 100)}% of your deductible. At your current pace, paying cash now saves you money — especially early in the plan year with ${monthsLeft} months remaining.`;
  } else {
    trajectoryMessage = `Your deductible is ${Math.round(deductiblePct * 100)}% met. Insurance may be the better option for this service. You could still book through MedBridge for convenience.`;
  }

  return {
    cashPrice,
    insuranceCost,
    savings,
    cashIsCheaper,
    deductible: eligibility.deductible,
    trajectoryMessage,
  };
}

export default function ComparePage() {
  const [comparison, setComparison] = useState<CashVsInsuranceComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("eligibilityResult");
    if (stored) {
      const eligibility: EligibilityResponse = JSON.parse(stored);
      // Default cash price for demo — $79 Botox
      const cashPrice = 7900;
      setComparison(buildComparison(eligibility, cashPrice));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <p className="text-muted-foreground">Loading comparison...</p>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream px-4 gap-4">
        <p className="text-muted-foreground">No eligibility check found.</p>
        <Link
          href="/eligibility"
          className={cn(buttonVariants(), "bg-navy-deep hover:bg-navy-light text-white")}
        >
          Check Your Insurance
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-charcoal">Cash vs Insurance</h1>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s how your options compare
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <ComparisonCard
            comparison={comparison}
            serviceName="Botox (20 units)"
            providerName="Glow MedSpa"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {comparison.cashIsCheaper ? (
              <Link
                href="/book/glow-medspa-plano"
                className={cn(buttonVariants({ size: "lg" }), "bg-amber-warm hover:bg-amber-warm/90 text-white")}
              >
                Book at Cash Price
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/book/glow-medspa-plano"
                className={cn(buttonVariants({ size: "lg" }), "bg-navy-deep hover:bg-navy-light text-white")}
              >
                Book Through MedBridge
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
            <Link
              href="/search"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Compare More Providers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
