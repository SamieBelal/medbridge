export interface EligibilityRequest {
  payerId: string;
  payerName: string;
  memberId: string;
  dateOfBirth: string;
  serviceType?: string;
}

export interface DeductibleInfo {
  total: number;      // cents
  met: number;        // cents — how much has been used
  remaining: number;  // cents
}

export interface EligibilityResponse {
  eligible: boolean;
  payer: string;
  memberId: string;
  deductible: DeductibleInfo;
  copay: number;           // cents
  coinsurance: number;     // decimal, e.g. 0.20
  planYearStart: string;   // ISO date
  estimatedPatientCost: number; // cents — cost through insurance for the service
  rawResponse?: unknown;   // For future real Availity response
}

export interface CashVsInsuranceComparison {
  cashPrice: number;       // cents
  insuranceCost: number;   // cents — estimated patient responsibility
  savings: number;         // cents — positive means cash is cheaper
  cashIsCheaper: boolean;
  deductible: DeductibleInfo;
  trajectoryMessage: string; // "You'll hit your deductible in October..."
}
