import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Leaf } from "lucide-react";
import { TrustBadge } from "@/components/TrustBadge";
import { impactStats, impactStories } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/impact")({
  head: () => ({
    meta: [
      { title: "Our impact — Rented" },
      { name: "description", content: "How RENTED keeps Tunisian objects in circulation." },
    ],
  }),
  component: Impact,
});

function Impact() {
  return (
    <div className="pb-10">
      <header className="flex items-center gap-3 p-5">
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-extrabold">Our impact</h1>
      </header>

      <div className="px-5 space-y-5">
        <TrustBadge icon={Leaf} label="Circular economy" />
        <h2 className="text-2xl font-extrabold text-ink leading-tight">
          Every rental keeps a Tunisian object in use a little longer.
        </h2>
        <p className="text-sm text-muted-foreground">
          Less waste, more income for families, and a country where good things
          don't sit idle in closets.
        </p>

        <div className="grid grid-cols-3 gap-2">
          {impactStats.map((s) => (
            <div
              key={s.label}
              className="bg-card border border-border rounded-2xl p-3 text-center"
            >
              <div className="text-xl font-extrabold text-primary">{s.value}</div>
              <div className="text-[11px] font-semibold text-ink mt-1 leading-tight">
                {s.label}
              </div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                {s.caption}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-ink mb-3">Real stories</h3>
          <div className="space-y-3">
            {impactStories.map((s) => (
              <div
                key={s.id}
                className="bg-secondary rounded-2xl p-3 flex gap-3"
              >
                <img
                  src={s.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-ink">
                    {s.author}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/home"
          className="block text-center bg-primary text-white rounded-full py-4 font-bold shadow-lg"
        >
          Start renting
        </Link>
      </div>
    </div>
  );
}
