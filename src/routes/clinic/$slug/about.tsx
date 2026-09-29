import { createFileRoute } from '@tanstack/react-router';
import { PageHeader, TeamTeaser, FinalCta, useClinic } from '@/components/clinic/site';
import { clinicPageHead } from '@/lib/clinic-depth';
export const Route=createFileRoute('/clinic/$slug/about')({head:({params})=>clinicPageHead(params.slug,'About',`Learn about ${params.slug.replaceAll('-',' ')}.`),component:AboutPage});
function AboutPage(){const c=useClinic();return <><PageHeader eyebrow="About the practice" title={`About ${c.clinic_name}.`} intro={c.short_description||c.tagline||`Dental care in ${c.city}.`} image={c.hero_image||undefined}/>{(c.about_us||c.long_description||c.about)&&<section className="mx-auto max-w-4xl px-6 py-20"><div className="whitespace-pre-line text-lg leading-loose text-neutral-700">{c.about_us||c.long_description||c.about}</div></section>}<TeamTeaser/><FinalCta/></>}
