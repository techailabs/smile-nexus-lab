import { createFileRoute, notFound } from '@tanstack/react-router';
import { PageHeader, FinalCta, useClinic } from '@/components/clinic/site';
import { clinicPageHead } from '@/lib/clinic-depth';
export const Route = createFileRoute('/clinic/$slug/technology')({head:({params})=>clinicPageHead(params.slug,'Technology',`Technology at ${params.slug.replaceAll('-',' ')}.`),component:Technology});
function Technology(){const c=useClinic();if(!c.technology?.length)throw notFound();return <><PageHeader eyebrow="Technology" title="Tools of our practice."/><section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-2">{c.technology.map(t=><article key={t.name}>{t.image&&<img src={t.image} alt={t.name} loading="lazy" className="aspect-video w-full object-cover"/>}<h2 className="mt-5 font-display text-2xl">{t.name}</h2><p className="mt-2 text-neutral-600">{t.description}</p></article>)}</section><FinalCta/></>}
