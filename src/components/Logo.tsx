import icon from "@/assets/rented-icon.svg";
import { cn } from "@/lib/utils";

export function Logo({ size = 48, withWord = true, dark = false, className }: {
  size?: number; withWord?: boolean; dark?: boolean; className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <img src={icon} alt="" width={size} height={size} className="object-contain" style={{ height: size, width: size }} />
      {withWord && (
        <span
          className="font-display font-extrabold tracking-tight"
          style={{ fontSize: size * 0.7, lineHeight: 1 }}
        >
          <span className={dark ? "text-white" : "text-ink"}>rent</span>
          <span className="text-primary">ed</span>
        </span>
      )}
    </div>
  );
}
