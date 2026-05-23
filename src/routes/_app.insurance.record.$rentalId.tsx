import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Camera, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, ShieldCheck, AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/store";
import { getListing } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/insurance/record/$rentalId")({
  head: () => ({ meta: [{ title: "Record Insurance Video — Rented" }] }),
  component: InsuranceRecord,
});

function InsuranceRecord() {
  const { rentalId } = Route.useParams();
  const navigate = useNavigate();
  const updateInsuranceState = useApp((s) => s.updateInsuranceState);
  const allRentals = useApp((s) => s.rentals);
  const rental = allRentals.find(r => r.id === rentalId);
  const listing = getListing(rental?.listingId ?? "");
  
  const [step, setStep] = useState<"intro" | "camera" | "warning">("intro");
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Only init camera when on camera step
  useEffect(() => {
    if (step !== "camera") return;
    
    let mediaStream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((s) => {
        mediaStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [step]);

  useEffect(() => {
    if (!recording) return;
    
    // Simulate recording for 5 seconds
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setRecording(false);
          setDone(true);
          // Stop stream when done
          if (stream) {
            stream.getTracks().forEach(t => t.stop());
          }
          return 100;
        }
        return p + 2; // 2% every 100ms = 5 seconds
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [recording, stream]);

  const handleStart = () => {
    setRecording(true);
    setProgress(0);
    setDone(false);
  };

  const handleSubmit = () => {
    if (rentalId !== "demo") {
      updateInsuranceState(rentalId, "submitted_for_validation");
    }
    navigate({ to: "/insurance/validation/$rentalId", params: { rentalId } });
  };

  const handleCancel = () => {
    if (rentalId !== "demo") {
      navigate({ to: "/delivery/$rentalId", params: { rentalId } });
    } else {
      navigate({ to: "/insurance" });
    }
  };

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-card flex flex-col">
        <header className="p-5 flex items-center justify-between bg-white border-b border-border/50">
          <button onClick={handleCancel} className="text-ink font-semibold flex items-center gap-2">
            <ArrowLeft size={18} /> Back
          </button>
        </header>
        <div className="flex-1 p-6 flex flex-col">
          <div className="bg-accent text-primary-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
            2 Days Before Pickup
          </div>
          <h1 className="text-3xl font-extrabold text-ink mb-2">Pickup Reminder</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Insurance Verification Required
          </p>

          <div className="bg-white border border-border rounded-3xl p-5 shadow-sm mb-6">
            <div className="flex gap-4 items-center mb-4">
              <img src={listing?.image || "https://images.unsplash.com/photo-1516961642265-531546e84af2?w=400&h=400&fit=crop"} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <div className="font-bold text-ink">{listing?.title || "Demo Item"}</div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {rental?.startDate || "Oct 12"} to {rental?.endDate || "Oct 14"}
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-1 text-sm">
                <ShieldCheck size={16} /> Protection Active
              </div>
              <p className="text-xs text-green-800/80 leading-relaxed">
                To keep your insurance protection active, you must complete the item verification recording before pickup.
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button 
              onClick={() => setStep("camera")}
              className="w-full bg-primary text-white py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Start Verification
            </button>
            <button 
              onClick={() => setStep("warning")}
              className="w-full text-muted-foreground font-semibold py-4 text-sm"
            >
              Skip Verification
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "warning") {
    return (
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6 mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-center text-ink mb-3">Skip Verification?</h2>
          <p className="text-center text-muted-foreground mb-6 text-sm">
            Skipping verification removes your insurance protection for this rental.
          </p>
          <ul className="space-y-3 mb-8 bg-secondary p-4 rounded-2xl text-xs text-ink font-medium">
            <li className="flex gap-3"><div className="mt-0.5 text-red-500 font-bold shrink-0">×</div> Accidental damage will not be covered</li>
            <li className="flex gap-3"><div className="mt-0.5 text-red-500 font-bold shrink-0">×</div> Disputes may not be eligible for protection</li>
            <li className="flex gap-3"><div className="mt-0.5 text-green-600 font-bold shrink-0">✓</div> Verification is strongly recommended</li>
          </ul>

          <div className="space-y-3">
            <button 
              onClick={() => setStep("intro")}
              className="w-full bg-ink text-white py-4 rounded-full font-bold hover:scale-[1.02] transition-transform"
            >
              Go Back
            </button>
            <button 
              onClick={() => {
                if (rentalId !== "demo") {
                  updateInsuranceState(rentalId, "skipped_warning");
                  navigate({ to: "/delivery/$rentalId", params: { rentalId } });
                } else {
                  navigate({ to: "/insurance" });
                }
              }}
              className="w-full bg-red-50 text-red-600 border border-red-100 py-4 rounded-full font-bold hover:bg-red-100 transition-colors"
            >
              Skip Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pb-10">
      <header className="p-5 flex items-center justify-between z-10 relative bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => setStep("intro")}
          className="text-white font-semibold flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="font-extrabold text-sm tracking-widest uppercase text-white/90">
          Verification
        </div>
        <div className="w-16" /> {/* spacer */}
      </header>

      <div className="flex-1 relative flex flex-col justify-end p-6">
        {/* Viewfinder simulator */}
        <div className="absolute inset-0 z-0 bg-black">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className={`w-full h-full object-cover transition-opacity duration-1000 ${done ? "opacity-50 blur-sm" : "opacity-100"}`}
          />
          {recording && (
            <div className="absolute top-20 right-6 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-white/90">REC</span>
            </div>
          )}
          
          {/* Progress bar overlay */}
          {recording && (
            <div className="absolute top-24 left-6 right-6 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="relative z-10 flex flex-col items-center">
          {!done ? (
            <>
              <div className="bg-black/60 backdrop-blur-xl p-5 rounded-3xl mb-8 border border-white/10 max-w-sm w-full animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-primary shrink-0" size={20} />
                  <div className="font-bold text-white tracking-wide">Recording Checklist</div>
                </div>
                <ul className="space-y-3 mb-5">
                  <li className="flex items-start gap-2 text-sm text-white/80"><div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />Show full item clearly</li>
                  <li className="flex items-start gap-2 text-sm text-white/80"><div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />Show functionality</li>
                  <li className="flex items-start gap-2 text-sm text-white/80"><div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />Show accessories</li>
                  <li className="flex items-start gap-2 text-sm text-white/80"><div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />Show visible condition</li>
                  <li className="flex items-start gap-2 text-sm text-white/80"><div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />Show handwritten verification code</li>
                </ul>
                <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/5">
                  <div className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-1">Your Code</div>
                  <div className="text-2xl font-mono font-bold tracking-[0.2em] text-white">
                    {rental?.insuranceCode || "DX-902"}
                  </div>
                </div>
              </div>

              {!recording && (
                <button 
                  onClick={handleStart}
                  className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center p-1 hover:scale-105 transition-transform"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Camera className="text-black" size={24} />
                  </div>
                </button>
              )}
              
              {recording && (
                <button 
                  onClick={() => { setRecording(false); setDone(true); }}
                  className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center p-1"
                >
                  <div className="w-8 h-8 rounded-sm bg-red-500" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full bg-black/80 backdrop-blur-lg p-6 rounded-3xl border border-white/10 text-center animate-in slide-in-from-bottom-8">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-primary" size={32} />
              </div>
              <h3 className="font-extrabold text-xl mb-2">Verification Complete</h3>
              <p className="text-sm text-white/70 mb-6">
                Your video is securely encrypted and will be submitted for AI analysis.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setDone(false); setProgress(0); }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw size={18} /> Retake
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 bg-primary text-white rounded-full py-4 font-bold shadow-lg shadow-primary/20"
                >
                  Analyze Video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
