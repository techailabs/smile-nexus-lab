import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, FaqList, FinalCta } from "@/components/clinic/site";

export const Route = createFileRoute("/clinic/$slug/faq")({
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered simply."
        intro="A few of the things patients most often ask us. If your question isn't here, we'd love to talk through it in person."
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
