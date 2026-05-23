import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome — Rented" }] }),
  component: Welcome,
});

function Welcome() {
  return (
    <MobileShell bg="white">
      <div className="flex flex-col min-h-screen relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-1/2 left-0 w-[300px] h-[300px] bg-secondary/30 rounded-full blur-2xl -translate-x-1/2" />

        <div className="flex-1 flex flex-col justify-center items-center p-8 z-10">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm mb-8 border border-white">
            <Logo size={80} />
          </div>
          <h1 className="text-4xl font-extrabold text-ink text-center tracking-tight leading-[1.1]">
            Rent <span className="text-primary">Smarter</span>. <br /> Live Better.
          </h1>
          <p className="mt-4 text-center text-muted-foreground max-w-xs text-[15px] leading-relaxed">
            The most trusted marketplace for tools, gear, and furniture in Tunisia.
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border-t border-white/40 p-8 pb-12 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
          <div className="flex flex-col gap-4">
            <Link
              to="/signin"
              className="bg-ink text-white rounded-full py-4 text-center font-bold text-lg shadow-md hover:bg-ink/90 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-white text-ink border border-border rounded-full py-4 text-center font-bold text-lg shadow-sm hover:bg-secondary/50 transition-colors"
            >
              Create Account
            </Link>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground font-medium">
            By continuing, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </MobileShell>
  );
}
