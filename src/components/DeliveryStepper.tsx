import { Check } from "lucide-react";
import type { DeliveryState } from "@/lib/store";

const STEPS: { state: DeliveryState; label: string; caption: string }[] = [
  { state: "vendor_preparing", label: "Lender preparing", caption: "Item is being checked and packed" },
  { state: "courier_assigned", label: "Courier assigned", caption: "Riadh from Rented Express" },
  { state: "picked_up", label: "Picked up", caption: "Courier has the item" },
  { state: "in_transit", label: "On the way", caption: "Heading to your location" },
  { state: "delivered", label: "Delivered", caption: "Enjoy your rental" },
  { state: "return_pending", label: "Return scheduled", caption: "Courier will pick up on end date" },
  { state: "returned", label: "Returned", caption: "Funds released from escrow" },
];

export function DeliveryStepper({ current }: { current: DeliveryState }) {
  const currentIndex = STEPS.findIndex((s) => s.state === current);
  return (
    <ol className="relative">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.state} className="flex gap-4 pb-5 last:pb-0 relative">
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-[15px] top-8 bottom-0 w-px ${
                  done ? "bg-primary" : "bg-border"
                }`}
              />
            )}
            <div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                done
                  ? "bg-primary text-white"
                  : active
                  ? "bg-accent border-2 border-primary text-primary"
                  : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {done ? <Check size={14} /> : <span className="w-2 h-2 rounded-full bg-current" />}
            </div>
            <div className="flex-1 -mt-0.5">
              <div
                className={`font-semibold text-sm ${
                  active ? "text-ink" : done ? "text-ink" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{step.caption}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
