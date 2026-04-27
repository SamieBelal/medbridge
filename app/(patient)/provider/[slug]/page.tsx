import Link from "next/link";
import { MapPin, Phone, Globe, CheckCircle2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/shared/StarRating";
import { ServiceTable } from "@/components/shared/ServiceTable";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getProviderBySlug } from "@/lib/queries/providers";

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-navy-deep text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{provider.businessName}</h1>
                {provider.licenseVerified && (
                  <CheckCircle2 className="h-6 w-6 text-amber-warm" />
                )}
              </div>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {provider.city}, TX
                </span>
                <StarRating
                  rating={provider.avgRating}
                  count={provider.reviewCount}
                  size="md"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/book/${slug}`}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-amber-warm hover:bg-amber-warm/90 text-white"
                )}
              >
                Book Now
              </Link>
              <Link
                href={`/eligibility?provider=${slug}`}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/30 text-white hover:bg-white/10"
                )}
              >
                Check My Insurance
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-3">
                  About
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {provider.bio}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            {provider.services.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-charcoal mb-4">
                  Services & Pricing
                </h2>
                <ServiceTable
                  services={provider.services}
                  providerSlug={slug}
                />
              </div>
            )}

            {/* Reviews */}
            {provider.reviews.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-charcoal mb-4">
                  Patient Reviews ({provider.reviewCount})
                </h2>
                <div className="space-y-4">
                  {provider.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-charcoal">
                              {review.patientName}
                            </span>
                            <StarRating rating={review.rating} />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="font-medium text-sm text-charcoal mb-1">
                            {review.title}
                          </h4>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {review.body}
                        </p>
                        {review.reply && (
                          <div className="mt-3 ml-4 pl-4 border-l-2 border-navy-deep/20">
                            <p className="text-xs font-semibold text-navy-deep mb-1">
                              Provider Response
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {review.reply}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-charcoal">Contact</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>
                      {provider.address}, {provider.city}, TX {provider.zip}
                    </span>
                  </div>
                  {provider.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{provider.phone}</span>
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4 shrink-0" />
                      <span>{provider.website}</span>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-charcoal">Credentials</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-navy-deep" />
                    <span>NPI: {provider.npi}</span>
                  </div>
                  {provider.licenseVerified && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>NPDB Verified</span>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-charcoal">
                    Accepted Payment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Credit/Debit</Badge>
                    <Badge variant="secondary">HSA</Badge>
                    <Badge variant="secondary">FSA</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
