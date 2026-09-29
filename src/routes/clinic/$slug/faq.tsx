import { clinicPageHead } from "@/lib/clinic-depth";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader, FaqList, FinalCta, useClinic } from "@/components/clinic/site";

export const Route = createFileRoute("/clinic/$slug/faq")({
  head: ({params}) => clinicPageHead(params.slug, "Frequently asked questions", `Questions about dental care at ${params.slug.replaceAll("-"," ")}.`),
  component: FaqPage,
});

function FaqPage() {
  const clinic = useClinic();
  if (!clinic.faqs?.length) throw notFound();
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title={`Questions about ${clinic.clinic_name}.`}
        intro="Answers provided by the practice. Contact the office for anything not covered here."
      />
      <section className="border-t border-black/[0.05]">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
          <FaqList />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
