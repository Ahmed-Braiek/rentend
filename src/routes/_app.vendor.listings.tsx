import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Eye, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/vendor/listings")({
  head: () => ({ meta: [{ title: "My listings — Rented" }] }),
  component: VendorListings,
});

function VendorListings() {
  const listings = useApp((s) => s.myListings);
  const verified = useApp((s) => s.currentUser.verificationStatus) === "verified";

  return (
    <div className="px-5 pt-6 pb-6 space-y-4">
      <header>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
          Vendor
        </div>
        <h1 className="text-2xl font-extrabold text-ink">My listings</h1>
      </header>
      <Link
        to="/vendor/new"
        className="w-full flex items-center justify-between gap-3 bg-primary text-white rounded-2xl p-4 shadow-sm"
      >
        <div>
          <div className="font-bold">New listing</div>
          <div className="text-xs text-white/80">Add an item people can rent</div>
        </div>
        <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <Plus size={18} />
        </span>
      </Link>

      {!verified && (
        <div className="bg-accent border border-primary/20 rounded-2xl p-3 flex items-center gap-2 text-xs text-primary-dark">
          <ShieldCheck size={14} className="text-primary" />
          Get verified to publish high-value items.
          <Link to="/verify" className="ml-auto font-bold underline">
            Verify
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {listings.map((l) => (
          <div
            key={l.id}
            className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3 shadow-sm"
          >
            <img
              src={l.image}
              alt=""
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink truncate">{l.title}</div>
              <div className="text-primary text-sm font-semibold">
                {l.pricePerDay} DT / Day
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                <Eye size={11} />
                {l.views} views
              </div>
            </div>
            <span
              className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
                l.active
                  ? "bg-accent text-primary-dark"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {l.active ? "Live" : "Paused"}
            </span>
          </div>
        ))}
        {listings.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-10">
            No listings yet — tap “New listing”.
          </div>
        )}
      </div>
    </div>
  );
}
