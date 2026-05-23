import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useApp, type DeliveryState } from "@/lib/store";
import { DeliveryStepper } from "@/components/DeliveryStepper";
import { courier, getListing } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/delivery/$rentalId")({
  head: () => ({ meta: [{ title: "Track delivery — Rented" }] }),
  component: Delivery,
});

const SEQUENCE: DeliveryState[] = [
  "vendor_preparing",
  "courier_assigned",
  "picked_up",
  "in_transit",
  "delivered",
];

function Delivery() {
  const { rentalId } = Route.useParams();
  const allRentals = useApp((s) => s.rentals);
  const currentUser = useApp((s) => s.currentUser);
  const rental = allRentals.find((r) => r.id === rentalId);
  const setState = useApp((s) => s.updateDeliveryState);

  const state = rental?.deliveryState ?? "vendor_preparing";

  useEffect(() => {
    if (!rental) return;
    const current = rental.deliveryState;
    const idx = SEQUENCE.indexOf(current);
    if (idx < 0 || idx >= SEQUENCE.length - 1) return;
    const t = setTimeout(() => setState(rentalId, SEQUENCE[idx + 1]!), 4000);
    return () => clearTimeout(t);
  }, [rental?.deliveryState, rentalId, setState, rental]);

  return (
    <div className="pb-10">
      <header className="flex items-center gap-3 p-5">
        <Link
          to={currentUser.activeMode === "vendor" ? "/vendor/requests" : "/rentals"}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-extrabold">Track delivery</h1>
      </header>

      <div className="px-5 space-y-5">
        <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={courier.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-bold text-ink">{courier.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin size={11} /> ETA {courier.eta}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-primary" />
          Funds held in escrow until pickup is confirmed.
        </div>

        {rental?.insuranceState === "pending_recording" && (
          <div className="bg-accent border border-primary/20 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ink text-sm">Insurance required</div>
              <div className="text-xs text-muted-foreground">Record condition before handover</div>
            </div>
            <Link 
              to="/insurance/record/$rentalId"
              params={{ rentalId: rental.id }}
              className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow"
            >
              Record
            </Link>
          </div>
        )}

        {rental?.insuranceState === "submitted_for_validation" && (
          <div className="bg-accent border border-primary/20 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ink text-sm">Video submitted</div>
              <div className="text-xs text-muted-foreground">Validate item condition</div>
            </div>
            <Link 
              to="/insurance/validation/$rentalId"
              params={{ rentalId: rental.id }}
              className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow"
            >
              Review
            </Link>
          </div>
        )}

        {rental?.insuranceState === "approved" && (
          <div className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheck size={16} className="text-green-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink">Insurance active</div>
              <div className="text-xs text-muted-foreground">Condition verified by both parties</div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <DeliveryStepper current={state} />
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          This demo advances automatically every few seconds.
        </p>

        {/* Other Active Deliveries Section */}
        {(() => {
          const activeDeliveries = allRentals.filter(r => 
            (r.vendorId === currentUser.id || r.buyerId === currentUser.id) && 
            r.status === "accepted" && 
            r.deliveryState !== "delivered" &&
            r.id !== rentalId
          );

          if (activeDeliveries.length === 0) return null;

          return (
            <div className="mt-8 pt-6 border-t border-border">
              <h2 className="text-sm font-extrabold text-ink mb-4 uppercase tracking-widest text-muted-foreground">Other Deliveries</h2>
              <div className="space-y-4">
                {activeDeliveries.map(r => {
                  const l = getListing(r.listingId);
                  const isPendingInsurance = r.vendorId === currentUser.id && r.insuranceState === "pending_recording";
                  
                  return (
                    <div key={r.id} className="bg-white border border-border rounded-3xl p-4 shadow-sm flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <img src={l?.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <div className="font-bold text-ink text-sm">{l?.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {r.deliveryState.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                          </div>
                        </div>
                        <Link 
                          to="/delivery/$rentalId" 
                          params={{ rentalId: r.id }} 
                          className="bg-secondary text-ink px-4 py-2 rounded-full text-xs font-bold shadow-sm"
                        >
                          Track
                        </Link>
                      </div>

                      {isPendingInsurance && (
                        <div className="bg-accent rounded-2xl p-3 flex items-center justify-between border border-primary/20">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-primary" />
                            <div className="text-xs font-bold text-ink">Action Required</div>
                          </div>
                          <Link 
                            to="/insurance/record/$rentalId" 
                            params={{ rentalId: r.id }} 
                            className="bg-primary text-white text-[11px] font-bold px-4 py-2 rounded-full shadow-sm hover:scale-[1.02] transition-transform"
                          >
                            Record Video
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
