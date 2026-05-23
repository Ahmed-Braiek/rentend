import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus, ShieldCheck, Check } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { categories } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/vendor/new")({
  head: () => ({ meta: [{ title: "New listing — Rented" }] }),
  component: NewListing,
});

const STEPS = ["Basics", "Photos", "Pricing", "Review"] as const;

function NewListing() {
  const navigate = useNavigate();
  const draft = useApp((s) => s.listingDraft);
  const update = useApp((s) => s.updateListingDraft);
  const publish = useApp((s) => s.publishListing);
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onPhotos = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).slice(0, 4).map((f) => URL.createObjectURL(f));
    update({ photos: [...draft.photos, ...urls].slice(0, 4) });
  };

  const requireVerification = useApp((s) => s.requireVerification);

  const onPublish = async () => {
    requireVerification("High-value listings require a verified identity.", async () => {
      setPublishing(true);
      const id = publish();
      if (id) await api.publishListing(id);
      setPublishing(false);
      navigate({ to: "/vendor/listings" });
    });
  };

  return (
    <div className="pb-32">
      <header className="flex items-center gap-3 p-5">
        <Link
          to="/vendor/listings"
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-extrabold">New listing</h1>
      </header>

      <div className="px-5">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </div>
      </div>

      <div className="px-5 mt-5 space-y-5">
        {step === 0 && (
          <>
            <div>
              <label className="text-sm font-bold text-ink">Category</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const active = draft.category === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => update({ category: c.id })}
                      className={`border rounded-2xl p-3 text-center text-xs font-semibold ${
                        active
                          ? "border-primary bg-accent text-primary-dark"
                          : "border-border bg-card text-ink"
                      }`}
                    >
                      <Icon size={18} className="mx-auto text-primary mb-1" />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field label="Title">
              <input
                value={draft.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="e.g. Canon EOS R5"
                className="w-full border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={draft.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="What makes it great? Condition, included accessories…"
                rows={4}
                className="w-full border border-border rounded-2xl px-3 py-3 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <Field label="Photos (up to 4)">
            <label className="block border-2 border-dashed border-border rounded-2xl p-6 text-center text-sm text-muted-foreground cursor-pointer hover:border-primary">
              <ImagePlus size={22} className="mx-auto text-primary mb-2" />
              Tap to add photos
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => onPhotos(e.target.files)}
              />
            </label>
            {draft.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {draft.photos.map((p) => (
                  <img
                    key={p}
                    src={p}
                    alt=""
                    className="aspect-square object-cover rounded-xl"
                  />
                ))}
              </div>
            )}
          </Field>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price / day (DT)">
                <input
                  type="number"
                  value={draft.pricePerDay}
                  onChange={(e) =>
                    update({
                      pricePerDay: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </Field>
              <Field label="Deposit (DT)">
                <input
                  type="number"
                  value={draft.deposit}
                  onChange={(e) =>
                    update({
                      deposit: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </Field>
            </div>
            <Field label="City">
              <input
                value={draft.city}
                onChange={(e) => update({ city: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </Field>
            <label className="flex items-center justify-between bg-card border border-border rounded-2xl p-3 text-sm">
              <div>
                <div className="font-semibold text-ink">Offer delivery</div>
                <div className="text-xs text-muted-foreground">
                  Renters can request courier pickup.
                </div>
              </div>
              <input
                type="checkbox"
                checked={draft.delivery}
                onChange={(e) => update({ delivery: e.target.checked })}
                className="w-5 h-5 accent-[color:var(--primary)]"
              />
            </label>
          </>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              {draft.photos[0] && (
                <img src={draft.photos[0]} alt="" className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <div className="font-extrabold text-ink">{draft.title || "Untitled"}</div>
                <div className="text-primary font-semibold text-sm mt-0.5">
                  {draft.pricePerDay || 0} DT / Day
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {draft.description || "No description yet."}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-primary" />
              Ready to publish. Listing goes live immediately.
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-[72px] left-0 right-0 px-4 pb-3 pt-3 bg-gradient-to-t from-card to-card/0">
        <div className="max-w-[440px] mx-auto flex gap-3">
          {step > 0 && (
            <button
              onClick={back}
              className="flex-1 border border-border rounded-full py-4 font-bold text-ink"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="flex-1 bg-primary text-white rounded-full py-4 font-bold shadow-lg"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={onPublish}
              disabled={publishing}
              className="flex-1 bg-primary text-white rounded-full py-4 font-bold shadow-lg disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {publishing ? "Publishing…" : (<><Check size={16} /> Publish</>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-ink">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
