import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, ShieldAlert, ArrowLeft, PlayCircle, Cpu, ScanLine, ShieldCheck, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { useApp } from "@/lib/store";
import { getListing } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/insurance/validation/$rentalId")({
  head: () => ({ meta: [{ title: "Validate Insurance Video — Rented" }] }),
  component: InsuranceValidation,
});

function InsuranceValidation() {
  const { rentalId } = Route.useParams();
  const navigate = useNavigate();
  const allRentals = useApp((s) => s.rentals);
  const rental = allRentals.find(r => r.id === rentalId);
  const updateInsuranceState = useApp((s) => s.updateInsuranceState);
  
  const [analyzing, setAnalyzing] = useState(true);
  
  // Force low score for the demo to show the negative path, otherwise assume high score for the happy path.
  const [isLowScore] = useState(() => rentalId === "demo");

  useEffect(() => {
    const t = setTimeout(() => setAnalyzing(false), 2500);
    return () => clearTimeout(t);
  }, []);

  // For demo, we don't need a real rental object
  if (!rental && rentalId !== "demo") return <div className="p-8 text-center">Rental not found</div>;
  
  const listing = getListing(rental?.listingId ?? "");

  const handleApprove = () => {
    if (rentalId !== "demo") {
      updateInsuranceState(rentalId, "approved");
      navigate({ to: "/delivery/$rentalId", params: { rentalId } });
    } else {
      navigate({ to: "/insurance" });
    }
  };

  const handleReject = () => {
    if (rentalId !== "demo") {
      updateInsuranceState(rentalId, "rejected");
      navigate({ to: "/delivery/$rentalId", params: { rentalId } });
    } else {
      navigate({ to: "/insurance" });
    }
  };

  const handleSkip = () => {
    if (rentalId !== "demo") {
      updateInsuranceState(rentalId, "skipped_warning");
      navigate({ to: "/delivery/$rentalId", params: { rentalId } });
    } else {
      navigate({ to: "/insurance" });
    }
  };

  return (
    <div className="min-h-screen bg-card flex flex-col pb-10">
      <header className="p-5 flex items-center justify-between bg-white border-b border-border/50">
        <button 
          onClick={() => {
            if (rentalId !== "demo") {
              navigate({ to: "/delivery/$rentalId", params: { rentalId } });
            } else {
              navigate({ to: "/insurance" });
            }
          }}
          className="text-ink font-semibold flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="font-extrabold text-sm tracking-widest uppercase text-ink">
          AI Inspector
        </div>
        <div className="w-16" /> {/* spacer */}
      </header>

      <div className="flex-1 px-5 pt-6">
        {analyzing ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu size={40} className="text-primary animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-ink mb-2">Analyzing Video...</h2>
            <p className="text-muted-foreground text-center max-w-xs text-sm leading-relaxed">
              Verifying item condition, comparing timestamps, and checking against the master listing database.
            </p>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            {isLowScore ? (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-[2rem] p-6 shadow-sm mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center shrink-0 shadow-inner">
                    <ShieldAlert className="text-red-600" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-ink tracking-tight">Action Required</h2>
                    <p className="text-sm text-red-800/80 mt-1">
                      AI confidence is too low to approve coverage.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100/50">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">AI Confidence</div>
                    <div className="text-3xl font-extrabold text-red-600 tracking-tighter">45<span className="text-xl text-red-600/50">%</span></div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100/50">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Condition Match</div>
                    <div className="text-3xl font-extrabold text-ink tracking-tighter">60<span className="text-xl text-ink/40">%</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-4">Inspection Ledger</div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" /> 
                      <div>
                        <div className="text-sm font-bold text-ink">Full item visible</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Geometry and structural match confirmed.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" /> 
                      <div>
                        <div className="text-sm font-bold text-red-600">Accessories missing</div>
                        <div className="text-xs text-red-500/80 mt-0.5">Could not detect carrying case from listing.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" /> 
                      <div>
                        <div className="text-sm font-bold text-ink">Code & Timestamp</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Handwritten code {rental?.insuranceCode || "DX-902"} matches.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" /> 
                      <div>
                        <div className="text-sm font-bold text-red-600">Poor Lighting</div>
                        <div className="text-xs text-red-500/80 mt-0.5">Lighting is too poor to verify surface condition.</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-[2rem] p-6 shadow-sm mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0 shadow-inner">
                    <ShieldCheck className="text-green-600" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-ink tracking-tight">Coverage Approved</h2>
                    <p className="text-sm text-green-800/80 mt-1">
                      AI inspection complete. Protection is active.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100/50">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">AI Confidence</div>
                    <div className="text-3xl font-extrabold text-green-600 tracking-tighter">94<span className="text-xl text-green-600/50">%</span></div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100/50">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Condition Match</div>
                    <div className="text-3xl font-extrabold text-ink tracking-tighter">100<span className="text-xl text-ink/40">%</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-4">Inspection Ledger</div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" /> 
                      <div>
                        <div className="text-sm font-bold text-ink">Full item visible</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Geometry and structural match confirmed.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" /> 
                      <div>
                        <div className="text-sm font-bold text-ink">Accessories detected</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Listing components present.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" /> 
                      <div>
                        <div className="text-sm font-bold text-ink">Code & Timestamp</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Handwritten code {rental?.insuranceCode || "DX-902"} matches.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" /> 
                      <div>
                        <div className="text-sm font-bold text-ink">Minor lighting issue</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Lower right quadrant underexposed. AI confidence unaffected.</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Video Player Simulator */}
            <div className="relative aspect-[16/9] bg-black rounded-3xl overflow-hidden shadow-lg border border-border mb-6">
              <img 
                src={listing?.image || "https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800&h=1200&fit=crop"} 
                alt="Insurance Video" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform">
                  <PlayCircle size={36} className="text-white ml-1" />
                </button>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  AI Verified Timestamp
                </div>
                <div className="text-white/80 text-xs font-mono font-bold drop-shadow-md">
                  00:05
                </div>
              </div>
            </div>

            {isLowScore ? (
              <>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSkip}
                    className="flex-[1] bg-white border-2 border-border text-ink hover:text-red-600 transition-colors rounded-full py-4 font-bold flex flex-col items-center justify-center gap-0.5 leading-tight"
                  >
                    <span>Skip</span>
                    <span className="text-[10px] font-normal text-muted-foreground">Forfeit Coverage</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate({ to: "/insurance/record/$rentalId", params: { rentalId } })}
                    className="flex-[2] bg-ink text-white rounded-full py-4 font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <RefreshCw size={18} /> Retake Video
                  </button>
                </div>
                <p className="text-center text-[11px] text-muted-foreground mt-4 px-4 pb-4 leading-relaxed">
                  If you skip, any accidental damage or disputes will <strong className="text-red-500">not be covered</strong> by Rented Protect.
                </p>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <button 
                    onClick={handleReject}
                    className="flex-1 bg-white border-2 border-border text-ink hover:border-red-500 hover:text-red-600 transition-colors rounded-full py-4 font-bold"
                  >
                    Reject
                  </button>
                  
                  <button 
                    onClick={handleApprove}
                    className="flex-[2] bg-primary text-white rounded-full py-4 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                  >
                    Approve Delivery
                  </button>
                </div>
                <p className="text-center text-[11px] text-muted-foreground mt-4 px-4 pb-4">
                  Rejecting the validation will immediately block the delivery and notify both parties.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
