import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, FinalCta, IMG } from "@/components/clinic/site";

export const Route = createFileRoute("/clinic/$slug/gallery")({
  component: GalleryPage,
});

const gallery = [
  IMG.before1, IMG.before2, IMG.before3, IMG.before4, IMG.before5, IMG.before6,
  IMG.smile, IMG.patient, IMG.family,
];

function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Smile gallery"
        title="Real smiles, gently transformed."
        intro="A selection of patient smiles created at our practice — from subtle whitening to fuller cosmetic transformations. Every result is the outcome of careful planning and unhurried care."
      />
      <section className="border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {gallery.map((src) => (
              <img key={src} src={src} alt="" className="w-full break-inside-avoid rounded-2xl object-cover" />
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
