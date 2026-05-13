import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { useClinic, FinalCta, IMG } from "@/components/clinic/site";
import { svcTitle, svcDesc, svcSlug } from "@/lib/clinic-types";

export const Route = createFileRoute("/clinic/$slug/services/$serviceSlug")({
  component: ServiceDetail,
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-display text-4xl">Service not found</p>
        <p className="mt-3 text-sm text-neutral-500">This treatment is no longer listed.</p>
      </div>
    </div>
  ),
});

function ServiceDetail() {
  const clinic = useClinic();
  const { slug, serviceSlug } = Route.useParams();
  const service = clinic.services.find((s) => svcSlug(s) === serviceSlug);
  if (!service) throw notFound();

  const title = svcTitle(service);
  const desc = svcDesc(service);
  const long = service.full_description || desc;
  const image = service.featured_image || IMG.chair;

  const others = clinic.services.filter((s) => svcSlug(s) !== serviceSlug).slice(0, 3);

  return (
    <>
      <section className="border-b border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-10">
          <Link
            to="/clinic/$slug/services"
            params={{ slug }}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-neutral-500 transition hover:text-neutral-900"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> All treatments
          </Link>
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--clinic-primary)" }}>
              Treatment · {clinic.city}
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">{title}</h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-neutral-600">{long}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/clinic/$slug/contact"
                params={{ slug }}
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                style={{ background: "var(--clinic-primary)" }}
              >
                {clinic.consultation_cta || "Book this treatment"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/clinic/$slug/smile-check"
                params={{ slug }}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-7 py-4 text-sm font-medium transition hover:border-black/30"
              >
                Free smile assessment
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem]" style={{ background: "color-mix(in oklab, var(--clinic-primary) 10%, transparent)" }} />
            <img src={image} alt={title} className="aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      </section>

      <section className="border-t border-black/[0.05] bg-[oklch(0.985_0.003_250)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-3 lg:px-10">
          {[
            { t: "What to expect", d: `A relaxed consultation, full clinical assessment, and a clear plan for your ${title.toLowerCase()} journey.` },
            { t: "Why us", d: `${clinic.clinic_name} blends modern technology with unhurried, considered care.` },
            { t: "Aftercare", d: "Detailed aftercare guidance and follow-up appointments included as standard." },
          ].map((b) => (
            <div key={b.t} className="rounded-[1.5rem] border border-black/[0.06] bg-white p-8">
              <Check className="h-5 w-5" style={{ color: "var(--clinic-primary)" }} />
              <p className="mt-5 font-display text-2xl tracking-tight">{b.t}</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-neutral-600">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-black/[0.05]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--clinic-primary)" }}>Related treatments</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight">Other ways we can help.</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {others.map((s) => (
                <Link
                  key={svcSlug(s)}
                  to="/clinic/$slug/services/$serviceSlug"
                  params={{ slug, serviceSlug: svcSlug(s) }}
                  className="group rounded-[1.5rem] border border-black/[0.06] bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.15)]"
                >
                  <p className="font-display text-xl tracking-tight">{svcTitle(s)}</p>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-neutral-600">{svcDesc(s)}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-[12.5px] text-neutral-500 transition group-hover:text-neutral-900">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}