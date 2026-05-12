import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Layers, Database, Gauge, ShieldCheck, Zap, LineChart } from "lucide-react";
import { PlatformNav } from "@/components/platform/PlatformNav";
import { PlatformFooter } from "@/components/platform/PlatformFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechAI Labs — The OS for modern dental clinics" },
      {
        name: "description",
        content:
          "AI-native website generation, SEO infrastructure, and patient engagement for 100,000+ dental clinics. One engine. Infinite clinic experiences.",
      },
      { property: "og:title", content: "TechAI Labs — Dental OS" },
      { property: "og:description", content: "One rendering engine. Infinite clinic experiences." },
    ],
  }),
  component: Landing,
});

const featured = [
  { slug: "sydney-smile-dental", city: "Sydney", name: "Sydney Smile Dental", theme: "Modern Minimal", color: "#0b6cf2" },
  { slug: "newyork-family-dental", city: "New York", name: "NewYork Family Dental", theme: "Family Friendly", color: "#15b78a" },
  { slug: "london-cosmetic-care", city: "London", name: "London Cosmetic Care", theme: "Luxury Cosmetic", color: "#c9a25a" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PlatformNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-aurora opacity-90" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-24 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_290)]" />
              Generation 03 · 100,000+ clinic experiences
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              The <span className="text-gradient-brand">operating system</span>
              <br /> for modern dental clinics.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
              One rendering engine. Infinite clinic experiences. TechAI Labs generates,
              optimises and operates premium clinic websites at city, country and continental scale.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                Explore live clinics <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-6 py-3 text-sm text-foreground backdrop-blur transition hover:border-foreground/40"
              >
                Open admin console
              </Link>
            </div>
          </motion.div>

          {/* preview card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto mt-20 max-w-5xl"
          >
            <div className="glass rounded-3xl p-2 ring-brand">
              <div className="rounded-[1.25rem] bg-[oklch(0.18_0.02_265)] p-1">
                <div className="flex items-center gap-1.5 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.65_0.2_25)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.82_0.15_85)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.17_150)]/70" />
                  <div className="ml-3 flex-1 rounded-md bg-background/40 px-3 py-1 text-xs text-muted-foreground">
                    dentist.techailabs.com/clinic/sydney-smile-dental
                  </div>
                </div>
                <div className="grid gap-2 rounded-2xl bg-background/40 p-6 sm:grid-cols-3">
                  {featured.map((f, i) => (
                    <motion.div
                      key={f.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="group relative overflow-hidden rounded-xl border border-border/70 p-5"
                    >
                      <div
                        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl transition group-hover:opacity-70"
                        style={{ background: f.color }}
                      />
                      <p className="relative text-xs uppercase tracking-widest text-muted-foreground">{f.city}</p>
                      <p className="relative mt-1 font-display text-lg">{f.name}</p>
                      <p className="relative mt-3 text-xs text-muted-foreground">{f.theme}</p>
                      <Link
                        to="/clinic/$slug"
                        params={{ slug: f.slug }}
                        className="relative mt-4 inline-flex items-center gap-1 text-xs text-foreground/90 underline-offset-4 hover:underline"
                      >
                        Open preview <ArrowRight className="h-3 w-3" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border/60 bg-surface/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden border-x border-border/60 sm:grid-cols-4">
          {[
            ["100k+", "clinics supported"],
            ["1", "rendering engine"],
            ["<40ms", "edge response"],
            ["6–8", "pages per clinic"],
          ].map(([v, l]) => (
            <div key={l} className="bg-background px-6 py-10 text-center">
              <p className="font-display text-3xl tracking-tight">{v}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-[oklch(0.78_0.18_290)]">Architecture</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            One template engine.
            <br /> <span className="text-gradient">Every clinic, dynamically rendered.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            We do not generate 100,000 unique websites. We render 100,000 unique experiences from a single
            database-driven engine — composable sections, live theming, and SEO localisation per city.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { i: Database, t: "Database-driven", d: "Clinic data lives as records. Sections read from them — never hardcoded." },
            { i: Layers, t: "Composable template", d: "Reusable sections: hero, services, reviews, FAQ, contact. 90% template / 10% data." },
            { i: Sparkles, t: "Live theming", d: "Five clinic vibes. CSS variables flip in real time — no rebuild required." },
            { i: Gauge, t: "Edge rendering", d: "Slug-based routing on the edge. Sub-40ms TTFB even at 100k clinics." },
            { i: ShieldCheck, t: "Wellness-first", d: "Preventive care framing. Never diagnostic claims. Compliant copy templates." },
            { i: LineChart, t: "SEO infrastructure", d: "Per-city metadata, schema markup, canonical URLs — generated automatically." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="relative overflow-hidden rounded-2xl border border-border/70 bg-surface p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-surface-2">
                <Icon className="h-5 w-5 text-foreground/80" />
              </div>
              <p className="mt-5 font-display text-xl">{t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DENTA HEALTH */}
      <section className="relative overflow-hidden border-t border-border/60">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-[oklch(0.82_0.14_200)]">Denta.Health</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                Oral wellness, <br /> patient engagement, on autopilot.
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Once a clinic claims their experience, Denta.Health activates: WhatsApp booking,
                review automation, smile tips, and preventive-care reminders — all wellness-first.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["WhatsApp booking", "Review automation", "Smile tips", "SEO dashboard", "Patient engagement"].map(
                  (c) => (
                    <span key={c} className="rounded-full border border-border/70 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                      {c}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Live preview</p>
                    <p className="mt-1 font-display text-xl">Sydney Smile Dental</p>
                  </div>
                  <Zap className="h-5 w-5 text-[oklch(0.78_0.18_290)]" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ["AI score", "92"],
                    ["SEO score", "88"],
                    ["Reviews", "248"],
                    ["Rating", "4.9★"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-border/70 bg-surface p-4">
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</p>
                      <p className="mt-1 font-display text-2xl">{v}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/clinic/$slug"
                  params={{ slug: "sydney-smile-dental" }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-background"
                >
                  View live site <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-28 text-center">
        <h2 className="font-display text-4xl tracking-tight sm:text-6xl">
          Ready to see your clinic, <span className="text-gradient-brand">live in 30 seconds?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Browse demo experiences across cities, claim your clinic, and let TechAI Labs launch the rest.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/explore" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background">
            Explore clinics
          </Link>
          <Link to="/admin" className="rounded-full border border-border/70 px-6 py-3 text-sm">
            Admin console
          </Link>
        </div>
      </section>

      <PlatformFooter />
    </div>
  );
}
