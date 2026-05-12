# Phase 2: Multi-tenant dental website infrastructure

This is a large, multi-part expansion. I'll ship it in 4 sequential migrations + code passes so each piece is verifiable. Confirm the plan and I'll start with Step 1.

## 1. Database schema expansion (migration)

Extend `public.clinics` with the new fields, keeping existing columns intact:

**New scalar columns**
- `tagline` (already exists), `short_description`, `long_description`, `about_us`, `specialization`, `years_experience`
- `state`, `zip_code`, `business_hours` (jsonb — replaces simpler `hours`)
- `google_maps_embed`, `google_business_profile`
- `logo_url`, `font_theme`, `layout_theme`
- `meta_title`, `meta_description`, `meta_keywords` (text[]), `geo_target_city`, `geo_target_region`, `og_image`, `canonical_url`, `schema_markup` (jsonb)
- `booking_link`, `whatsapp_number`, `emergency_contact`, `consultation_cta`
- `gallery_images` (text[])

**Restructured JSONB columns** (kept on `clinics` for single-row reads — performant at 100k clinics):
- `services`: `[{ title, slug, short_description, full_description, icon, featured_image }]`
- `faqs`: `[{ question, answer }]`
- `reviews`: `[{ reviewer_name, review_text, rating, source, review_date }]`
- `team`: `[{ doctor_name, role, bio, image, specialization }]`

**Indexes**: `idx_clinics_city`, `idx_clinics_country`, GIN on `services` and `meta_keywords` for search.

RLS unchanged (public read, authenticated write).

## 2. Seed real clinic data

Insert ~6 fully populated clinics across cities (Sydney, NYC, London, Dubai, Singapore, Toronto) with complete services/faqs/reviews/team/SEO/geo so every section renders. Existing demo clinics get backfilled with the new fields.

The CSV import page (`/admin/import`) already exists — I'll update its parser to accept the new richer columns and document the new format on that page.

## 3. Reusable rendering layer

`src/lib/clinic-types.ts` — extend types to match new schema.

`src/components/clinic/site.tsx` — refactor and add:
- `ClinicSEO` — emits `<head>` meta + JSON-LD `<script>` for `Dentist`, `LocalBusiness`, `FAQPage`, `Review` schemas
- `MapSection` — premium embedded Google Map + directions CTA + landmark text
- `AboutLong` — long-form about/philosophy/experience
- `FaqAccordion` — animated, SEO-friendly (uses shadcn `accordion`, framer-motion)
- `TeamGrid`, `ReviewsWall`, `GalleryGrid` — driven by JSON arrays
- `WhatsAppFab` — floating button using clinic's `whatsapp_number` with prefilled message; opens `wa.me/<number>?text=...`

All sections read from the clinic record — zero hardcoding.

## 4. SEO + GEO per route

Update head() on every clinic route (`/clinic/$slug`, `/services`, `/about`, `/contact`, `/faq`, `/reviews`, `/gallery`):
- Localized title pattern: `"{Service} in {City} | {Clinic Name}"`
- Description from `meta_description` with city interpolation
- `og:title`, `og:description`, `og:image` (hero or service image)
- `canonical_url`, `geo.region`, `geo.placename` meta tags
- JSON-LD via `ClinicSEO`

## 5. Dynamic per-service pages

New route: `src/routes/clinic/$slug/services/$serviceSlug.tsx`
- Loads clinic, finds service by slug
- Reusable `ServiceDetail` layout: hero with service image, full_description, "Why choose us in {city}", related services, FAQ filtered to service, CTA, map
- SEO: `"{Service Title} in {City} — {Clinic}"` + Service schema JSON-LD
- 404 via `notFoundComponent` if service slug missing

`/clinic/$slug/services` index links to each.

## 6. AI Smile Assessment

New section `SmileAssessment` on the clinic home + dedicated `/clinic/$slug/smile-check` route.
- Multi-step form: concerns (checkbox), age range, smile goal, photo upload (optional, stored in a new `smile-uploads` storage bucket), name, email, phone
- Server function `assessSmile` (TanStack `createServerFn`) calls Lovable AI Gateway (`google/gemini-2.5-flash`) with clinic context (services, theme, city) → returns markdown summary + recommended services from that clinic's catalog
- Renders result with clinic theming + CTAs to recommended services and WhatsApp booking
- Stores submission in new `smile_assessments` table for the clinic's claim flow

## 7. Architecture notes

- All clinic content stays in JSONB on `clinics` so a single edge query renders the whole site — keeps <40ms TTFB target.
- Vertical-agnostic: `specialization` + flexible `services`/`team` JSON means the same engine works for orthodontists, cosmetic, pediatric, med spas, dermatology.
- WhatsApp + booking_link + consultation_cta all per-clinic, no global hardcoding.

## Order of execution

1. Migration (schema expansion) — needs your approval
2. Seed clinics (insert tool)
3. Type + component refactor + SEO/JSON-LD + Map + WhatsApp + FAQ accordion
4. Dynamic service pages
5. Smile Assessment (table migration + storage bucket + server fn + UI)
6. CSV import parser update + admin docs

I'll pause for approval after the migration, then proceed straight through the rest. Ready to start with Step 1?