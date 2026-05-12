import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, TeamTeaser, FinalCta, useClinic, IMG } from "@/components/clinic/site";

export const Route = createFileRoute("/clinic/$slug/about")({
  component: AboutPage,
});

function AboutPage() {
  const clinic = useClinic();
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={`A quieter, more considered practice in ${clinic.city}.`}
        intro={clinic.about || `${clinic.clinic_name} was founded on a simple belief: dentistry should feel calm, modern, and personal. Every detail of our practice is shaped around that idea.`}
        image={IMG.interior}
      />
      <section className="border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { t: "Our philosophy", d: "Preventive-first care that respects your time, your comfort, and your long-term wellness." },
              { t: "Our approach", d: "Modern technology, soft-spoken clinicians, and treatment plans built around how you actually live." },
              { t: "Our promise", d: "Honest conversations, transparent pricing, and visits that feel less clinical, more considered." },
            ].map((b) => (
              <div key={b.t}>
                <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--clinic-primary)" }}>{b.t}</p>
                <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <TeamTeaser />
      <FinalCta />
    </>
  );
}
