import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  Search,
  Package,
  MessageCircle,
  User,
  LayoutDashboard,
  List,
  Inbox,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
  match: string;
};

const buyerItems: NavItem[] = [
  { to: "/home", icon: Home, label: "Home", match: "/home" },
  { to: "/search", icon: Search, label: "Search", match: "/search" },
  { to: "/rentals", icon: Package, label: "Rentals", match: "/rentals" },
  { to: "/profile", icon: User, label: "You", match: "/profile" },
];

const vendorItems: NavItem[] = [
  { to: "/vendor", icon: LayoutDashboard, label: "Dashboard", match: "/vendor" },
  { to: "/vendor/listings", icon: List, label: "Listings", match: "/vendor/listings" },
  { to: "/vendor/requests", icon: Inbox, label: "Requests", match: "/vendor/requests" },
  { to: "/vendor/earnings", icon: Wallet, label: "Earnings", match: "/vendor/earnings" },
  { to: "/profile", icon: User, label: "You", match: "/profile" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const activeMode = useApp((s) => s.currentUser.activeMode);
  const items = activeMode === "vendor" ? vendorItems : buyerItems;

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 flex items-center justify-between z-40">
      {items.map(({ to, icon: Icon, label, match }) => {
        const active =
          match === "/vendor"
            ? pathname === "/vendor"
            : pathname === match || pathname.startsWith(match + "/");
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-0.5 flex-1 py-1 transition",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "p-2 rounded-full transition",
                active && "bg-accent"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
            </span>
            <span className="text-[10px] font-semibold leading-none">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
