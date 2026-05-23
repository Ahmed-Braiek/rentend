import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign in — Rented" }] }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const setAuthed = useApp((s) => s.setAuthed);
  const [show, setShow] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthed(true);
    navigate({ to: "/home" });
  };

  return (
    <MobileShell bg="white">
      <div className="flex flex-col min-h-screen relative overflow-hidden bg-white">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        <header className="p-6 relative z-20 flex items-center">
          <Link to="/welcome" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-border shadow-sm hover:bg-secondary transition">
            <ArrowLeft size={20} className="text-ink" />
          </Link>
        </header>

        <div className="flex-1 px-6 pb-12 relative z-10 flex flex-col justify-center -mt-6">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-ink tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-muted-foreground font-medium">
              Sign in to continue to Rented.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink ml-1 uppercase tracking-wider">Email</label>
              <input
                type="text"
                placeholder="mohamed@rented.tn"
                className="w-full bg-white border border-border/60 shadow-sm rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                defaultValue="mohamed@rented.tn"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white border border-border/60 shadow-sm rounded-2xl px-5 py-4 text-sm pr-12 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  defaultValue="demo1234"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink transition"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right pb-4">
              <button type="button" className="text-sm font-semibold text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="w-full bg-ink text-white rounded-full py-4 font-bold text-lg shadow-xl shadow-ink/20 hover:bg-ink/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Sign In
            </button>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-border/80" />
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-border/80" />
            </div>

            <button
              type="button"
              onClick={submit}
              className="w-full bg-white border border-border/80 rounded-full py-4 px-6 flex items-center justify-center gap-3 shadow-sm hover:bg-secondary/50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-bold text-ink">Continue with Google</span>
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
