import type { Clinic } from './clinic-types';
export function clinicHealth(c: Clinic) {
 const checks=[
  ['Phone number',!!c.phone],['Address',!!c.address],['Opening hours',!!Object.keys(c.business_hours||c.hours||{}).length],
  ['Description',!!(c.long_description||c.about_us||c.about)],['Services',!!c.services?.length],
  ['Service details',!!c.services?.some(s=>s.full_description)],['FAQs',!!c.faqs?.length],
  ['Team',!!c.team?.length],['Reviews',!!c.reviews?.length],['Gallery',!!c.gallery_images?.length],
  ['Location map',!!(c.google_maps_embed||c.lat&&c.lng)],['SEO title',!!c.meta_title],
  ['SEO description',!!c.meta_description],['Hero photo',!!c.hero_image],
 ] as const;
 return {score:Math.round(100*checks.filter(([,ok])=>ok).length/checks.length),missing:checks.filter(([,ok])=>!ok).map(([name])=>name)};
}
