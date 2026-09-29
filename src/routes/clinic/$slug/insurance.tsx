import { createFileRoute, notFound } from '@tanstack/react-router';
import { PageHeader, FinalCta, useClinic } from '@/components/clinic/site';
import { clinicPageHead } from '@/lib/clinic-depth';
export const Route=createFileRoute('/clinic/$slug/insurance')({head:({params})=>clinicPageHead(params.slug,'Insurance',`Insurance information for ${params.slug.replaceAll('-',' ')}.`),component:Insurance});
function Insurance(){const c=useClinic();if(!c.insurance?.length)throw notFound();return <><PageHeader eyebrow="Patient information" title="Insurance." intro="Contact the practice to confirm your plan and coverage before booking."/><ul className="mx-auto grid max-w-5xl gap-5 px-6 py-20 sm:grid-cols-2">{c.insurance.map(x=><li key={x} className="border-b pb-4">{x}</li>)}</ul><FinalCta/></>}
