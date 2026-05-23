import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Share2, MoreVertical, Star, MapPin, BadgeCheck, ListChecks, List, Timer, ShieldCheck, CreditCard, HelpCircle, LogOut, Leaf, ChevronRight } from "lucide-react";
import { vendors, listings, reviews } from "@/lib/mock-data";
import { ListingCard } from "@/components/ListingCard";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Vendor profile — Rented" }] }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const v = vendors.ahmed;
  const items = listings.slice(0, 4);
  const currentUser = useApp((s) => s.currentUser);
  const setActiveMode = useApp((s) => s.setActiveMode);
  const setAuthed = useApp((s) => s.setAuthed);
  const verification = currentUser.verificationStatus;
  const activeMode = currentUser.activeMode;

  const signOut = () => {
    setAuthed(false);
    navigate({ to: "/welcome" });
  };

  const switchToBuyer = () => {
    setActiveMode("buyer");
    navigate({ to: "/home" });
  };
  const switchToVendor = () => {
    setActiveMode("vendor");
    navigate({ to: "/vendor" });
  };

  return (
    <div className="pb-8">
      <div className="relative h-52">
        <img
          src="https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=1200&h=600&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <Link to="/home" className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow">
          <ArrowLeft size={18} />
        </Link>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow"><Share2 size={16} /></button>
          <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow"><MoreVertical size={16} /></button>
        </div>
      </div>

      <div className="px-5 -mt-10 relative">
        <div className="bg-card rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <img src={v.avatar} alt="" className="w-20 h-20 rounded-full border-4 border-card object-cover -mt-12" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold text-ink">{v.name}</h1>
                {v.verified && <BadgeCheck size={16} className="text-primary" />}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" />{v.rating} ({v.reviews} Reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5"><MapPin size={11} />{v.city}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">{v.bio}</p>
          <button className="mt-4 w-full bg-primary text-white rounded-full py-3 font-semibold">Follow</button>
        </div>

        <div className="mt-4 bg-card border border-border rounded-2xl p-4 grid grid-cols-3 text-center">
          <Stat icon={<ListChecks size={18} className="text-primary" />} value="24" label="Rentals completed" />
          <Stat icon={<List size={18} className="text-primary" />} value="12" label="Active listings" />
          <Stat icon={<Timer size={18} className="text-primary" />} value="80%" label="Response rate" />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-extrabold">Items for rent</h2>
            <button className="text-primary text-sm font-semibold">view all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-none">
            {items.map((l) => <ListingCard key={l.id} listing={l} compact />)}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-extrabold">What people say</h2>
            <button className="text-primary text-sm font-semibold">view all reviews</button>
          </div>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-secondary rounded-2xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={r.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <div>
                      <div className="text-sm font-semibold text-ink">{r.author}</div>
                      <div className="text-[11px] text-muted-foreground">{r.date}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-card border border-border rounded-2xl p-1.5 flex">
          <button
            onClick={switchToBuyer}
            className={
              "flex-1 text-sm font-semibold py-2 rounded-xl transition " +
              (activeMode === "buyer"
                ? "bg-primary text-white"
                : "text-muted-foreground")
            }
          >
            Buyer mode
          </button>
          <button
            onClick={switchToVendor}
            className={
              "flex-1 text-sm font-semibold py-2 rounded-xl transition " +
              (activeMode === "vendor"
                ? "bg-primary text-white"
                : "text-muted-foreground")
            }
          >
            Vendor mode
          </button>
        </div>

        <div className="mt-6 bg-card border border-border rounded-2xl overflow-hidden">
          <SettingsRow
            icon={<ShieldCheck size={16} className="text-primary" />}
            label="Verification"
            value={verification === "verified" ? "Verified" : verification === "pending_review" ? "In review" : "Not verified"}
            to="/verify"
          />
          {activeMode === "vendor" && (
            <SettingsRow icon={<List size={16} className="text-primary" />} label="Vendor workspace" to="/vendor" />
          )}
          <SettingsRow icon={<Leaf size={16} className="text-primary" />} label="Our impact" to="/impact" />
          <SettingsRow icon={<CreditCard size={16} className="text-primary" />} label="Payment methods" />
          <SettingsRow icon={<HelpCircle size={16} className="text-primary" />} label="Help & support" />
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-destructive border-t border-border"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  to?: "/verify" | "/impact" | "/vendor" | "/vendor/listings";
}) {
  const body = (
    <div className="w-full flex items-center gap-3 px-4 py-3.5 text-sm border-b border-border last:border-b-0">
      {icon}
      <span className="flex-1 text-left font-semibold text-ink">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight size={14} className="text-muted-foreground" />
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : <button className="w-full">{body}</button>;
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {icon}
      <div className="font-extrabold text-ink">{value}</div>
      <div className="text-[10px] text-muted-foreground leading-tight">{label}</div>
    </div>
  );
}
