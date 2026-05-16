import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Clinic } from "@/lib/clinic-types";
import { templatePreset, verticalMeta } from "@/lib/clinic-types";
import { ClinicProvider, SiteNav, SiteFooter, WhatsAppFab, ClinicSEO } from "@/components/clinic/site";
import { CustomizerPanel, type ClinicTheme } from "@/components/clinic/CustomizerPanel";
import { ClaimModal } from "@/components/clinic/ClaimModal";

export const Route = createFileRoute("/clinic/$slug")({
  head: ({ params }) => {
    const name = formatSlug(params.slug);
    return {
      meta: [
        { title: `${name} — Book online` },
        { name: "description", content: `${name} — modern, trusted local services. Book online, view services, reviews and contact.` },
        { property: "og:title", content: name },
        { property: "og:description", content: `${name} — book online today.` },
      ],
    };
  },
  component: ClinicLayout,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-white text-center text-neutral-900">
      <div>
        <p className="font-display text-6xl">Not found</p>
        <a href="/explore" className="mt-4 inline-block text-sm text-neutral-500 hover:text-neutral-900">
          ← Back to clinics
        </a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center bg-white text-center text-neutral-900">
      <div>
        <p className="font-display text-3xl">Something went wrong</p>
        <p className="mt-2 text-sm text-neutral-500">{error.message}</p>
      </div>
    </div>
  ),
});

function formatSlug(s: string) {
  return s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function deviceMaxWidth(d: ClinicTheme["device"]) {
  if (d === "mobile") return 430;
  if (d === "tablet") return 900;
  return undefined;
}

function ClinicLayout() {
  const { slug } = Route.useParams();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [theme, setTheme] = useState<ClinicTheme>({
    primary: "#0b6cf2",
    secondary: "#0e1a33",
    radius: 1,
    vibe: "modern-minimal",
    mode: "light",
    device: "desktop",
  });

  useEffect(() => {
    supabase
      .from("clinics")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setMissing(true);
        } else {
          const c = data as unknown as Clinic;
          setClinic(c);
          const preset = templatePreset(c.template_key);
          setTheme((t) => ({
            ...t,
            primary: c.primary_color || preset.primary,
            secondary: c.secondary_color || preset.secondary,
            vibe: c.template_key || c.theme,
          }));
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-white text-sm text-neutral-500">Loading…</div>;
  }
  if (missing || !clinic) throw notFound();

  const maxW = deviceMaxWidth(theme.device);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Preview framing — this is a private demo prepared for the clinic to review */}
      <div className="relative z-40 border-b border-black/[0.08] bg-neutral-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-[11.5px] lg:px-10">
          <div className="flex items-center gap-2 text-white/85">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="uppercase tracking-[0.2em] text-white/60">Private preview</span>
            <span className="text-white/30">·</span>
            <span className="truncate">Prepared for <span className="text-white">{clinic.clinic_name}</span> — claim to deploy on your own domain.</span>
          </div>
          <button
            onClick={() => setClaimOpen(true)}
            className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-neutral-900 transition hover:bg-white/90"
          >
            Claim this site
          </button>
        </div>
      </div>

      <div
        className="light-clinic clinic-root mx-auto min-h-screen bg-white text-neutral-900 transition-all"
        style={
          {
            maxWidth: maxW,
            "--clinic-primary": theme.primary,
            "--clinic-secondary": theme.secondary,
            "--clinic-radius": `${theme.radius}rem`,
          } as React.CSSProperties
        }
      >
        <ClinicProvider clinic={clinic}>
          <ClinicSEO />
          <SiteNav />
          <main>
            <Outlet />
          </main>
          <SiteFooter onClaim={() => setClaimOpen(true)} />
          <WhatsAppFab />
        </ClinicProvider>
      </div>

      <CustomizerPanel theme={theme} onChange={setTheme} />
      <ClaimModal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        clinicId={clinic.id}
        clinicSlug={clinic.slug}
        clinicName={clinic.clinic_name}
      />
    </div>
  );
}
