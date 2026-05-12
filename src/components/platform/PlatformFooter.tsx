export function PlatformFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-muted-foreground">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg text-foreground">TechAI Labs</p>
            <p className="mt-1 max-w-md">
              The operating system for modern dental clinics — AI-native website generation, SEO infrastructure, and patient engagement.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/60">Product</p>
              <ul className="mt-2 space-y-1">
                <li>Website engine</li>
                <li>SEO dashboard</li>
                <li>Denta.Health</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/60">Company</p>
              <ul className="mt-2 space-y-1">
                <li>About</li>
                <li>Pricing</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} TechAI Labs. Wellness-first patient engagement.
        </p>
      </div>
    </footer>
  );
}
