import { Shield, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrustBadge({
  icon: Icon = Shield,
  label,
  className,
}: {
  icon?: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 bg-accent text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full",
        className
      )}
    >
      <Icon size={13} />
      {label}
    </span>
  );
}
