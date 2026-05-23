import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Store, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/new")({
  head: () => ({ meta: [{ title: "List an item — Rented" }] }),
  beforeLoad: () => {
    if (useApp.getState().currentUser.activeMode === "vendor") {
      throw redirect({ to: "/vendor/new" });
    }
  },
  component: NewBuyerPrompt,
});

function NewBuyerPrompt() {
  const setActiveMode = useApp((s) => s.setActiveMode);
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-10">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
        <Store size={28} className="text-primary" />
      </div>
      <h1 className="mt-5 text-xl font-extrabold text-ink">Become a lender</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Turn idle objects into income. Switch to vendor mode to publish your
        first listing in under a minute.
      </p>
      <Link
        to="/vendor/new"
        onClick={() => setActiveMode("vendor")}
        className="mt-6 inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 font-semibold shadow-lg"
      >
        Switch to vendor <ArrowRight size={16} />
      </Link>
    </div>
  );
}
