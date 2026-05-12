import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, ReviewsGrid, FinalCta, useClinic, IMG } from "@/components/clinic/site";
import { Star } from "lucide-react";

export const Route = createFileRoute("/clinic/$slug/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const clinic = useClinic();
  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title={`Trusted by patients in ${clinic.city}.`}
        intro={`${clinic.review_count} patients have shared their experience with ${clinic.clinic_name}. We're grateful for every visit.`}
        image={IMG.patient}
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
              <p className="mt-1 text-sm text-neutral-500">{clinic.review_count} verified reviews</p>
            </div>
          </div>
          <ReviewsGrid />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
