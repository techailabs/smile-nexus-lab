import { createFileRoute, notFound } from '@tanstack/react-router';
import { PageHeader, FinalCta, useClinic } from '@/components/clinic/site';
import { clinicPageHead } from '@/lib/clinic-depth';
export const Route=createFileRoute('/clinic/$slug/gallery')({head:({params})=>clinicPageHead(params.slug,'Gallery',`Photos from ${params.slug.replaceAll('-',' ')}.`),component:GalleryPage});
function GalleryPage(){const c=useClinic();if(!c.gallery_images?.length)throw notFound();return <><PageHeader eyebrow="Gallery" title={`Inside ${c.clinic_name}.`} intro="Images provided for this practice. Contact the team for more information."/><section className="mx-auto columns-1 gap-4 px-6 py-20 sm:columns-2 lg:columns-3">{c.gallery_images.map((src,i)=><img key={`${src}-${i}`} src={src} alt={`${c.clinic_name} gallery image ${i+1}`} loading="lazy" className="mb-4 w-full break-inside-avoid object-cover"/>)}</section><FinalCta/></>}
