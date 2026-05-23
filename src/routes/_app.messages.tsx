import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Tag } from "lucide-react";
import { useApp } from "@/lib/store";
import { getListing } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/messages")({
  head: () => ({ meta: [{ title: "Conversations — Rented" }] }),
  component: Messages,
});

function Messages() {
  const currentUser = useApp((s) => s.currentUser);
  const allRentals = useApp((s) => s.rentals);
  const rentals = allRentals.filter(r => r.buyerId === currentUser.id || r.vendorId === currentUser.id);

  const items = rentals.map((r) => {
    const t = r.thread ?? [];
    const last = t[t.length - 1];
    return { request: r, lastMessage: last as typeof last | undefined };
  });

  return (
    <div className="pb-6">
      <header className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-extrabold text-ink">Conversations</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Negotiate dates and price with lenders.
        </p>
      </header>

      <ul className="divide-y divide-border">
        {items.map(({ request, lastMessage }) => {
          const listing = getListing(request.listingId);
          return (
            <li key={request.id}>
              <Link
                to="/thread/$requestId"
                params={{ requestId: request.id }}
                className="flex items-center gap-3 px-5 py-4 hover:bg-secondary/50"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold">
                  ?
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-ink truncate">
                      User {request.buyerId === currentUser.id ? request.vendorId : request.buyerId}
                    </div>
                    {lastMessage && (
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(lastMessage.ts), {
                          addSuffix: false,
                        })}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    {lastMessage?.type === "offer" ? (
                      <>
                        <Tag size={11} className="text-primary" />
                        Offer · {lastMessage.price} DT
                      </>
                    ) : (
                      lastMessage?.text ??
                      `wants to rent · ${listing?.title ?? request.listingId}`
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center p-10 text-muted-foreground">
          <MessageCircle size={28} className="text-primary mb-2" />
          No conversations yet.
        </div>
      )}
    </div>
  );
}
