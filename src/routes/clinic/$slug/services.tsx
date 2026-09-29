import { clinicPageHead } from "@/lib/clinic-depth";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, ServicesGrid, FinalCta, useClinic } from "@/components/clinic/site";

export const Route = createFileRoute("/clinic/$slug/services")({
  head: ({params}) => clinicPageHead(params.slug, "Services", `Dental treatments at ${params.slug.replaceAll("-"," ")}.`),
  component: ServicesPage,
});

function ServicesPage() {
  const clinic = useClinic();
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={`Treatments at our practice.`}
        intro={`Explore treatments listed by ${clinic.clinic_name}. Contact us to discuss your options.`}
        image={clinic.hero_image||undefined}
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
