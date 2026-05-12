import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function PlatformNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.72_0.18_255)] to-[oklch(0.78_0.18_290)] shadow-[var(--shadow-glow)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-xl tracking-tight">TechAI Labs</span>
          <span className="ml-1 hidden rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
            Dental OS
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/" className="hover:text-foreground transition">Platform</Link>
          <Link to="/explore" className="hover:text-foreground transition">Explore clinics</Link>
          <Link to="/admin" className="hover:text-foreground transition">Admin</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="hidden rounded-full border border-border/70 px-4 py-1.5 text-sm text-foreground/80 transition hover:border-foreground/40 hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Launch demo
          </Link>
        </div>
      </div>
    </header>
  );
}
