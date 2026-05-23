import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ScrollText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { getListing, getVendor } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { SignaturePad } from "@/components/SignaturePad";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/contract/$id")({
  head: () => ({ meta: [{ title: "Rental contract — Rented" }] }),
  component: Contract,
});

function Contract() {
  const { id } = Route.useParams();
  const listing = getListing(id)!;
  const vendor = getVendor(listing.vendorId);
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [signOpen, setSignOpen] = useState(false);
  const [sig, setSig] = useState<string | null>(null);

  const proceed = () => {
    updateDraft({ signature: sig });
    setSignOpen(false);
    navigate({ to: "/payment/$id", params: { id } });
  };

  return (
    <div className="pb-24">
      <header className="flex items-center gap-3 p-5">
        <Link to="/rent/$id" params={{ id }} className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-extrabold">Rental Contract</h1>
      </header>

      <div className="px-5 space-y-4">
        <div className="bg-primary-dark text-white rounded-2xl p-4 flex items-start gap-3">
          <ScrollText size={20} className="text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold">Legally binding agreement</div>
            <div className="text-white/80 text-xs mt-1">
              Signed under Tunisian law. A copy will be archived in both parties' accounts.
            </div>
          </div>
        </div>

        <article className="bg-card border border-border rounded-2xl p-5 text-sm leading-relaxed text-foreground/90 space-y-3 max-h-[420px] overflow-y-auto">
          <h2 className="font-extrabold text-base text-ink">Rental Agreement #RNT-{id.toUpperCase().slice(0, 6)}</h2>
          <p className="text-xs text-muted-foreground">Drafted on {format(new Date(), "PPP")}</p>

          <p><strong>Parties.</strong> The Lender ({vendor.name}, {vendor.city}) and the Renter (account holder), hereafter referred to as "the parties".</p>
          <p><strong>Object.</strong> One (1) {listing.title}, listed on the Rented platform, in working condition as documented in the insurance video.</p>
          <p><strong>Term.</strong> From {draft.startDate} to {draft.endDate}, inclusive.</p>
          <p><strong>Pricing.</strong> Base rate {listing.pricePerDay} DT / day. Final invoice including delivery and insurance fees is generated upon checkout and held in escrow until return.</p>
          <p><strong>Insurance.</strong> Renter is covered up to the declared value of the item against accidental damage during the rental term. The 8% insurance fee is non-refundable.</p>
          <p><strong>Damage policy.</strong> Visible damage at return that is not present in the pre-rental insurance video is assessed by the Rented review team within 72h. Settlement is debited from the escrow.</p>
          <p><strong>Delivery responsibility.</strong> The party initiating delivery is responsible for the item from pickup to the moment of handover, evidenced by signature in the Rented app.</p>
          <p><strong>Cancellation.</strong> Free cancellation up to 24h before start. After, 30% of base rate is owed to the Lender.</p>
        </article>

        <label className="flex items-start gap-3 bg-secondary rounded-2xl p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[oklch(0.72_0.19_137)]"
          />
          <span className="text-sm">I confirm I have read and accept the rental terms above.</span>
        </label>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-primary" />
          Your signature is encrypted and timestamped.
        </div>

        <button
          disabled={!confirmed}
          onClick={() => setSignOpen(true)}
          className="w-full bg-primary text-white rounded-full py-4 font-bold disabled:opacity-40"
        >
          Sign and continue
        </button>
      </div>

      <Dialog open={signOpen} onOpenChange={setSignOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Digital signature</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">Draw your signature below.</p>
          <SignaturePad onChange={setSig} />
          <button
            disabled={!sig}
            onClick={proceed}
            className="w-full bg-primary text-white rounded-full py-3 font-semibold disabled:opacity-40 mt-2"
          >
            Confirm signature
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
