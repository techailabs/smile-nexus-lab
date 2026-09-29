import { clinicPageHead } from "@/lib/clinic-depth";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, ReviewsGrid, FinalCta, useClinic } from "@/components/clinic/site";
import { Star } from "lucide-react";

export const Route = createFileRoute("/clinic/$slug/reviews")({
  head: ({params}) => clinicPageHead(params.slug, "Reviews", `Patient reviews at ${params.slug.replaceAll("-"," ")}.`),
  component: ReviewsPage,
});

function ReviewsPage() {
  const clinic = useClinic();
  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title={`Patient experiences.`}
        intro={`Reviews provided for ${clinic.clinic_name}. Confirm the original source before publishing.`}
        
      />
      <section className="border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-12 flex items-center gap-4">
            <p className="font-display text-6xl tracking-tight">{Number(clinic.rating).toFixed(1)}</p>
            <div>
              <div className="flex" style={{ color: "var(--clinic-primary)" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-sm text-neutral-500">{clinic.review_count} reviews</p>
            </div>
          </div>
          <ReviewsGrid />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
