import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/success")({
  head: () => ({ meta: [{ title: "Rental confirmed — Rented" }] }),
  component: Success,
});

function Success() {
  const activeMode = useApp((s) => s.currentUser.activeMode);
  const rentals = useApp((s) => s?.rentals?.filter(r => 
    activeMode === "vendor" ? r?.vendorId === s?.currentUser?.id : r?.buyerId === s?.currentUser?.id
  ) || []);
  const rentalId = rentals.length > 0 ? rentals[0].id : "r-demo";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
        <CheckCircle2 size={48} className="text-primary" />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold text-ink">You're all set!</h1>
      <p className="mt-2 text-muted-foreground max-w-xs">
        Your rental request is confirmed. The other party will be notified and the
        funds are safely held in escrow.
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck size={14} className="text-primary" />
        Reference #RNT-{Math.random().toString(36).slice(2, 8).toUpperCase()}
      </div>
      <div className="mt-10 w-full max-w-xs space-y-3">
        <Link
          to="/delivery/$rentalId"
          params={{ rentalId }}
          className="w-full inline-flex items-center justify-center gap-2 border border-primary text-primary rounded-full py-3 font-semibold"
        >
          <Truck size={16} /> Track delivery
        </Link>
        <Link
          to="/home"
          className="w-full inline-flex items-center justify-center bg-primary text-white rounded-full py-3.5 font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
