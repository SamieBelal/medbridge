import Link from "next/link";
import { MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { formatCurrency, cn } from "@/lib/utils";

interface ProviderCardProps {
  slug: string;
  businessName: string;
  city: string;
  specialty: string;
  bio: string;
  avgRating: number;
  reviewCount: number;
  priceRange: { min: number; max: number };
  isVerified: boolean;
}

export function ProviderCard({
  slug,
  businessName,
  city,
  specialty,
  bio,
  avgRating,
  reviewCount,
  priceRange,
  isVerified,
}: ProviderCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-charcoal truncate">{businessName}</h3>
              {isVerified && (
                <CheckCircle2 className="h-4 w-4 text-navy-deep shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>{city}, TX</span>
            </div>
            <StarRating rating={avgRating} count={reviewCount} />
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{bio}</p>
          </div>
          <div className="text-right shrink-0">
            <Badge variant="secondary" className="mb-2 capitalize">
              {specialty}
            </Badge>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-lg font-bold text-success">
              {formatCurrency(priceRange.min)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/provider/${slug}`}
            className={cn(buttonVariants({ size: "sm" }), "flex-1 bg-navy-deep hover:bg-navy-light text-white")}
          >
            View Profile
          </Link>
          <Link
            href={`/book/${slug}`}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "flex-1")}
          >
            Book Now
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
