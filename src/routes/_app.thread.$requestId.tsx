import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Send, Tag, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useApp, type Message } from "@/lib/store";
import { getListing } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/thread/$requestId")({
  head: () => ({ meta: [{ title: "Conversation — Rented" }] }),
  component: Thread,
});

function Thread() {
  const { requestId } = Route.useParams();
  const navigate = useNavigate();
  const role = useApp((s) => s.currentUser.activeMode);
  const currentUser = useApp((s) => s.currentUser);
  
  const request = useApp((s) => s.rentals.find((r) => r.id === requestId));
  const messages = request?.thread ?? [];
  
  const acceptRental = useApp((s) => s.acceptRental);
  const counterOffer = useApp((s) => s.counterOffer);
  const rejectRental = useApp((s) => s.rejectRental);

  const [text, setText] = useState("");
  const [counterPrice, setCounterPrice] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const authorId = currentUser.id;
  const listing = request ? getListing(request.listingId) : null;

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages.length]);

  const requireVerification = useApp((s) => s.requireVerification);

  const send = async () => {
    if (!text.trim() || !request) return;
  };

  const sendCounter = async () => {
    if (!counterPrice || !request) return;
    const ok = requireVerification("You must verify your identity to negotiate offers.");
    if (!ok) return;
    
    await counterOffer(requestId, Number(counterPrice));
    setCounterPrice("");
  };

  const onAccept = async (offer: Message) => {
    if (!request) return;
    const ok = requireVerification("You must verify your identity to accept rentals.");
    if (!ok) return;

    await acceptRental(requestId);
    if (role === "buyer") {
      navigate({ to: "/contract/$id", params: { id: request.listingId } });
    }
  };

  const onReject = async () => {
    if (!request) return;
    await rejectRental(requestId);
  };

  if (!request) {
    return <div className="p-8 text-center text-muted-foreground">Conversation not found.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <header className="flex items-center gap-3 p-4 border-b border-border">
        <Link
          to={role === "vendor" ? "/vendor/requests" : "/messages"}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink truncate">Negotiation for {listing?.title}</div>
          <div className="text-[11px] text-muted-foreground truncate">
            Status: {request.status}
          </div>
        </div>
      </header>

      <div ref={scroller} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const mine = m.authorId === authorId;
          if (m.type === "offer") {
            return (
              <div
                key={m.id}
                className={`max-w-[80%] ${mine ? "ml-auto" : ""} bg-accent border border-primary/20 rounded-2xl p-3`}
              >
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-primary-dark">
                  <Tag size={11} /> Offer
                </div>
                <div className="text-2xl font-extrabold text-ink mt-1">
                  {m.price} DT
                </div>
                {!mine && request.status !== "accepted" && request.status !== "rejected" && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => onAccept(m)}
                      className="flex-1 bg-primary text-white rounded-full py-2 text-sm font-semibold inline-flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      onClick={onReject}
                      className="flex-1 border border-border text-muted-foreground rounded-full py-2 text-sm font-semibold hover:bg-secondary transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          }
          return (
            <div
              key={m.id}
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm ${
                mine
                  ? "ml-auto bg-primary text-white rounded-br-md"
                  : "bg-secondary text-ink rounded-bl-md"
              }`}
            >
              {m.text}
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-10">
            Start the conversation.
          </div>
        )}
      </div>

      <div className="border-t border-border p-3 space-y-2 bg-card">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Counter price (DT)"
            value={counterPrice}
            onChange={(e) => setCounterPrice(e.target.value)}
            className="flex-1 border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={sendCounter}
            disabled={!counterPrice}
            className="bg-accent text-primary-dark text-sm font-semibold px-4 rounded-full disabled:opacity-50"
          >
            Send offer
          </button>
        </div>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message…"
            className="flex-1 border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={send}
            className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
