import type { Clinic } from './clinic-types';

export function clinicDepth(clinic: Clinic) {
  return {
    team: !!clinic.team?.length,
    reviews: !!clinic.reviews?.length,
    faq: !!clinic.faqs?.length,
    gallery: !!clinic.gallery_images?.length,
    technology: !!clinic.technology?.length,
    insurance: !!clinic.insurance?.length,
    financing: !!clinic.financing?.length,
    offers: !!clinic.offers?.length,
    locations: !!clinic.locations?.length,
    blog: !!clinic.blog?.length,
    emergency: !!clinic.emergency_available,
    patientInfo: !!Object.keys(clinic.patient_info || {}).length || !!clinic.insurance?.length || !!clinic.financing?.length,
  };
}

export function clinicLocation(clinic: Clinic) {
  return [clinic.city, clinic.state].filter(Boolean).join(', ');
}

export function clinicPageHead(slug: string, page: string, description: string, image?: string | null) {
  const name = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const title = `${page} | ${name}`;
  return { meta: [
    { title }, { name: 'description', content: description },
    { property: 'og:title', content: title }, { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
    ...(image?.startsWith('https://') ? [{ property: 'og:image', content: image }, { name: 'twitter:image', content: image }] : []),
  ] };
}
