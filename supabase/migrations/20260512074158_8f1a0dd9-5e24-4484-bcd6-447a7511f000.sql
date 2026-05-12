
-- Expand clinics with structured profile, SEO, GEO, branding, and engagement fields
ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS long_description TEXT,
  ADD COLUMN IF NOT EXISTS about_us TEXT,
  ADD COLUMN IF NOT EXISTS specialization TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS zip_code TEXT,
  ADD COLUMN IF NOT EXISTS business_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS google_maps_embed TEXT,
  ADD COLUMN IF NOT EXISTS google_business_profile TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images TEXT[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS font_theme TEXT,
  ADD COLUMN IF NOT EXISTS layout_theme TEXT,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS meta_keywords TEXT[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS geo_target_city TEXT,
  ADD COLUMN IF NOT EXISTS geo_target_region TEXT,
  ADD COLUMN IF NOT EXISTS schema_markup JSONB,
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT,
  ADD COLUMN IF NOT EXISTS booking_link TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
  ADD COLUMN IF NOT EXISTS consultation_cta TEXT,
  ADD COLUMN IF NOT EXISTS team JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Indexes for scale
CREATE INDEX IF NOT EXISTS idx_clinics_city ON public.clinics (city);
CREATE INDEX IF NOT EXISTS idx_clinics_country ON public.clinics (country);
CREATE INDEX IF NOT EXISTS idx_clinics_slug ON public.clinics (slug);
CREATE INDEX IF NOT EXISTS idx_clinics_services_gin ON public.clinics USING GIN (services);
CREATE INDEX IF NOT EXISTS idx_clinics_meta_keywords_gin ON public.clinics USING GIN (meta_keywords);

-- Smile Assessment submissions
CREATE TABLE IF NOT EXISTS public.smile_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID,
  clinic_slug TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age_range TEXT,
  concerns TEXT[] NOT NULL DEFAULT '{}'::text[],
  smile_goal TEXT,
  notes TEXT,
  ai_summary TEXT,
  recommended_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.smile_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a smile assessment"
  ON public.smile_assessments FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated users can read smile assessments"
  ON public.smile_assessments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update smile assessments"
  ON public.smile_assessments FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete smile assessments"
  ON public.smile_assessments FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_smile_assessments_clinic_slug
  ON public.smile_assessments (clinic_slug);

CREATE TRIGGER update_smile_assessments_updated_at
  BEFORE UPDATE ON public.smile_assessments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
