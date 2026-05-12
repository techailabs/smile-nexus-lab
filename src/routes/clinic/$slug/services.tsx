import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, ServicesGrid, FinalCta, useClinic, IMG } from "@/components/clinic/site";

export const Route = createFileRoute("/clinic/$slug/services")({
  component: ServicesPage,
});

function ServicesPage() {
  const clinic = useClinic();
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={`Treatments crafted around you.`}
        intro={`Whether you're visiting ${clinic.clinic_name} for a routine check-up or a complete smile transformation, every treatment plan is built around your needs, your comfort, and your long-term oral wellness.`}
        image={IMG.chair}
      />
      <section className="border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <ServicesGrid />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
