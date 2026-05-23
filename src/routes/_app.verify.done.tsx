import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/_app/verify/done")({
  validateSearch: (search: Record<string, unknown>) => {
    return { returnUrl: search.returnUrl as string | undefined };
  },
  head: () => ({ meta: [{ title: "You're verified — Rented" }] }),
  component: VerifyDone,
});

function VerifyDone() {
  const navigate = useNavigate();
  const { returnUrl } = Route.useSearch();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg">
        <BadgeCheck size={56} className="text-white" />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold text-ink">You're verified</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Your profile now shows the green badge. Lenders trust verified renters
        faster — expect quicker replies.
      </p>
      <button
        onClick={() => {
          if (returnUrl) navigate({ to: returnUrl });
          else navigate({ to: "/home" });
        }}
        className="mt-10 bg-primary text-white rounded-full px-8 py-3.5 font-semibold"
      >
        {returnUrl ? "Continue" : "Back to home"}
      </button>
    </div>
  );
}
