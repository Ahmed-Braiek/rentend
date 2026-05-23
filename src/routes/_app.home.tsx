import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { categories, listings } from "@/lib/mock-data";
import { ListingCard } from "@/components/ListingCard";

export const Route = createFileRoute("/_app/home")({
  head: () => ({ meta: [{ title: "Discover rentals — Rented" }] }),
  component: Home,
});

function Home() {
  return (
    <div className="p-5 pb-8 space-y-6">
      <header className="flex items-center justify-between">
        <Logo size={32} />
        <button className="bg-card border border-border w-10 h-10 rounded-full flex items-center justify-center">
          <Bell size={18} />
        </button>
      </header>

      <div className="bg-card border border-border rounded-full px-5 py-3 flex items-center gap-3 shadow-sm">
        <Search size={18} className="text-muted-foreground" />
        <input
          className="bg-transparent flex-1 text-sm focus:outline-none"
          placeholder="What are you looking to rent?"
        />
      </div>

      {/* Hero */}
      <div className="relative bg-secondary rounded-3xl p-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[100%]" />
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
            alt=""
            className="absolute bottom-2 right-2 w-28 h-28 object-cover rounded-xl"
          />
        </div>
        <div className="relative max-w-[55%]">
          <h2 className="text-lg font-extrabold leading-tight text-ink">
            Rent whatever <span className="text-primary">you need</span>,
            <br />
            Whenever <span className="text-primary">you want</span>.
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Affordable. Flexible. Nearby.
          </p>
          <button className="mt-4 bg-ink text-white rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
            Browse Items <ArrowRight size={14} />
          </button>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span className="w-1.5 h-1.5 bg-border rounded-full" />
          <span className="w-1.5 h-1.5 bg-border rounded-full" />
        </div>
      </div>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-extrabold text-ink">Categories</h3>
          <button className="text-primary text-sm font-semibold">view all</button>
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 scrollbar-none">
          {categories.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className="shrink-0 w-[68px] bg-card border border-border rounded-2xl p-2.5 flex flex-col items-center gap-1.5 shadow-sm"
            >
              <Icon size={22} className="text-ink" />
              <span className="text-[10px] font-semibold text-ink">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-extrabold text-ink">Popular near you</h3>
          <Link to="/home" className="text-primary text-sm font-semibold">view all</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-none">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} compact />
          ))}
        </div>
      </section>

      {/* Trust banner */}
      <section className="bg-primary-dark text-white rounded-3xl p-5">
        <div className="text-xs uppercase tracking-widest text-primary font-bold">Why Rented</div>
        <h3 className="mt-1 text-xl font-extrabold">Insured, escrowed, verified.</h3>
        <p className="mt-2 text-sm text-white/80">
          Every rental is protected by ID verification, a digital contract, and escrowed payment held until return.
        </p>
      </section>
    </div>
  );
}
