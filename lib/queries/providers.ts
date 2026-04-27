import { createClient } from "@/lib/supabase/server";

export interface ProviderWithRating {
  id: string;
  slug: string;
  businessName: string;
  city: string;
  specialty: string;
  bio: string;
  address: string;
  zip: string;
  phone: string;
  website: string;
  npi: string;
  isActive: boolean;
  licenseVerified: boolean;
  avgRating: number;
  reviewCount: number;
  priceRange: { min: number; max: number };
}

export interface ServiceRow {
  id: string;
  name: string;
  description: string | null;
  category: string;
  cash_price: number;
  duration_min: number;
}

export interface ReviewRow {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  provider_reply: string | null;
  created_at: string;
  patient: { display_name: string } | null;
}

export async function getProviders(filters?: {
  category?: string;
  city?: string;
  search?: string;
}): Promise<ProviderWithRating[]> {
  const supabase = await createClient();

  // Get active providers with their services
  let query = supabase
    .from("providers")
    .select(`
      id, slug, business_name, city, specialty, bio, address, zip, phone, website, npi, is_active, license_verified,
      services(cash_price),
      reviews(rating)
    `)
    .eq("is_active", true);

  if (filters?.city) {
    query = query.eq("city", filters.city);
  }

  if (filters?.search) {
    query = query.or(
      `business_name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error || !data) return [];

  let providers = data.map((p: any) => {
    const prices = (p.services || []).map((s: any) => s.cash_price).filter(Boolean);
    const ratings = (p.reviews || []).map((r: any) => r.rating).filter(Boolean);

    return {
      id: p.id,
      slug: p.slug,
      businessName: p.business_name,
      city: p.city,
      specialty: p.specialty,
      bio: p.bio || "",
      address: p.address || "",
      zip: p.zip || "",
      phone: p.phone || "",
      website: p.website || "",
      npi: p.npi || "",
      isActive: p.is_active,
      licenseVerified: p.license_verified,
      avgRating: ratings.length > 0 ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10 : 0,
      reviewCount: ratings.length,
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0,
      },
    };
  });

  // Filter by category via services
  if (filters?.category) {
    // Re-query with category filter since we need to check services
    const { data: catData } = await supabase
      .from("services")
      .select("provider_id")
      .eq("category", filters.category)
      .eq("is_active", true);

    if (catData) {
      const providerIds = new Set(catData.map((s: any) => s.provider_id));
      providers = providers.filter((p) => providerIds.has(p.id));
    }
  }

  return providers;
}

export async function getProviderBySlug(slug: string) {
  const supabase = await createClient();

  const { data: provider, error } = await supabase
    .from("providers")
    .select(`
      id, slug, business_name, city, specialty, bio, address, zip, phone, website, npi, is_active, license_verified
    `)
    .eq("slug", slug)
    .single();

  if (error || !provider) return null;

  // Get services
  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, category, cash_price, duration_min")
    .eq("provider_id", provider.id)
    .eq("is_active", true)
    .order("cash_price", { ascending: true });

  // Get reviews with patient names
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id, rating, title, body, provider_reply, created_at,
      patient:profiles!reviews_patient_id_fkey(display_name)
    `)
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  const ratings = (reviews || []).map((r: any) => r.rating);
  const avgRating = ratings.length > 0
    ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
    : 0;

  return {
    id: provider.id,
    slug: provider.slug,
    businessName: provider.business_name,
    city: provider.city,
    specialty: provider.specialty,
    bio: provider.bio || "",
    address: provider.address || "",
    zip: provider.zip || "",
    phone: provider.phone || "",
    website: provider.website || "",
    npi: provider.npi || "",
    isActive: provider.is_active,
    licenseVerified: provider.license_verified,
    avgRating,
    reviewCount: ratings.length,
    services: (services || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category,
      cashPrice: s.cash_price,
      durationMin: s.duration_min,
    })),
    reviews: (reviews || []).map((r: any) => ({
      id: r.id,
      patientName: r.patient?.display_name || "Anonymous",
      rating: r.rating,
      title: r.title || "",
      body: r.body || "",
      reply: r.provider_reply,
      date: new Date(r.created_at).toISOString().split("T")[0],
    })),
  };
}
