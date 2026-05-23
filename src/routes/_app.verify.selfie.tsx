import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { useApp } from "@/lib/store";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/verify/selfie")({
  validateSearch: (search: Record<string, unknown>) => {
    return { returnUrl: search.returnUrl as string | undefined };
  },
  head: () => ({ meta: [{ title: "Selfie check — Rented" }] }),
  component: VerifySelfie,
});

import { useRef, useEffect, useState } from "react";

function VerifySelfie() {
  const navigate = useNavigate();
  const { returnUrl } = Route.useSearch();
  const [selfie, setSelfie] = useState<string | undefined>();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completeVerification = useApp((s) => s.completeVerification);

  useEffect(() => {
    // Start camera when component mounts
    let mediaStream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then((s) => {
        mediaStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));

    return () => {
      // Cleanup stream on unmount
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the current video frame to the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setSelfie(dataUrl);
        // Stop the stream since we captured the photo
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
        }
      }
    }
  };

  const submit = async () => {
    completeVerification();
    navigate({ to: "/verify/review", search: returnUrl ? { returnUrl } : {} });
  };

  return (
    <div className="pb-32">
      <header className="flex items-center gap-3 p-5">
        <Link to="/verify/id" search={returnUrl ? { returnUrl } : {}} className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-extrabold">Selfie check</h1>
      </header>

      <div className="px-5 space-y-4">
        <p className="text-sm text-muted-foreground">
          Look straight at the camera. This is a one-time liveness check.
        </p>

        <div className="block relative aspect-square rounded-3xl overflow-hidden bg-black border border-border">
          {selfie ? (
            <img src={selfie} alt="Selfie preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform scale-x-[-1]" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 pointer-events-none">
                <button 
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full border-4 border-white/50 flex items-center justify-center p-1 pointer-events-auto active:scale-95 transition-transform"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Camera className="text-black" size={20} />
                  </div>
                </button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      <div className="fixed bottom-[72px] left-0 right-0 px-4 pb-3 pt-3 bg-gradient-to-t from-card to-card/0">
        <div className="max-w-[440px] mx-auto">
          <button
            disabled={!selfie}
            onClick={submit}
            className="w-full bg-primary text-white rounded-full py-4 font-bold shadow-lg disabled:opacity-50"
          >
            Submit for review
          </button>
        </div>
      </div>
    </div>
  );
}
