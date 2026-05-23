import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, IdCard, Upload } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/verify/id")({
  validateSearch: (search: Record<string, unknown>) => {
    return { returnUrl: search.returnUrl as string | undefined };
  },
  head: () => ({ meta: [{ title: "ID upload — Rented" }] }),
  component: VerifyId,
});

import { useState } from "react";

function VerifyId() {
  const navigate = useNavigate();
  const { returnUrl } = Route.useSearch();
  const [idFront, setIdFront] = useState<string | undefined>();
  const [idBack, setIdBack] = useState<string | undefined>();

  const onPick = (key: "idFront" | "idBack") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (key === "idFront") setIdFront(URL.createObjectURL(f));
    if (key === "idBack") setIdBack(URL.createObjectURL(f));
  };

  const ready = Boolean(idFront && idBack);

  return (
    <div className="pb-32">
      <header className="flex items-center gap-3 p-5">
        <Link to="/verify" search={returnUrl ? { returnUrl } : {}} className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-extrabold">National ID</h1>
      </header>

      <div className="px-5 space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload a clear photo of both sides. Make sure all corners are visible.
        </p>

        <Slot
          label="Front of ID"
          value={idFront}
          onChange={onPick("idFront")}
        />
        <Slot
          label="Back of ID"
          value={idBack}
          onChange={onPick("idBack")}
        />
      </div>

      <div className="fixed bottom-[72px] left-0 right-0 px-4 pb-3 pt-3 bg-gradient-to-t from-card to-card/0">
        <div className="max-w-[440px] mx-auto">
          <button
            disabled={!ready}
            onClick={() => navigate({ to: "/verify/selfie", search: returnUrl ? { returnUrl } : {} })}
            className="w-full bg-primary text-white rounded-full py-4 font-bold shadow-lg disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function Slot({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <div className="text-sm font-bold text-ink mb-2">{label}</div>
      <div className="relative border-2 border-dashed border-border rounded-2xl overflow-hidden aspect-[16/10] flex items-center justify-center bg-secondary">
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            <Upload size={20} className="mx-auto text-primary mb-1" />
            Tap to upload
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={onChange}
        />
      </div>
      {!value && (
        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <IdCard size={11} />
          Use a flat, well-lit surface.
        </div>
      )}
    </label>
  );
}
