import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MobileShell({
  children,
  className,
  bg = "surface",
}: {
  children: ReactNode;
  className?: string;
  bg?: "surface" | "white" | "primary";
}) {
  const bgClass =
    bg === "white" ? "bg-card" : bg === "primary" ? "bg-primary" : "bg-surface";
  return (
    <div className="min-h-screen w-full bg-[oklch(0.94_0.005_150)] flex justify-center">
      <div
        className={cn(
          "w-full max-w-[440px] min-h-screen relative shadow-[0_0_40px_rgba(0,0,0,0.06)]",
          bgClass,
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
