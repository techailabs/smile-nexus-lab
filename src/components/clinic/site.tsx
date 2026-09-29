import { createContext, useContext, type ReactNode } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Phone, MapPin, Star, Clock, ArrowRight, ShieldCheck, Sparkles, Heart,
  Award, Users, Smile, Stethoscope, CalendarCheck, ChevronRight, Quote,
} from "lucide-react";
import type { Clinic } from "@/lib/clinic-types";
import { clinicDepth } from "@/lib/clinic-depth";
import { Button } from "@/components/ui/button";
import { svcTitle, svcDesc, svcSlug, faqQ, faqA, revName, revText, verticalMeta, templatePreset } from "@/lib/clinic-types";

// ---------- Context ----------

type Ctx = { clinic: Clinic };
const ClinicCtx = createContext<Ctx | null>(null);
export function ClinicProvider({ clinic, children }: { clinic: Clinic; children: ReactNode }) {
  return <ClinicCtx.Provider value={{ clinic }}>{children}</ClinicCtx.Provider>;
}
export function useClinic() {
  const c = useContext(ClinicCtx);
  if (!c) throw new Error("useClinic must be used within ClinicProvider");
  return c.clinic;
}

export function useClinicMood() {
  const c = useClinic();
  return templatePreset(c.template_key).mood;
}

// ---------- Imagery (premium Unsplash dental visuals) ----------

export const IMG = {
  hero: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=2200&q=80",
  smile: "https://images.unsplash.com/photo-1581585099522-f6ac2efe6217?auto=format&fit=crop&w=1600&q=80",
  interior: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
  team: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600&q=80",
  patient: "https://images.unsplash.com/photo-1559131397-f94da358f7ca?auto=format&fit=crop&w=1600&q=80",
  chair: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1600&q=80",
  family: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
  before1: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=900&q=80",
  before2: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=900&q=80",
  before3: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=900&q=80",
  before4: "https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&w=900&q=80",
  before5: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80",
  before6: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
};

// ---------- Site Nav ----------

const NAV = [
  { to: "/clinic/$slug", label: "Home" },
  { to: "/clinic/$slug/services", label: "Services" },
  { to: "/clinic/$slug/about", label: "About" },
  { to: "/clinic/$slug/team", label: "Team", needs: "team" },
  { to: "/clinic/$slug/reviews", label: "Reviews", needs: "reviews" },
  { to: "/clinic/$slug/patient-info", label: "Patient Info", needs: "patientInfo" },
  { to: "/clinic/$slug/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const clinic = useClinic();
  const { slug } = useParams({ from: "/clinic/$slug" });
  const meta = verticalMeta(clinic.vertical);
  const nav = NAV.filter(n => !("needs" in n) || clinicDepth(clinic)[n.needs as keyof ReturnType<typeof clinicDepth>]);
  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/clinic/$slug" params={{ slug }} className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-full text-white shadow-sm"
            style={{ background: "var(--clinic-primary)" }}
          >
            <span className="font-display text-base">{clinic.clinic_name.charAt(0)}</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-[19px] tracking-tight">{clinic.clinic_name}</p>
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-neutral-500">
              {clinic.city} · {meta.navTagline}
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-4 whitespace-nowrap text-[13px] xl:flex">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to as "/clinic/$slug"}
              params={{ slug }}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-neutral-900" }}
              inactiveProps={{ className: "text-neutral-500 hover:text-neutral-900" }}
              className="transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {clinic.phone && <a href={`tel:${clinic.phone}`} className="hidden whitespace-nowrap text-sm text-neutral-600 hover:text-neutral-900 xl:inline">
            {clinic.phone}
          </a>}
          <Link
            to="/clinic/$slug/contact"
            params={{ slug }}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90"
            style={{ background: "var(--clinic-primary)" }}
          >
            Book a visit <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ---------- Site Footer ----------

export function SiteFooter({ onClaim }: { onClaim: () => void }) {
  const clinic = useClinic();
  const { slug } = useParams({ from: "/clinic/$slug" });
  const nav = NAV.filter(n => !("needs" in n) || clinicDepth(clinic)[n.needs as keyof ReturnType<typeof clinicDepth>]);
  return (
    <footer className="border-t border-black/[0.06] bg-[oklch(0.985_0.003_250)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-full text-white"
              style={{ background: "var(--clinic-primary)" }}
            >
              <span className="font-display text-base">{clinic.clinic_name.charAt(0)}</span>
            </div>
            <p className="font-display text-2xl tracking-tight">{clinic.clinic_name}</p>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-600">
            {clinic.short_description || clinic.tagline || `Dental care in ${clinic.city}.`}
          </p>
          {clinic.review_count > 0 && <div className="mt-6 flex items-center gap-2 text-sm text-neutral-700"><Star className="h-4 w-4 fill-current" style={{ color: "var(--clinic-primary)" }} />{Number(clinic.rating).toFixed(1)} · {clinic.review_count} reviews</div>}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Explore</p>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.slice(1).map((n) => (
              <li key={n.label}>
                <Link
                  to={n.to as "/clinic/$slug"}
                  params={{ slug }}
                  className="text-neutral-700 transition hover:text-neutral-950"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Visit</p>
          <ul className="mt-5 space-y-3 text-sm text-neutral-700">
            {clinic.address && <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {clinic.address}</li>}
            {clinic.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {clinic.phone}</li>}
            {clinic.email && <li className="flex items-center gap-2"><CalendarCheck className="h-4 w-4" /> {clinic.email}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-black/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-[11.5px] text-neutral-500 sm:flex-row sm:items-center lg:px-10">
          <p>© {new Date().getFullYear()} {clinic.clinic_name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Accessibility</span>
            <Button variant="ghost" size="sm" onClick={onClaim}>Manage this site</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------- Reusable premium sections ----------

export function PageHeader({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro?: string; image?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.05]">
      <div className={`mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:px-10 ${image ? "lg:grid-cols-[1.1fr_1fr] lg:py-24" : "lg:py-20"}`}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--clinic-primary)" }}>{eyebrow}</p>
          <h1 className="mt-5 font-display text-5xl leading-[1.04] tracking-tight md:text-6xl">{title}</h1>
          {intro && <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-neutral-600">{intro}</p>}
        </div>
        {image && (
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem]" style={{ background: "color-mix(in oklab, var(--clinic-primary) 10%, transparent)" }} />
            <img src={image} alt="" className="h-full max-h-[460px] w-full rounded-[1.75rem] object-cover shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]" />
          </div>
        )}
      </div>
    </section>
  );
}

export function HomeHero() {
  const clinic = useClinic();
  const { slug } = useParams({ from: "/clinic/$slug" });

  const copy = { eyebrow: `Dental practice · ${clinic.city}`, cta: 'Request a visit' };

  const heroImage = clinic.hero_image;

  return (
    <section className="relative isolate overflow-hidden bg-white">

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className={`mx-auto grid max-w-7xl gap-12 px-6 py-16 md:py-20 lg:gap-20 lg:px-10 ${heroImage ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--clinic-primary)" }} />
            {copy.eyebrow}
          </span>
          <h1 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.05] tracking-[-0.02em] text-neutral-950">
            {clinic.clinic_name}
          </h1>
          <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-neutral-600">
            {clinic.short_description || clinic.tagline || `Dental care in ${clinic.city}. Explore the services available at our practice.`}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/clinic/$slug/contact"
              params={{ slug }}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[13.5px] font-medium text-white shadow-[0_18px_40px_-15px_color-mix(in_oklab,var(--clinic-primary)_60%,transparent)] transition hover:opacity-95"
              style={{ background: "var(--clinic-primary)" }}
            >
              {copy.cta} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/clinic/$slug/services"
              params={{ slug }}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] bg-white px-6 py-3.5 text-[13.5px] font-medium text-neutral-900 transition hover:border-black/30"
            >
              View treatments
            </Link>
            {clinic.phone && (
              <a href={`tel:${clinic.phone}`} className="ml-1 hidden items-center gap-2 text-[13.5px] text-neutral-600 hover:text-neutral-900 md:inline-flex">
                <Phone className="h-3.5 w-3.5" /> {clinic.phone}
              </a>
            )}
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-8 border-t border-black/[0.07] pt-7">
            {[
              ...(clinic.review_count > 0 ? [[`${Number(clinic.rating).toFixed(1)}★`, `${clinic.review_count} reviews`]] : []),
              ...(clinic.years_experience ? [[`${clinic.years_experience}`, "years of experience"]] : []),
              ...(clinic.address ? [[clinic.city, "Visit our practice"]] : []),
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-2xl tracking-tight text-neutral-950 md:text-[28px]">{v}</p>
                <p className="mt-1 text-[10.5px] uppercase tracking-[0.18em] text-neutral-500">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative hidden lg:block"
        >
          {heroImage && <div className="relative">
            <div
              className="absolute -inset-3 -z-10 rounded-[2rem]"
              style={{ background: "color-mix(in oklab, var(--clinic-primary) 10%, transparent)" }}
            />
            <img
              src={heroImage}
              alt={`${clinic.clinic_name} practice`}
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover ring-1 ring-black/[0.06]"
            />
          </div>}
        </motion.div>
      </div>
    </section>
  );
}

export function TrustBar() {
  const clinic = useClinic();
  const items = [
    ...(clinic.review_count > 0 ? [{ icon: Star, text: `${Number(clinic.rating).toFixed(1)} · ${clinic.review_count} reviews` }] : []),
    ...(clinic.years_experience ? [{ icon: Award, text: `${clinic.years_experience} years of experience` }] : []),
    ...(clinic.address ? [{ icon: MapPin, text: clinic.city }] : []),
    ...(clinic.emergency_available ? [{ icon: Phone, text: "Emergency care available" }] : []),
    ...(clinic.insurance?.length ? [{ icon: ShieldCheck, text: "Insurance information available" }] : []),
  ];
  if (!items.length) return null;
  return <section className="border-y border-black/[0.05] bg-[oklch(0.985_0.003_250)]"><div className="mx-auto flex max-w-7xl flex-wrap gap-8 px-6 py-7 lg:px-10">{items.map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-2 text-sm text-neutral-700"><Icon className="h-4 w-4" style={{ color: "var(--clinic-primary)" }} />{text}</div>)}</div></section>;
}

const SERVICE_ICONS: Record<string, typeof Smile> = {
  default: Smile,
};

export function ServicesGrid({ limit }: { limit?: number }) {
  const clinic = useClinic();
  const { slug } = useParams({ from: "/clinic/$slug" });
  const services = limit ? clinic.services.slice(0, limit) : clinic.services;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => {
        const title = svcTitle(s);
        const Icon = SERVICE_ICONS[title] ?? Stethoscope;
        const sslug = svcSlug(s);
        return (
          <motion.div
            key={svcSlug(s) || title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: Math.min(i * 0.04, 0.25), duration: 0.5 }}
          >
          <Link
            to="/clinic/$slug/services/$serviceSlug"
            params={{ slug, serviceSlug: sslug }}
            className="group block h-full rounded-[1.5rem] border border-black/[0.06] bg-white p-8 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]"
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl text-white"
              style={{ background: "var(--clinic-primary)" }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-6 font-display text-2xl tracking-tight">{title}</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-neutral-600">{svcDesc(s)}</p>
            <div className="mt-6 inline-flex items-center gap-1 text-[12.5px] text-neutral-500 transition group-hover:text-neutral-900">
              Learn more <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

export function WhyChooseUs() {
  const clinic = useClinic();
  if (!clinic.long_description && !clinic.about_us) return null;
  return <section className="border-t border-black/[0.05]"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-2 lg:px-10"><h2 className="font-display text-4xl">Get to know {clinic.clinic_name}.</h2><p className="whitespace-pre-line leading-relaxed text-neutral-700">{clinic.long_description || clinic.about_us}</p></div></section>;
}

export function GalleryStrip() {
  const clinic = useClinic();
  const imgs = clinic.gallery_images || [];
  if (!imgs.length) return null;
  return <section className="border-t border-black/[0.05] bg-[oklch(0.98_0.003_250)]"><div className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><h2 className="font-display text-4xl">Images for {clinic.clinic_name}.</h2><div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">{imgs.map((src,i) => <img key={src} src={src} alt={`Gallery image ${i+1}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />)}</div></div></section>;
}

export function TestimonialLarge() {
  const clinic = useClinic();
  const r = clinic.reviews[0];
  if (!r) return null;
  return (
    <section className="border-t border-black/[0.05]">
      <div className="mx-auto max-w-5xl px-6 py-32 text-center lg:px-10">
        <Quote className="mx-auto h-8 w-8 text-neutral-300" />
        <p className="mt-8 font-display text-3xl leading-[1.25] tracking-tight md:text-4xl">
          "{revText(r)}"
        </p>
        <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-neutral-500">— {revName(r)}</p>
      </div>
    </section>
  );
}

export function ReviewsGrid() {
  const clinic = useClinic();
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {clinic.reviews.map((r, i) => (
        <div key={`${revName(r)}-${i}`} className="rounded-[1.5rem] border border-black/[0.06] bg-white p-7">
          <div className="flex" style={{ color: "var(--clinic-primary)" }}>
            {Array.from({ length: r.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-neutral-800">"{revText(r)}"</p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-neutral-500">— {revName(r)}{r.source ? ` · ${r.source}` : ""}</p>
        </div>
      ))}
    </div>
  );
}

export function TeamTeaser() {
  const clinic = useClinic();
  const { slug } = useParams({ from: "/clinic/$slug" });
  if (!clinic.team?.length) return null;
  return <section className="border-t border-black/[0.05]"><div className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><p className="text-sm" style={{ color: "var(--clinic-primary)" }}>The people behind the practice</p><h2 className="mt-3 font-display text-4xl">Meet the team.</h2><div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{clinic.team.slice(0,3).map(person => <div key={person.doctor_name}>{person.image && <img src={person.image} alt={person.doctor_name} loading="lazy" className="aspect-[4/3] w-full object-cover" />}<h3 className="mt-4 font-display text-xl">{person.doctor_name}</h3>{person.role && <p className="text-sm text-neutral-600">{person.role}</p>}</div>)}</div><Link to="/clinic/$slug/team" params={{slug}} className="mt-8 inline-flex items-center gap-2 text-sm underline">View the team <ArrowRight className="size-4" /></Link></div></section>;
}

export function FaqList({ limit }: { limit?: number }) {
  const clinic = useClinic();
  const faqs = limit ? clinic.faqs.slice(0, limit) : clinic.faqs;
  return (
    <div className="divide-y divide-black/[0.06] rounded-[1.5rem] border border-black/[0.06] bg-white">
      {faqs.map((f, i) => (
        <details key={`${faqQ(f)}-${i}`} className="group px-7 py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16.5px] font-medium text-neutral-900">
            {faqQ(f)}
            <span className="text-neutral-400 transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-neutral-600">{faqA(f)}</p>
        </details>
      ))}
    </div>
  );
}

export function FinalCta() {
  const clinic = useClinic();
  const { slug } = useParams({ from: "/clinic/$slug" });
  return <section className="border-t border-black/[0.06] bg-[oklch(0.985_0.003_250)]"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-20 md:flex-row md:items-center lg:px-10"><div><p className="text-sm" style={{color:"var(--clinic-primary)"}}>Your next visit</p><h2 className="mt-2 max-w-2xl font-display text-4xl">Connect with {clinic.clinic_name}.</h2><p className="mt-4 text-neutral-600">Tell us what you need and the practice can follow up with you.</p></div><div className="flex shrink-0 flex-wrap gap-3"><Link to="/clinic/$slug/contact" params={{slug}} className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white">Request an appointment <ArrowRight className="size-4" /></Link>{clinic.phone && <a href={`tel:${clinic.phone}`} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-6 py-3 text-sm"><Phone className="size-4" />Call the practice</a>}</div></div></section>;
}

export function HoursCard() {
  const clinic = useClinic();
  const hours = (clinic.business_hours && Object.keys(clinic.business_hours).length ? clinic.business_hours : clinic.hours) || {};
  return (
    <div className="rounded-[1.5rem] border border-black/[0.06] bg-white p-8">
      <p className="font-display text-2xl tracking-tight">Opening hours</p>
      <ul className="mt-6 space-y-3 text-sm">
        {Object.entries(hours).map(([k, v]) => (
          <li key={k} className="flex items-center justify-between border-b border-black/[0.05] pb-3 last:border-0">
            <span className="inline-flex items-center gap-2 text-neutral-500"><Clock className="h-3.5 w-3.5" /> {k}</span>
            <span className="text-neutral-900">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- WhatsApp floating button (per-clinic) ----------

export function WhatsAppFab() {
  const clinic = useClinic();
  const num = (clinic.whatsapp_number || "").replace(/[^\d]/g, "");
  if (!num) return null;
  const msg = encodeURIComponent(`Hi ${clinic.clinic_name}, I'd like to book a consultation.`);
  return (
    <a
      href={`https://wa.me/${num}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${clinic.clinic_name} on WhatsApp`}
      className="fixed bottom-20 left-4 z-40 hidden md:bottom-6 md:inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-medium text-white shadow-[0_15px_40px_-10px_rgba(37,211,102,0.6)] transition hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
      </svg>
      Chat
    </a>
  );
}

// ---------- SEO + JSON-LD per clinic ----------

export function ClinicSEO() {
  const clinic = useClinic();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.clinic_name,
    description: clinic.meta_description || clinic.short_description || clinic.tagline,
    image: clinic.hero_image,
    url: clinic.canonical_url || clinic.website,
    telephone: clinic.phone,
    email: clinic.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address,
      addressLocality: clinic.city,
      addressRegion: clinic.state || clinic.geo_target_region,
      postalCode: clinic.zip_code,
      addressCountry: clinic.country,
    },
    geo: clinic.lat && clinic.lng ? { "@type": "GeoCoordinates", latitude: clinic.lat, longitude: clinic.lng } : undefined,
    aggregateRating: clinic.review_count > 0 ? {
      "@type": "AggregateRating",
      ratingValue: clinic.rating,
      reviewCount: clinic.review_count,
    } : undefined,
    hasOfferCatalog: clinic.services.length ? { "@type": "OfferCatalog", name: "Dental services", itemListElement: clinic.services.map((s) => ({ "@type": "OfferCatalog", name: svcTitle(s) })) } : undefined,
  };
  const faqLd = clinic.faqs.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: clinic.faqs.map((f) => ({
      "@type": "Question",
      name: faqQ(f),
      acceptedAnswer: { "@type": "Answer", text: faqA(f) },
    })),
  } : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />}
    </>
  );
}

// ---------- Premium Map section ----------

export function MapSection() {
  const clinic = useClinic();
  if (!clinic.google_maps_embed && !clinic.address) return null;
  const directions = clinic.lat && clinic.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address || clinic.clinic_name)}`;
  return (
    <section className="border-t border-black/[0.05] bg-[oklch(0.985_0.003_250)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[1fr_1.4fr] lg:px-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--clinic-primary)" }}>Visit us</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">Find {clinic.clinic_name}.</h2>
          {clinic.address && <p className="mt-6 flex items-start gap-2 text-[15px] text-neutral-700"><MapPin className="mt-1 h-4 w-4 shrink-0" /> {clinic.address}</p>}
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white"
            style={{ background: "var(--clinic-primary)" }}
          >
            Get directions <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.2)]">
          {clinic.google_maps_embed ? (
            <iframe
              src={clinic.google_maps_embed}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${clinic.clinic_name}`}
            />
          ) : (
            <div className="grid h-[420px] place-items-center text-sm text-neutral-500">Map preview unavailable</div>
          )}
        </div>
      </div>
    </section>
  );
}
