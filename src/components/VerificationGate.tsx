import { Link } from "@tanstack/react-router";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/store";
import type { ReactNode } from "react";

export function VerificationGate({
  children,
  reason = "Verify your identity to continue.",
}: {
  children: ReactNode;
  reason?: string;
}) {
  const status = useApp((s) => s.currentUser.verificationStatus);
  if (status === "verified") return <>{children}</>;

  const pending = status === "pending_review";
  return (
    <div className="p-5">
      <div className="bg-accent border border-primary/20 rounded-3xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-card flex items-center justify-center">
            <ShieldAlert size={18} className="text-primary" />
          </div>
          <div>
            <div className="font-bold text-primary-dark">
              {pending ? "Verification in review" : "Verification required"}
            </div>
            <div className="text-xs text-primary-dark/70 mt-0.5">{reason}</div>
          </div>
        </div>
        {!pending && (
          <Link
            to="/verify"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary text-white rounded-full py-3 font-semibold"
          >
            Start verification <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
