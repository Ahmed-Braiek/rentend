import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Smartphone, Wallet, Banknote, ShieldCheck } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { useMemo } from "react";
import { getListing } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/payment/$id")({
  head: () => ({ meta: [{ title: "Payment — Rented" }] }),
  component: Payment,
});

const methods: { id: string; label: string; sub: string; icon: any }[] = [
  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard", icon: CreditCard },
  { id: "d17", label: "D17", sub: "Pay with La Poste Tunisienne", icon: Smartphone },
  { id: "flouci", label: "Flouci", sub: "Instant mobile wallet", icon: Wallet },
  { id: "cash", label: "Cash on pickup", sub: "Escrow waived — at your risk", icon: Banknote },
];

function Payment() {
  const { id } = Route.useParams();
  const listing = getListing(id)!;
  const navigate = useNavigate();
  const draft = useApp((s) => s.draft);
  const updateDraft = useApp((s) => s.updateDraft);
  const createRentalRequest = useApp((s) => s.createRentalRequest);

  const total = useMemo(() => {
    const days = Math.max(
      1,
      differenceInCalendarDays(new Date(draft.endDate || Date.now()), new Date(draft.startDate || Date.now()))
    );
    const base = listing.pricePerDay * days;
    const delivery = draft.delivery === "delivery" ? 10 : 0;
    const insurance = Math.round(base * 0.08);
    return base + delivery + insurance;
  }, [draft, listing]);

  const pay = async () => {
    if (!draft.paymentMethod) return;
    await createRentalRequest(listing.id, listing.vendorId, draft.startDate, draft.endDate, listing.pricePerDay);
    navigate({ to: "/success" });
  };

  return (
    <div className="pb-24">
      <header className="flex items-center gap-3 p-5">
        <Link to="/contract/$id" params={{ id }} className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-extrabold">Secure payment</h1>
      </header>

      <div className="px-5 space-y-5">
        <div className="bg-accent border border-primary/30 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-primary-dark">Funds held in escrow</div>
            <div className="text-xs text-primary-dark/80 mt-1">
              Your payment is released to the lender only after you confirm the return.
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {methods.map((m) => {
            const Icon = m.icon;
            const active = draft.paymentMethod === m.id;
            return (
              <button
                key={m.id}
                onClick={() => updateDraft({ paymentMethod: m.id })}
                className={`w-full border rounded-2xl p-4 flex items-center gap-3 text-left transition ${
                  active ? "border-primary bg-accent" : "border-border bg-card"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-primary text-white" : "bg-secondary text-ink"}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-ink">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.sub}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`} />
              </button>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Amount due</span>
          <span className="text-xl font-extrabold text-ink">{total} DT</span>
        </div>

        <button
          disabled={!draft.paymentMethod}
          onClick={pay}
          className="w-full bg-primary text-white rounded-full py-4 font-bold disabled:opacity-40"
        >
          Pay {total} DT
        </button>
      </div>
    </div>
  );
}
