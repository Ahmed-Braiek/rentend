import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet,
  Inbox,
  Package,
  TrendingUp,
  ShieldCheck,
  Plus,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { getListing } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/vendor/")({
  head: () => ({ meta: [{ title: "Vendor dashboard — Rented" }] }),
  component: VendorDashboard,
});

function VendorDashboard() {
  const currentUser = useApp((s) => s.currentUser);
  const listings = useApp((s) => s.myListings);
  const allRentals = useApp((s) => s.rentals);
  const rentals = allRentals.filter((r) => r.vendorId === currentUser.id);

  const pending = rentals.filter(
    (r) => r.status === "pending" || r.status === "negotiating"
  );
  
  const activeRentals = rentals.filter(r => r.status === "accepted").map(r => r.id);
  const monthEarnings = 1240; // mock — would derive from accepted requests
  const totalViews = listings.reduce((sum: number, l: any) => sum + l.views, 0);

  return (
    <div className="p-5 pb-8 space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
            Vendor
          </div>
          <h1 className="text-2xl font-extrabold text-ink">Dashboard</h1>
        </div>
        <Link
          to="/vendor/new"
          className="inline-flex items-center gap-1.5 bg-primary text-white rounded-full px-3.5 py-2 text-xs font-semibold shadow-sm"
        >
          <Plus size={14} /> New listing
        </Link>
      </header>

      {/* Earnings hero */}
      <Link
        to="/vendor/earnings"
        className="block bg-primary-dark text-white rounded-3xl p-5 relative overflow-hidden"
      >
        <div className="text-xs uppercase tracking-widest text-primary font-bold">
          This month
        </div>
        <div className="mt-2 text-4xl font-extrabold">
          {monthEarnings.toLocaleString()}{" "}
          <span className="text-base font-semibold opacity-80">DT</span>
        </div>
        <div className="mt-1 text-sm text-white/80 flex items-center gap-1">
          <TrendingUp size={13} className="text-primary" /> +18% vs. last month
        </div>
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
          View earnings <ArrowRight size={14} />
        </div>
      </Link>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <Kpi
          icon={<Inbox size={16} className="text-primary" />}
          value={pending.length.toString()}
          label="Pending"
        />
        <Kpi
          icon={<Package size={16} className="text-primary" />}
          value={listings.filter((l: any) => l.active).length.toString()}
          label="Listings"
        />
        <Kpi
          icon={<TrendingUp size={16} className="text-primary" />}
          value={totalViews.toString()}
          label="Views"
        />
      </div>

      {/* Pending requests */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-ink">Pending requests</h2>
          <Link
            to="/vendor/requests"
            className="text-primary text-xs font-semibold"
          >
            View all
          </Link>
        </div>
        {pending.length === 0 ? (
          <EmptyRow body="No pending requests right now." />
        ) : (
          <div className="space-y-2">
            {pending.slice(0, 3).map((r) => {
              const l = getListing(r.listingId);
              return (
                <Link
                  key={r.id}
                  to="/thread/$requestId"
                  params={{ requestId: r.id }}
                  className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3"
                >
                  {l && (
                    <img
                      src={l.image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-ink text-sm">
                      {l?.title ?? r.listingId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      User {r.buyerId} · {r.offerPrice} DT
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {r.status}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Active deliveries */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-ink">Active deliveries</h2>
        </div>
        {activeRentals.length === 0 ? (
          <EmptyRow body="No active deliveries. Accept a request to get started." />
        ) : (
          <div className="space-y-2">
            {activeRentals.slice(0, 3).map((id) => (
              <Link
                key={id}
                to="/delivery/$rentalId"
                params={{ rentalId: id }}
                className="flex items-center justify-between bg-card border border-border rounded-2xl p-3 text-sm font-semibold text-ink"
              >
                <span>{getListing(id)?.title ?? id}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Insurance reminder */}
      <Link
        to="/insurance"
        className="flex items-center gap-3 bg-accent border border-primary/20 rounded-2xl p-4"
      >
        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
          <ShieldCheck size={18} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-ink text-sm">Insurance check-in</div>
          <div className="text-xs text-muted-foreground">
            Record condition before every hand-off.
          </div>
        </div>
        <ChevronRight size={16} className="text-muted-foreground" />
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <QuickAction to="/vendor/listings" icon={<Package size={16} />} label="Listings" />
        <QuickAction to="/vendor/earnings" icon={<Wallet size={16} />} label="Earnings" />
      </div>
    </div>
  );
}

function Kpi({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 text-center">
      <div className="flex justify-center">{icon}</div>
      <div className="mt-1 font-extrabold text-ink">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  label,
}: {
  to: "/vendor/listings" | "/vendor/earnings";
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 bg-card border border-border rounded-2xl p-4 text-sm font-semibold text-ink"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </Link>
  );
}

function EmptyRow({ body }: { body: string }) {
  return (
    <div className="bg-card border border-dashed border-border rounded-2xl p-4 text-sm text-muted-foreground text-center">
      {body}
    </div>
  );
}
