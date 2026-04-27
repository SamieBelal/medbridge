export const SITE_NAME = "MedBridge";
export const SITE_DESCRIPTION = "Transparent cash-pay healthcare in DFW. Real prices before you book.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const DFW_CITIES = [
  "Dallas", "Fort Worth", "Plano", "Frisco", "Arlington",
  "Richardson", "McKinney", "Allen", "Carrollton", "Irving",
  "Garland", "Denton", "Lewisville", "Southlake", "Grapevine",
  "Flower Mound", "Mesquite", "Grand Prairie", "Mansfield", "Cedar Hill",
] as const;

export type DFWCity = (typeof DFW_CITIES)[number];

export const SERVICE_CATEGORIES = [
  { value: "botox", label: "Botox" },
  { value: "filler", label: "Dermal Fillers" },
  { value: "laser", label: "Laser Treatments" },
  { value: "prp", label: "PRP Therapy" },
  { value: "other", label: "Other" },
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]["value"];

export const PAYER_LIST = [
  { id: "bcbs-tx", name: "BCBS of Texas" },
  { id: "aetna", name: "Aetna" },
  { id: "uhc", name: "UnitedHealthcare" },
  { id: "cigna", name: "Cigna" },
  { id: "humana", name: "Humana" },
  { id: "ambetter", name: "Ambetter" },
] as const;

export const BOOKING_STATUSES = [
  "pending", "confirmed", "completed", "cancelled", "no_show",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const FLAT_BOOKING_FEE_CENTS = 0; // $0 for first 90 days per strategy doc
export const TAKE_RATE = 0.12; // 12% per-booking transaction fee (post-promo)
