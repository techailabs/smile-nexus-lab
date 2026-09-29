import { createFileRoute, notFound } from '@tanstack/react-router';
import { FinalCta, useClinic } from '@/components/clinic/site';
import { clinicPageHead } from '@/lib/clinic-depth';
export const Route=createFileRoute('/clinic/$slug/blog/$articleSlug')({head:({params})=>clinicPageHead(params.slug,params.articleSlug.replaceAll('-',' '),`Dental education from ${params.slug.replaceAll('-',' ')}.`),component:Article});
function Article(){const c=useClinic();const {articleSlug}=Route.useParams();const p=c.blog?.find(x=>x.slug===articleSlug);if(!p)throw notFound();return <><article className="mx-auto max-w-3xl px-6 py-20"><p className="text-sm text-neutral-500">{p.author}{p.date&&` · ${p.date}`}</p><h1 className="mt-4 font-display text-5xl">{p.title}</h1>{p.featured_image&&<img src={p.featured_image} alt="" className="mt-10 w-full"/>}<div className="mt-10 whitespace-pre-line leading-loose text-neutral-700">{p.content}</div></article><FinalCta/></>}
