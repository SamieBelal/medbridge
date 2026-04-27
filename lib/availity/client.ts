import type { EligibilityRequest, EligibilityResponse } from "./types";

// Mock payer scenarios for the stub
const MOCK_SCENARIOS: Record<string, Omit<EligibilityResponse, "payer" | "memberId">> = {
  "bcbs-tx": {
    eligible: true,
    deductible: { total: 300000, met: 85000, remaining: 215000 },
    copay: 0,
    coinsurance: 0.20,
    planYearStart: "2026-01-01",
    estimatedPatientCost: 18700,
  },
  "aetna": {
    eligible: true,
    deductible: { total: 500000, met: 10000, remaining: 490000 },
    copay: 0,
    coinsurance: 0.30,
    planYearStart: "2026-01-01",
    estimatedPatientCost: 25000,
  },
  "uhc": {
    eligible: true,
    deductible: { total: 200000, met: 185000, remaining: 15000 },
    copay: 4000,
    coinsurance: 0.10,
    planYearStart: "2026-01-01",
    estimatedPatientCost: 4790,
  },
  "cigna": {
    eligible: false,
    deductible: { total: 0, met: 0, remaining: 0 },
    copay: 0,
    coinsurance: 0,
    planYearStart: "2026-01-01",
    estimatedPatientCost: 0,
  },
};

export async function checkEligibility(
  params: EligibilityRequest
): Promise<EligibilityResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const scenario = MOCK_SCENARIOS[params.payerId] ?? MOCK_SCENARIOS["bcbs-tx"]!;

  return {
    ...scenario,
    payer: params.payerName,
    memberId: params.memberId,
  };
}
