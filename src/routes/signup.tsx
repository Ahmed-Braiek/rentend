import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, Mail, Phone, Calendar, Lock, EyeOff } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Rented" }] }),
  component: SignUp,
});

function Field({ icon: Icon, ...props }: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        {...props}
        className="w-full bg-white border border-border/60 shadow-sm rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
      />
    </div>
  );
}

function SignUp() {
  const navigate = useNavigate();
  const setAuthed = useApp((s) => s.setAuthed);
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

        <div className="flex-1 px-6 pb-12 relative z-10 flex flex-col justify-center -mt-2">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-ink tracking-tight">
              Create Account
            </h1>
            <p className="mt-2 text-muted-foreground font-medium text-sm">
              Join the community and start renting the things you need
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            <Field icon={User} placeholder="Full name" />
            <Field icon={Mail} placeholder="Email address" type="email" />
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <div className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-muted-foreground border-r border-border pr-2">+216</div>
              <input
                className="w-full bg-white border border-border/60 shadow-sm rounded-2xl pl-24 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="00 000 000"
              />
            </div>
            <Field icon={Calendar} placeholder="Age" type="number" />
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white border border-border/60 shadow-sm rounded-2xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <EyeOff size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full bg-white border border-border/60 shadow-sm rounded-2xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <EyeOff size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            <button type="submit" className="w-full bg-ink text-white rounded-full py-4 font-bold text-lg shadow-xl shadow-ink/20 hover:bg-ink/90 transition-all hover:scale-[1.02] active:scale-[0.98] mt-6">
              Create account
            </button>
            
            <div className="mt-8 text-center text-sm font-medium text-muted-foreground pb-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </MobileShell>
  );
}
