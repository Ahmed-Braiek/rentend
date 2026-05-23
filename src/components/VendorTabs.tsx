import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/vendor/listings", label: "Listings" },
  { to: "/vendor/requests", label: "Requests" },
  { to: "/vendor/earnings", label: "Earnings" },
] as const;

export function VendorTabs() {
  const { pathname } = useLocation();
  return (
    <div className="px-5 pt-2">
      <div className="bg-secondary rounded-full p-1 flex">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex-1 text-center text-sm font-semibold py-2 rounded-full transition",
                active ? "bg-card text-ink shadow-sm" : "text-muted-foreground"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
