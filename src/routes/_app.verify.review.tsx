import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/verify/review")({
  validateSearch: (search: Record<string, unknown>) => {
    return { returnUrl: search.returnUrl as string | undefined };
  },
  head: () => ({ meta: [{ title: "In review — Rented" }] }),
  component: VerifyReview,
});

function VerifyReview() {
  const navigate = useNavigate();
  const { returnUrl } = Route.useSearch();
  const status = useApp((s) => s.currentUser.verificationStatus);

  useEffect(() => {
    if (status === "verified") {
      navigate({ to: "/verify/done", search: returnUrl ? { returnUrl } : {} });
    }
  }, [status, navigate, returnUrl]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
        <Loader2 size={36} className="text-primary animate-spin" />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold text-ink">Reviewing your documents</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Most members are approved in under a minute. You can close this screen —
        we'll notify you when it's done.
      </p>
    </div>
  );
}
