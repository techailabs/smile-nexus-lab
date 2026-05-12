import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HomeHero, TrustBar, ServicesGrid, WhyChooseUs, GalleryStrip,
  TestimonialLarge, TeamTeaser, FaqList, FinalCta, useClinic,
} from "@/components/clinic/site";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/clinic/$slug/")({
  component: ClinicHome,
});

function ClinicHome() {
  const clinic = useClinic();
  const { slug } = Route.useParams();
  return (
    <>
      <HomeHero />
      <TrustBar />

      {/* Featured services */}
      <section className="border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="grid items-end gap-10 md:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--clinic-primary)" }}>Treatments</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
                Considered care for every smile.
              </h2>
            </div>
            <p className="text-[16px] leading-relaxed text-neutral-600">
              From quiet check-ups to thoughtful cosmetic work, every treatment at {clinic.clinic_name} is
              tailored to you — never rushed, never templated.
            </p>
          </div>
          <div className="mt-14">
            <ServicesGrid limit={6} />
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              to="/clinic/$slug/services"
              params={{ slug }}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-sm transition hover:border-black/30"
            >
              View all treatments <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <GalleryStrip />
      <TestimonialLarge />
      <TeamTeaser />

      {/* FAQ teaser */}
      <section className="border-t border-black/[0.05] bg-[oklch(0.985_0.003_250)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-28 md:grid-cols-[1fr_1.4fr] lg:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--clinic-primary)" }}>FAQ</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight">Answers, simply.</h2>
            <Link
              to="/clinic/$slug/faq"
              params={{ slug }}
              className="mt-8 inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-950"
            >
              See all questions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <FaqList limit={4} />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
