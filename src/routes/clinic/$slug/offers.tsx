import { createFileRoute, notFound } from '@tanstack/react-router';
import { PageHeader, FinalCta, useClinic } from '@/components/clinic/site';
import { clinicPageHead } from '@/lib/clinic-depth';
export const Route=createFileRoute('/clinic/$slug/offers')({head:({params})=>clinicPageHead(params.slug,'Offers',`Current offers at ${params.slug.replaceAll('-',' ')}.`),component:Offers});
function Offers(){const c=useClinic();if(!c.offers?.length)throw notFound();return <><PageHeader eyebrow="Offers" title="Current offers."/><div className="mx-auto max-w-5xl space-y-8 px-6 py-20">{c.offers.map(o=><article key={o.title} className="border-b pb-8"><h2 className="font-display text-2xl">{o.title}</h2><p className="mt-3 text-neutral-600">{o.description}</p></article>)}</div><FinalCta/></>}
