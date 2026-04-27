import { formatCurrency } from "@/lib/utils";

export interface GFEServiceItem {
  name: string;
  code?: string;
  price: number; // cents
}

export interface GoodFaithEstimate {
  providerName: string;
  providerNPI: string;
  providerAddress: string;
  patientName: string;
  serviceDate: string;
  items: GFEServiceItem[];
  totalEstimate: number; // cents
  generatedAt: string;
}

export function generateGFE(params: {
  providerName: string;
  providerNPI: string;
  providerAddress: string;
  patientName: string;
  serviceDate: string;
  items: GFEServiceItem[];
}): GoodFaithEstimate {
  const totalEstimate = params.items.reduce((sum, item) => sum + item.price, 0);

  return {
    ...params,
    totalEstimate,
    generatedAt: new Date().toISOString(),
  };
}
