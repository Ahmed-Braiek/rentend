import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Search, ShieldCheck, Zap, Handshake } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Rented — Turn idle objects into opportunity" }] }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans overflow-x-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Logo size={24} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-ink">RENTED</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin" className="hidden sm:block text-sm font-bold text-ink hover:text-primary transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="bg-ink text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-ink/90 transition-all hover:scale-105 active:scale-95">
              Start Renting
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
          {/* Background Decorators */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/40 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-primary-dark text-xs font-bold tracking-widest uppercase border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Tunisia's #1 Marketplace
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-ink tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                Rent <span className="text-primary">Smarter</span>.<br />
                Live Better.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                Turn your idle gear into extra income, or access high-quality tools, electronics, and furniture for a fraction of the cost. Everything is fully insured.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <Link to="/signup" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover:-translate-y-1">
                  Explore Platform
                </Link>
                <Link to="/welcome" className="w-full sm:w-auto bg-white border-2 border-border text-ink px-8 py-4 rounded-full font-bold text-lg hover:border-primary hover:text-primary transition-all">
                  See Mobile Experience
                </Link>
              </div>
            </div>
            
            <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 hidden lg:block">
              {/* Mockup Frame */}
              <div className="relative mx-auto w-[320px] h-[650px] bg-black rounded-[3rem] border-[8px] border-black shadow-2xl overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 rounded-b-3xl w-1/2 mx-auto" /> {/* Notch */}
                <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=1600&fit=crop" alt="App interface" className="w-full h-full object-cover opacity-90" />
                
                {/* Floating UI Elements */}
                <div className="absolute top-32 -left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 animate-bounce">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Handshake size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold">Offer Accepted</div>
                    <div className="text-sm font-extrabold text-ink">Sony A7III · 45 DT/day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-card py-24 border-y border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Built for Trust & Speed</h2>
              <p className="mt-4 text-muted-foreground">Every interaction is designed to protect both lenders and borrowers while ensuring a seamless experience.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<ShieldCheck size={28} className="text-primary" />}
                title="AI Verification & Escrow"
                desc="Payments are securely held in escrow. AI-driven verification blocks bad actors before they interact."
              />
              <FeatureCard 
                icon={<Zap size={28} className="text-primary" />}
                title="Instant Insurance"
                desc="Up to 5,000 DT coverage generated automatically via video validation at handover."
              />
              <FeatureCard 
                icon={<Search size={28} className="text-primary" />}
                title="Hyper-Local Discovery"
                desc="Find what you need exactly when you need it, with proximity-based matching and direct negotiation."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-ink" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to join the ecosystem?</h2>
            <p className="text-xl text-white/80 mb-10">Sign up today and get your first rental transaction fee waived.</p>
            <Link to="/signup" className="inline-block bg-primary text-white px-10 py-5 rounded-full font-extrabold text-xl shadow-2xl hover:scale-105 transition-transform">
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white py-12 border-t border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Logo size={20} />
          <span className="font-bold text-ink">RENTED</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 Rented Marketplace. Prototype deployment.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow group">
      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-ink mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
