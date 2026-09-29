import { createFileRoute, notFound } from '@tanstack/react-router';
import { PageHeader, FinalCta, useClinic } from '@/components/clinic/site';
import { clinicPageHead } from '@/lib/clinic-depth';
export const Route=createFileRoute('/clinic/$slug/financing')({head:({params})=>clinicPageHead(params.slug,'Payment options',`Payment information for ${params.slug.replaceAll('-',' ')}.`),component:Financing});
function Financing(){const c=useClinic();if(!c.financing?.length)throw notFound();return <><PageHeader eyebrow="Patient information" title="Payment options." intro="Ask the practice to confirm any payment terms or eligibility."/><ul className="mx-auto max-w-5xl space-y-5 px-6 py-20">{c.financing.map(x=><li key={x} className="border-b pb-4">{x}</li>)}</ul><FinalCta/></>}
