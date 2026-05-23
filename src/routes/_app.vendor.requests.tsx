import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { useApp } from "@/lib/store";
import { getListing } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/vendor/requests")({
  head: () => ({ meta: [{ title: "Requests — Rented" }] }),
  component: VendorRequests,
});

function VendorRequests() {
  const navigate = useNavigate();
  const currentUser = useApp((s) => s.currentUser);
  const allRentals = useApp((s) => s.rentals);
  const requests = allRentals.filter((r) => r.vendorId === currentUser.id);
  const acceptRental = useApp((s) => s.acceptRental);
  const rejectRental = useApp((s) => s.rejectRental);
  const requireVerification = useApp((s) => s.requireVerification);

  return (
    <div className="px-5 pt-6 pb-6 space-y-3">
      <header>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
          Vendor
        </div>
        <h1 className="text-2xl font-extrabold text-ink">Requests</h1>
      </header>
      {requests.length === 0 && (
        <div className="bg-card border border-dashed border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
          No requests yet. New rental requests will appear here.
        </div>
      )}
      {requests.map((r) => {
        const listing = getListing(r.listingId);
        return (
          <div
            key={r.id}
            className="bg-card border border-border rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                ?
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-ink truncate">
                  User {r.buyerId}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  wants to rent · {listing?.title ?? r.listingId}
                </div>
              </div>
              <StatusPill status={r.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-secondary rounded-xl p-2.5">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={11} /> Dates
                </div>
                <div className="font-semibold text-ink mt-0.5">
                  {r.startDate} → {r.endDate}
                </div>
              </div>
              <div className="bg-secondary rounded-xl p-2.5">
                <div className="text-muted-foreground">Offer</div>
                <div className="font-bold text-primary mt-0.5">
                  {r.offerPrice} DT
                </div>
              </div>
            </div>

            {r.status !== "accepted" && r.status !== "rejected" && r.status !== "expired" && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => rejectRental(r.id)}
                  className="border border-border rounded-full py-2 text-sm font-semibold text-muted-foreground"
                >
                  Decline
                </button>
                <Link
                  to="/thread/$requestId"
                  params={{ requestId: r.id }}
                  className="border border-primary text-primary rounded-full py-2 text-sm font-semibold text-center"
                >
                  Counter
                </Link>
                <button
                  onClick={async () => {
                    const ok = requireVerification("You must verify your identity to accept rentals.");
                    if (ok) {
                      await acceptRental(r.id);
                      navigate({ to: "/contract/$id", params: { id: r.listingId } });
                    }
                  }}
                  className="bg-primary text-white rounded-full py-2 text-sm font-semibold"
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-secondary text-ink",
    negotiating: "bg-accent text-primary-dark",
    accepted: "bg-primary text-white",
    rejected: "bg-secondary text-muted-foreground line-through",
    expired: "bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
        map[status] ?? "bg-secondary text-ink"
      }`}
    >
      {status}
    </span>
  );
}
