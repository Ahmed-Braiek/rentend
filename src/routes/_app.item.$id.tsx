import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search, Share2, MoreVertical, Star, Heart, ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { getListing, getVendor, reviews } from "@/lib/mock-data";
import { TrustBadge } from "@/components/TrustBadge";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/item/$id")({
  head: ({ params }) => {
    const l = getListing(params.id);
    return { meta: [{ title: `${l?.title ?? "Item"} — Rented` }] };
  },
  component: Item,
  notFoundComponent: () => <div className="p-8 text-center">Item not found.</div>,
});

function Item() {
  const { id } = Route.useParams();
  const listing = getListing(id);
  const navigate = useNavigate();
  const startDraft = useApp((s) => s.startDraft);

  if (!listing) return <div className="p-8">Not found</div>;
  const vendor = getVendor(listing.vendorId);

  const startRent = () => {
    startDraft(listing.id);
    navigate({ to: "/rent/$id", params: { id: listing.id } });
  };

  return (
    <div className="relative pb-32">
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-2">
        <Link to="/home" className="bg-card w-10 h-10 rounded-full flex items-center justify-center shadow">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 bg-card rounded-full px-4 py-2.5 flex items-center gap-2 shadow">
          <Search size={16} className="text-muted-foreground" />
          <input placeholder="Search" className="bg-transparent text-sm flex-1 focus:outline-none" />
        </div>
        <button className="bg-card w-10 h-10 rounded-full flex items-center justify-center shadow">
          <Share2 size={16} />
        </button>
        <button className="bg-card w-10 h-10 rounded-full flex items-center justify-center shadow">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Gallery */}
      <div className="relative h-[360px] bg-secondary">
        <img src={listing.gallery[0]} alt={listing.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 right-4 bg-ink/70 text-white text-xs px-2 py-1 rounded">
          1/{listing.gallery.length}
        </div>
      </div>

      {/* Body */}
      <div className="bg-card rounded-t-3xl -mt-6 relative z-10 p-5 space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{listing.title}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-primary font-bold">{listing.pricePerDay} DT / Day</span>
            <span className="flex items-center gap-1 text-sm">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{listing.rating}</span>
              <span className="text-muted-foreground">Ratings</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/insurance">
            <TrustBadge icon={ShieldCheck} label="Insured rental" />
          </Link>
          <TrustBadge icon={BadgeCheck} label="Escrow protected" />
          {listing.delivery && <TrustBadge icon={Truck} label="Delivery available" />}
        </div>

        <Link to="/profile" className="block">
          <div className="text-sm font-bold text-ink mb-2">Lender</div>
          <div className="flex items-center gap-3">
            <img src={vendor.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-ink">
                {vendor.name}
                {vendor.verified && <BadgeCheck size={14} className="text-primary fill-primary text-white" />}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                {vendor.rating} Ratings · {vendor.city}
              </div>
            </div>
          </div>
        </Link>

        <div>
          <div className="text-sm font-bold text-ink mb-1.5">Description</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-ink">What people say</div>
            <button className="text-primary text-xs font-semibold">view all reviews</button>
          </div>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-secondary rounded-2xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-ink">{r.author}</div>
                      <div className="text-[11px] text-muted-foreground">{r.date}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-[72px] left-0 right-0 z-30 px-4 pb-3 pt-3 bg-gradient-to-t from-card via-card to-card/0">
        <div className="max-w-[440px] mx-auto flex items-center gap-3">
          <button className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center">
            <Heart size={18} />
          </button>
          <button
            onClick={startRent}
            className="flex-1 bg-primary text-white rounded-full py-4 font-bold shadow-lg"
          >
            Quick Rent
          </button>
        </div>
      </div>
    </div>
  );
}
