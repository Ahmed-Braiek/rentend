import { Outlet, createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { ShieldAlert, X } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const location = useLocation();
  const isVerificationModalOpen = useApp((s) => s.isVerificationModalOpen);
  const closeVerificationModal = useApp((s) => s.closeVerificationModal);
  const blockedActionReason = useApp((s) => s.blockedActionReason);

  return (
    <MobileShell bg="white">
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-1 pb-2">
          <Outlet />
        </div>
        <BottomNav />

        {isVerificationModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 fade-in zoom-in-95 duration-200">
              <button
                onClick={closeVerificationModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-border transition"
              >
                <X size={16} />
              </button>
              
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-5">
                <ShieldAlert size={28} className="text-primary" />
              </div>
              
              <h2 className="text-xl font-extrabold text-ink leading-tight">
                Verification required
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {blockedActionReason || "You need to verify your identity to continue."}
              </p>
              
              <Link
                to="/verify"
                search={{ returnUrl: location.pathname }}
                onClick={closeVerificationModal}
                className="mt-6 w-full inline-flex items-center justify-center bg-primary text-white rounded-full py-3.5 font-bold shadow-lg shadow-primary/20"
              >
                Verify identity now
              </Link>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
