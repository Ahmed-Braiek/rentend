import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon, MapPin, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, listings } from "@/lib/mock-data";
import { ListingCard } from "@/components/ListingCard";

export const Route = createFileRoute("/_app/search")({
  head: () => ({ meta: [{ title: "Search rentals — Rented" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return listings.filter((l) => {
      if (cat && l.category !== cat) return false;
      if (!term) return true;
      return (
        l.title.toLowerCase().includes(term) ||
        l.category.toLowerCase().includes(term)
      );
    });
  }, [q, cat]);

  return (
    <div className="p-5 pb-8 space-y-5">
      <header>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
          Discover
        </div>
        <h1 className="text-2xl font-extrabold text-ink">Find a rental</h1>
      </header>

      <div className="bg-card border border-border rounded-full px-5 py-3 flex items-center gap-3 shadow-sm">
        <SearchIcon size={18} className="text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="bg-transparent flex-1 text-sm focus:outline-none"
          placeholder="Search tools, gear, furniture…"
        />
        <button className="text-muted-foreground" aria-label="Filters">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin size={12} className="text-primary" /> Showing rentals near Tunis,
        Ariana &amp; Ben Arous
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
        <Chip
          label="All"
          active={cat === null}
          onClick={() => setCat(null)}
        />
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            active={cat === c.id}
            onClick={() => setCat(c.id)}
          />
        ))}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ink">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </h3>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No rentals matched. Try a different search or category.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((l) => (
              <Link key={l.id} to="/item/$id" params={{ id: l.id }}>
                <ListingCard listing={l} compact />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full transition border " +
        (active
          ? "bg-primary text-white border-primary"
          : "bg-card text-ink border-border")
      }
    >
      {label}
    </button>
  );
}
