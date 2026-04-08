import { PreRegistrationForm } from '@/components/PreRegistrationForm';
import { CommunityHub } from '@/components/CommunityHub';
import { Dumbbell, Zap, MapPin, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CRTEffect } from '@/components/thegridcn/crt-effect';
import { DataCard } from '@/components/thegridcn/data-card';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function Home() {
  return (
    <CRTEffect intensity="light" className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-floor pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation Dummy */}
      <header className="relative z-10 border-b border-border/40 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl tracking-[0.2em] text-transparent text-gradient-cyber">
              REALITY<span className="text-white">QUEST</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8 font-mono text-sm uppercase tracking-wider text-muted-foreground mr-6">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#register" className="hover:text-primary transition-colors">Waitlist</a>
              <a href="#tavern" className="hover:text-primary transition-colors">Tavern</a>
            </nav>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col relative z-10 w-full">
        
        {/* HERO SECTION */}
        <section className="pt-24 pb-32 px-4 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            BETA SERVERS ONLINE SOON
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black leading-tight mb-6">
            <span className="text-white">LEVEL UP YOUR </span>
            <span className="text-transparent text-gradient-cyber block mt-2">LIFE</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-mono mb-6 leading-relaxed">
            Turn your real-world workouts, meals, and daily routines into virtual RPG stats. The ultimate fitness adventure is coming.
          </p>
          
          {/* Banner Video */}
          <div className="w-full max-w-4xl mx-auto mb-10 rounded-lg overflow-hidden border border-primary/30 glow-sm">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto object-cover opacity-80 mix-blend-screen"
            >
              <source src="/banner.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <a href="#register" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-primary font-display tracking-widest uppercase transition-all duration-300 btn-glow hover:-translate-y-1 rounded-sm">
            Join the Pre-Registration Waitlist
          </a>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="py-24 bg-black/40 border-y border-border/30 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Core Mechanics</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full glow-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
              <DataCard 
                title="Real-World Stats"
                subtitle="MECHANIC 1"
                status="active"
                fields={[
                  { label: "DESCRIPTION", value: "Physical effort builds in-game power" },
                  { label: "EXAMPLE", value: "Build Strength at the gym", highlight: true },
                ]}
                className="group hover:-translate-y-2 transition-transform"
              />
              <DataCard 
                title="Skill Progression"
                subtitle="MECHANIC 2"
                status="active"
                fields={[
                  { label: "DESCRIPTION", value: "Unlock active skills for combat" },
                  { label: "REQUIREMENT", value: "Reach stat milestones", highlight: true }
                ]}
                className="group hover:-translate-y-2 transition-transform"
              />
              <DataCard 
                title="Partnered Grounds"
                subtitle="MECHANIC 3"
                status="active"
                fields={[
                  { label: "DESCRIPTION", value: "Visit partnered gyms/dojos" },
                  { label: "REWARD", value: "Verified bonus loot", highlight: true }
                ]}
                className="group hover:-translate-y-2 transition-transform"
              />
              <DataCard 
                title="Guilds & Factions"
                subtitle="MECHANIC 4"
                status="active"
                fields={[
                  { label: "DESCRIPTION", value: "Compete in local leaderboards" },
                  { label: "ACTION", value: "Conquer world bosses", highlight: true }
                ]}
                className="group hover:-translate-y-2 transition-transform"
              />
            </div>
          </div>
        </section>

        {/* REGISTRATION SECTION */}
        <section id="register" className="py-32 px-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-white mb-6">Forge Your Legend</h2>
              <p className="text-muted-foreground font-mono text-lg mb-8">
                The servers are booting up. Secure your unique username now and receive the <span className="text-primary font-bold">"Pioneer's Amulet"</span> cosmetic item at launch.
              </p>
              <ul className="space-y-4 font-mono text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border border-primary/50 flex items-center justify-center bg-primary/10">
                    <CheckIcon />
                  </div>
                  Early access to the closed beta
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border border-primary/50 flex items-center justify-center bg-primary/10">
                    <CheckIcon />
                  </div>
                  Exclusive Discord role
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border border-primary/50 flex items-center justify-center bg-primary/10">
                    <CheckIcon />
                  </div>
                  Weekly developer updates
                </li>
              </ul>
            </div>
            <div>
              <PreRegistrationForm />
            </div>
          </div>
        </section>

        {/* COMMUNITY HUB SECTION */}
        <section id="tavern" className="py-24 bg-black/60 border-t border-border/30 relative">
          <div className="max-w-7xl mx-auto px-4">
            <CommunityHub />
          </div>
        </section>

      </main>

      <footer className="border-t border-border/40 py-8 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground font-mono text-sm tracking-widest">
            © {new Date().getFullYear()} REALITYQUEST. SYSTEM ONLINE.
          </p>
        </div>
      </footer>
    </CRTEffect>
  );
}



function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3L4.5 8.5L2 6" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
