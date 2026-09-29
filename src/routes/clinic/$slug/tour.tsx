import { createFileRoute, notFound } from '@tanstack/react-router';
import { PageHeader, FinalCta, useClinic } from '@/components/clinic/site';
import { clinicPageHead } from '@/lib/clinic-depth';
export const Route=createFileRoute('/clinic/$slug/tour')({head:({params})=>clinicPageHead(params.slug,'Practice tour',`Images from ${params.slug.replaceAll('-',' ')}.`),component:Tour});
function Tour(){const c=useClinic();if(!c.gallery_images?.length)throw notFound();return <><PageHeader eyebrow="Practice tour" title={`Explore ${c.clinic_name}.`} intro="Preview images. Confirm these depict the practice before publishing."/><div className="mx-auto grid max-w-7xl gap-5 px-6 py-20 md:grid-cols-2">{c.gallery_images.map((src,i)=><img key={`${src}-${i}`} src={src} alt={`Practice image ${i+1}`} loading="lazy" className="aspect-[4/3] w-full object-cover"/>)}</div><FinalCta/></>}
