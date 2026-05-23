import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, IdCard, Camera, Clock } from "lucide-react";
import { useApp } from "@/lib/store";
import { TrustBadge } from "@/components/TrustBadge";

export const Route = createFileRoute("/_app/verify/")({
  validateSearch: (search: Record<string, unknown>) => {
    return { returnUrl: search.returnUrl as string | undefined };
  },
  head: () => ({
    meta: [
      { title: "Verify your identity — Rented" },
      { name: "description", content: "Verified identities keep RENTED safe for everyone." },
    ],
  }),
  component: VerifyIntro,
});

function VerifyIntro() {
  const status = useApp((s) => s.currentUser.verificationStatus);
  const { returnUrl } = Route.useSearch();

  return (
    <div className="p-6 pb-32">
      <TrustBadge icon={ShieldCheck} label="Trusted by Rented" />
      <h1 className="mt-4 text-2xl font-extrabold text-ink leading-tight">
        Get verified in under 2 minutes.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Verified members get the green badge, faster approvals from lenders, and
        access to high-value rentals.
      </p>

      <div className="mt-6 space-y-3">
        <Step icon={<IdCard size={18} className="text-primary" />} title="National ID" caption="Front and back, well-lit." />
        <Step icon={<Camera size={18} className="text-primary" />} title="Selfie check" caption="Quick liveness check, never shared." />
        <Step icon={<Clock size={18} className="text-primary" />} title="Review" caption="Usually approved within minutes." />
      </div>

      <Link
        to="/verify/id"
        search={returnUrl ? { returnUrl } : {}}
        className="mt-8 w-full inline-flex items-center justify-center bg-primary text-white rounded-full py-4 font-bold shadow-lg"
      >
        {status === "verified" ? "Re-verify" : "Start verification"}
      </Link>

      {status === "pending_review" && (
        <Link
          to="/verify/review"
          className="mt-3 w-full inline-flex items-center justify-center border border-border rounded-full py-3 font-semibold text-ink"
        >
          See review status
        </Link>
      )}

      <p className="mt-6 text-[11px] text-muted-foreground text-center">
        We use bank-grade encryption. Documents are deleted after review.
      </p>
    </div>
  );
}

function Step({
  icon,
  title,
  caption,
}: {
  icon: React.ReactNode;
  title: string;
  caption: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-bold text-ink">{title}</div>
        <div className="text-xs text-muted-foreground">{caption}</div>
      </div>
    </div>
  );
}
