import { Link } from "@tanstack/react-router";
import { Star, MapPin, Heart } from "lucide-react";
import type { Listing } from "@/lib/mock-data";

export function ListingCard({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  return (
    <Link
      to="/item/$id"
      params={{ id: listing.id }}
      className="block shrink-0 bg-card rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-border/60"
      style={{ width: compact ? 160 : "100%" }}
    >
      <div className="relative">
        <img src={listing.image} alt={listing.title} className="w-full h-28 object-cover" />
        <div className="absolute top-2 left-2 bg-card/95 rounded-md px-1.5 py-0.5 flex items-center gap-1 text-xs font-semibold">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          {listing.rating}
        </div>
        <button className="absolute top-2 right-2 bg-card/90 rounded-full p-1.5">
          <Heart size={14} className="text-muted-foreground" />
        </button>
      </div>
      <div className="p-2.5">
        <div className="text-sm font-semibold text-ink truncate">{listing.title}</div>
        <div className="text-primary text-xs font-bold mt-0.5">{listing.pricePerDay} DT / Day</div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
          <MapPin size={10} />
          {listing.distanceKm} km away
        </div>
      </div>
    </Link>
  );
}
