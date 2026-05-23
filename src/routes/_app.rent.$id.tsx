import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Truck, MapPin } from "lucide-react";
import { useMemo } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { getListing } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/rent/$id")({
  head: () => ({ meta: [{ title: "Request rental — Rented" }] }),
  component: Rent,
});

function Rent() {
  const { id } = Route.useParams();
  const listing = getListing(id)!;
  const navigate = useNavigate();
  const draft = useApp((s) => s.draft);
  const updateDraft = useApp((s) => s.updateDraft);

  const today = format(new Date(), "yyyy-MM-dd");
  const start = draft.startDate ?? today;
  const end = draft.endDate ?? format(new Date(Date.now() + 2 * 86400000), "yyyy-MM-dd");

  const days = useMemo(() => {
    const d = differenceInCalendarDays(new Date(end), new Date(start));
    return Math.max(1, d);
  }, [start, end]);

  const base = listing.pricePerDay * days;
  const deliveryFee = draft.delivery === "delivery" ? 10 : 0;
  const insurance = Math.round(base * 0.08);
  const total = base + deliveryFee + insurance;

  const requireVerification = useApp((s) => s.requireVerification);

  const submit = () => {
    requireVerification("You must verify your identity to request a rental.", () => {
      updateDraft({ startDate: start, endDate: end });
      navigate({ to: "/contract/$id", params: { id } });
    });
  };

  return (
    <div className="pb-32">
      <header className="flex items-center gap-3 p-5">
        <Link to="/item/$id" params={{ id }} className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-extrabold">Request rental</h1>
      </header>

      <div className="px-5 space-y-5">
        <div className="bg-secondary rounded-2xl p-4 flex gap-3 items-center">
          <img src={listing.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="font-bold text-ink">{listing.title}</div>
            <div className="text-primary text-sm font-semibold">{listing.pricePerDay} DT / Day</div>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-ink">Rental dates</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">Start</div>
              <input
                type="date"
                value={start}
                onChange={(e) => updateDraft({ startDate: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">End</div>
              <input
                type="date"
                value={end}
                onChange={(e) => updateDraft({ endDate: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-ink">Purpose of use</label>
          <textarea
            value={draft.purpose}
            onChange={(e) => updateDraft({ purpose: e.target.value })}
            placeholder="e.g. weekend photo shoot in Sidi Bou Said"
            rows={3}
            className="mt-2 w-full border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-ink">Delivery</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              onClick={() => updateDraft({ delivery: "pickup" })}
              className={`border rounded-2xl p-3 text-left ${draft.delivery === "pickup" ? "border-primary bg-accent" : "border-border bg-card"}`}
            >
              <MapPin size={18} className="text-primary" />
              <div className="font-semibold mt-2 text-sm">Pickup</div>
              <div className="text-[11px] text-muted-foreground">Free</div>
            </button>
            <button
              onClick={() => updateDraft({ delivery: "delivery" })}
              className={`border rounded-2xl p-3 text-left ${draft.delivery === "delivery" ? "border-primary bg-accent" : "border-border bg-card"}`}
            >
              <Truck size={18} className="text-primary" />
              <div className="font-semibold mt-2 text-sm">Courier</div>
              <div className="text-[11px] text-muted-foreground">+10 DT</div>
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 space-y-2 text-sm">
          <Row label={`Base · ${days} day${days > 1 ? "s" : ""}`} value={`${base} DT`} />
          <Row label="Delivery" value={`${deliveryFee} DT`} />
          <Row label="Insurance (8%)" value={`${insurance} DT`} />
          <div className="border-t border-border pt-2 flex items-center justify-between font-extrabold text-ink">
            <span>Total</span>
            <span>{total} DT</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-primary" />
          Funds are escrowed until the rental is completed and returned.
        </div>
      </div>

      <div className="fixed bottom-[72px] left-0 right-0 px-4 pb-3 pt-3 bg-gradient-to-t from-card to-card/0">
        <div className="max-w-[440px] mx-auto">
          <button onClick={submit} className="w-full bg-primary text-white rounded-full py-4 font-bold shadow-lg">
            Send Offer
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
