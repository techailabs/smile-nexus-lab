import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublicClinic } from "@/lib/clinic.functions";
import { trackClinicEvent } from "@/lib/clinic-events";
import { Button } from "@/components/ui/button";
import { Phone, CalendarDays, MessageCircle } from "lucide-react";
import type { Clinic } from "@/lib/clinic-types";
import { templatePreset, verticalMeta } from "@/lib/clinic-types";
import { ClinicProvider, SiteNav, SiteFooter, WhatsAppFab, ClinicSEO } from "@/components/clinic/site";
import { CustomizerPanel, type ClinicTheme } from "@/components/clinic/CustomizerPanel";
import { ClaimModal } from "@/components/clinic/ClaimModal";
const ClinicAssistant = lazy(() => import("@/components/clinic/ClinicAssistant"));

export const Route = createFileRoute("/clinic/$slug")({
  loader: async ({ params, context }) => context.queryClient.ensureQueryData({ queryKey: ['clinic', params.slug], queryFn: () => getPublicClinic({ data: params.slug }), staleTime: 60000 }),
  head: ({ loaderData, params }) => {
    const clinic = loaderData as Clinic | null;
    const name = clinic?.clinic_name || formatSlug(params.slug);
    const description = clinic?.meta_description || clinic?.short_description || `${name}, dental practice in ${clinic?.city || 'your area'}. Explore services and contact information.`;
    const title = clinic?.meta_title || `${name} | Dentist in ${clinic?.city || 'your area'}`;
    const image = clinic?.og_image || clinic?.hero_image;
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }, ...(image?.startsWith('https://') ? [{ property: 'og:image', content: image }, { name: 'twitter:image', content: image }] : [])], links: clinic?.canonical_url?.startsWith('https://') ? [{ rel: 'canonical', href: clinic.canonical_url }] : [] };
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
  const { data } = useSuspenseQuery({ queryKey: ['clinic', slug], queryFn: () => getPublicClinic({ data: slug }), staleTime: 60000 });
  const clinic = data as Clinic | null;
  const [claimOpen, setClaimOpen] = useState(false);
  const [theme, setTheme] = useState<ClinicTheme>({
    primary: "#0b6cf2",
    secondary: "#0e1a33",
    radius: 1,
    vibe: "modern-minimal",
    mode: "light",
    device: "desktop",
  });

  useEffect(() => { if (clinic) trackClinicEvent(clinic.id, 'preview_viewed'); }, [clinic?.id]);
  if (!clinic) throw notFound();
  const preset = templatePreset(clinic.template_key);
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
          <div className="flex items-center gap-3"><Button variant="ghost" size="sm" className="text-white" onClick={() => setClaimOpen(true)}>Request changes</Button><Button size="sm" className="bg-white text-neutral-900" onClick={() => { trackClinicEvent(clinic.id,'claim_clicked'); setClaimOpen(true); }}>Claim this website</Button></div>
        </div>
      </div>

      <div
        className="light-clinic clinic-root mx-auto min-h-screen bg-white text-neutral-900 transition-all"
        style={
          {
            maxWidth: maxW,
            "--clinic-primary": theme.vibe === 'modern-minimal' ? (clinic.primary_color || preset.primary) : theme.primary,
            "--clinic-secondary": theme.vibe === 'modern-minimal' ? (clinic.secondary_color || preset.secondary) : theme.secondary,
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
          <Suspense fallback={null}><ClinicAssistant /></Suspense>
          <div className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background text-foreground md:hidden">{clinic.phone && <a href={`tel:${clinic.phone}`} className="flex flex-col items-center text-xs"><Phone className="size-5" />Call</a>}<a href={`/clinic/${clinic.slug}/contact`} className="flex flex-col items-center text-xs"><CalendarDays className="size-5" />Book</a><span className="flex flex-col items-center text-xs"><MessageCircle className="size-5" />AI</span></div>
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
