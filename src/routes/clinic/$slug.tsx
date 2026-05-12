import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Clinic } from "@/lib/clinic-types";
import { ClinicProvider, SiteNav, SiteFooter, WhatsAppFab, ClinicSEO } from "@/components/clinic/site";
import { CustomizerPanel, type ClinicTheme } from "@/components/clinic/CustomizerPanel";
import { ClaimModal } from "@/components/clinic/ClaimModal";

export const Route = createFileRoute("/clinic/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${formatSlug(params.slug)} — Modern dental care` },
      { name: "description", content: `${formatSlug(params.slug)} — quietly modern dentistry. Book online, view services, gallery and reviews.` },
      { property: "og:title", content: `${formatSlug(params.slug)} — Modern dental care` },
      { property: "og:description", content: `Premium dental clinic experience.` },
    ],
  }),
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
          setTheme((t) => ({
            ...t,
            primary: c.primary_color,
            secondary: c.secondary_color,
            vibe: c.theme,
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
