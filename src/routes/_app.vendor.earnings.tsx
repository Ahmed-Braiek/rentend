import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Wallet, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_app/vendor/earnings")({
  head: () => ({ meta: [{ title: "Earnings — Rented" }] }),
  component: VendorEarnings,
});

function VendorEarnings() {
  return (
    <div className="px-5 pt-6 pb-6 space-y-4">
      <header>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
          Vendor
        </div>
        <h1 className="text-2xl font-extrabold text-ink">Earnings</h1>
      </header>
      <div className="bg-primary text-white rounded-3xl p-5 shadow-sm">
        <div className="text-xs text-white/80 uppercase tracking-widest font-bold">
          This month
        </div>
        <div className="text-3xl font-extrabold mt-1">1,240 DT</div>
        <div className="flex items-center gap-1 text-xs text-white/80 mt-2">
          <TrendingUp size={12} /> +18% vs. April
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="In escrow" value="320 DT" icon={<ShieldCheck size={16} className="text-primary" />} />
        <StatCard label="Available" value="920 DT" icon={<Wallet size={16} className="text-primary" />} />
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="font-bold text-ink mb-2">Recent payouts</div>
        <ul className="divide-y divide-border">
          {[
            { label: "Bosch Hammer Drill — Yassine", amount: 60 },
            { label: 'MacBook Pro 14" — Salma', amount: 380 },
            { label: "Bosch Hammer Drill — Mehdi", amount: 75 },
          ].map((p) => (
            <li
              key={p.label}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <span className="text-ink">{p.label}</span>
              <span className="font-bold text-primary">+{p.amount} DT</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        Payouts settle to your D17 wallet every Friday.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-xl font-extrabold text-ink mt-1">{value}</div>
    </div>
  );
}
