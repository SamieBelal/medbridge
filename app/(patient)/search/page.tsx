import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProviderCard } from "@/components/shared/ProviderCard";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { getProviders } from "@/lib/queries/providers";

export const metadata = { title: "Find a Provider" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; city?: string }>;
}) {
  const params = await searchParams;
  const providers = await getProviders({
    search: params.q,
    category: params.category,
    city: params.city,
  });

  return (
    <div className="bg-cream min-h-screen">
      {/* Search Header */}
      <div className="bg-navy-deep text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Find a Provider</h1>
          <p className="text-white/70 mb-6">
            Browse verified cash-pay aesthetics providers in Dallas-Fort Worth
          </p>
          <form className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search by name, service, or city..."
                defaultValue={params.q}
                className="pl-10 bg-white text-charcoal h-11"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
            <a href="/search">
              <Badge
                variant={!params.category ? "secondary" : "outline"}
                className="cursor-pointer hover:bg-navy-deep hover:text-white transition-colors"
              >
                All Services
              </Badge>
            </a>
            {SERVICE_CATEGORIES.map((cat) => (
              <a key={cat.value} href={`/search?category=${cat.value}`}>
                <Badge
                  variant={params.category === cat.value ? "secondary" : "outline"}
                  className="cursor-pointer hover:bg-navy-deep hover:text-white transition-colors whitespace-nowrap"
                >
                  {cat.label}
                </Badge>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-charcoal">{providers.length}</span>{" "}
            provider{providers.length !== 1 ? "s" : ""} in DFW
          </p>
          <p className="text-sm text-muted-foreground">Sorted by relevance</p>
        </div>

        {providers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No providers found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.slug}
                slug={provider.slug}
                businessName={provider.businessName}
                city={provider.city}
                specialty={provider.specialty}
                bio={provider.bio}
                avgRating={provider.avgRating}
                reviewCount={provider.reviewCount}
                priceRange={provider.priceRange}
                isVerified={provider.licenseVerified}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
