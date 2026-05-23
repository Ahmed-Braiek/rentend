import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Camera, AlertCircle, Clock } from "lucide-react";
import { useApp } from "@/lib/store";
import { getListing, users } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/insurance/")({
  head: () => ({
    meta: [
      { title: "Upcoming Pickups — Rented" },
    ],
  }),
  component: UpcomingPickups,
});

function UpcomingPickups() {
  const navigate = useNavigate();
  const allRentals = useApp((s) => s.rentals);
  const currentUser = useApp((s) => s.currentUser);
  
  // Get rentals that are upcoming or pending recording
  const upcomingPickups = allRentals.filter(r => 
    r.vendorId === currentUser.id && 
    (r.insuranceState === "pending_recording" || r.deliveryState === "vendor_preparing")
  );

  return (
    <div className="min-h-screen bg-card pb-10">
      <header className="flex items-center gap-3 p-5 border-b border-border bg-white">
        <button
          onClick={() => navigate({ to: "/home" })}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-extrabold text-ink">Upcoming Pickups</h1>
      </header>

      <div className="p-5">
        <div className="bg-green-50 border border-green-200 rounded-3xl p-5 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheck className="text-green-600" size={20} />
            </div>
            <div className="font-extrabold text-ink text-lg">Insurance & Verification</div>
          </div>
          <p className="text-sm text-green-800/80 mb-4 leading-relaxed">
            Protect your items. All pickups require a quick video verification before handing over the item.
          </p>
          <button
            onClick={() => navigate({ to: "/insurance/record/$rentalId", params: { rentalId: "demo" } })}
            className="w-full bg-white text-green-700 border border-green-200 rounded-full py-3 font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-green-50 transition"
          >
            <Camera size={18} /> Test Flow (Demo)
          </button>
        </div>

        <h2 className="font-bold text-ink mb-4 text-sm uppercase tracking-widest text-muted-foreground">Action Required</h2>

        {upcomingPickups.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-muted-foreground" />
            </div>
            <div className="font-bold text-ink">No upcoming pickups</div>
            <div className="text-sm text-muted-foreground mt-1">You're all caught up!</div>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingPickups.map(rental => {
              const listing = getListing(rental.listingId);
              const renter = users[rental.renterId];
              return (
                <div key={rental.id} className="bg-white border border-border rounded-3xl p-4 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={listing?.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="font-bold text-ink">{listing?.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock size={12} /> Pickup tomorrow
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-accent rounded-2xl p-3 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img src={renter?.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-semibold text-ink">Renter: {renter?.name}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-muted-foreground">
                      {rental.insuranceCode || "DX-902"}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate({ to: "/insurance/record/$rentalId", params: { rentalId: rental.id } })}
                    className="w-full bg-primary text-white rounded-full py-3.5 font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <Camera size={18} /> Record Condition
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Ensure CheckCircle2 is available if used in empty state
import { CheckCircle2 } from "lucide-react";
