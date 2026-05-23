import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Truck, ShieldCheck, ChevronRight, Clock } from "lucide-react";
import { getListing } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/rentals")({
  head: () => ({ meta: [{ title: "My rentals — Rented" }] }),
  component: BuyerRentals,
});

// We surface anything the buyer has interacted with through the demo:
// the current draft + any tracked deliveries seeded for them.
function BuyerRentals() {
  const currentUser = useApp((s) => s.currentUser);
  const allRentals = useApp((s) => s.rentals);
  const rentals = allRentals.filter(r => r.buyerId === currentUser.id && r.status === "accepted" && r.deliveryState !== "delivered");
  const trackedIds = rentals.map(r => r.id);

  const active = trackedIds.length > 0;
  const draft = useApp((s) => s.draft);
  const hasDraft = !!draft.listingId;

  return (
    <div className="p-5 pb-8 space-y-5">
      <header>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
          Buyer
        </div>
        <h1 className="text-2xl font-extrabold text-ink">My rentals</h1>
      </header>

      <section>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Active
        </h2>
        {active ? (
          <div className="space-y-3">
            {rentals.map((r) => {
              const listing = getListing(r.listingId);
              return (
                <Link
                  key={r.id}
                  to="/delivery/$rentalId"
                  params={{ rentalId: r.id }}
                  className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3"
                >
                  {listing && (
                    <img
                      src={listing.image}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-ink text-sm">
                      {listing?.title ?? r.id}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Truck size={12} className="text-primary" />
                      {prettyState(r.deliveryState)}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyCard
            icon={<Package size={22} className="text-primary" />}
            title="No active rentals"
            body="Once you confirm a rental you'll track delivery, contract, and return here."
            cta={{ to: "/home", label: "Browse rentals" }}
          />
        )}
      </section>

      {hasDraft && (
        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
            In progress
          </h2>
          <Link
            to="/rent/$id"
            params={{ id: draft.listingId! }}
            className="flex items-center gap-3 bg-accent border border-primary/20 rounded-2xl p-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-ink text-sm">
                Resume rental request
              </div>
              <div className="text-xs text-muted-foreground">
                Pick up where you left off
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
        </section>
      )}

      <section className="bg-primary-dark text-white rounded-3xl p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold">
          <ShieldCheck size={14} /> Protection
        </div>
        <h3 className="mt-1 text-lg font-extrabold">
          Every rental is covered.
        </h3>
        <p className="mt-1 text-sm text-white/80">
          Escrowed payments, digital contracts, and damage insurance — included
          on every booking.
        </p>
      </section>
    </div>
  );
}

function EmptyCard({
  icon,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta?: { to: "/home"; label: string };
}) {
  return (
    <div className="bg-card border border-dashed border-border rounded-2xl p-6 text-center">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-accent flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-3 font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-4 inline-flex items-center justify-center bg-primary text-white rounded-full px-4 py-2 text-sm font-semibold"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

function prettyState(s: string) {
  return s
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
