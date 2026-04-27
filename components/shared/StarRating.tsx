import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, count, size = "sm" }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => (
          <Star
            key={star}
            className={cn(
              iconSize,
              star <= Math.round(rating)
                ? "fill-amber-warm text-amber-warm"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className={cn("font-medium", size === "sm" ? "text-xs" : "text-sm")}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          ({count})
        </span>
      )}
    </div>
  );
}
