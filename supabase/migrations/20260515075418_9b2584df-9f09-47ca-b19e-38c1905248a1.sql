
-- Expand clinics table for multi-vertical support
ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS vertical text NOT NULL DEFAULT 'dental',
  ADD COLUMN IF NOT EXISTS template_key text NOT NULL DEFAULT 'dental-modern-minimal',
  ADD COLUMN IF NOT EXISTS country_code text NOT NULL DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'preview',
  ADD COLUMN IF NOT EXISTS preview_token text NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex');

-- Constrain country_code to target markets
ALTER TABLE public.clinics
  DROP CONSTRAINT IF EXISTS clinics_country_code_check;
ALTER TABLE public.clinics
  ADD CONSTRAINT clinics_country_code_check
  CHECK (country_code IN ('US', 'UK', 'AU'));

-- Constrain status to lifecycle states
ALTER TABLE public.clinics
  DROP CONSTRAINT IF EXISTS clinics_status_check;
ALTER TABLE public.clinics
  ADD CONSTRAINT clinics_status_check
  CHECK (status IN ('draft', 'preview', 'claimed', 'live', 'archived'));

-- Backfill country_code from existing country text where possible
UPDATE public.clinics
SET country_code = CASE
  WHEN lower(country) IN ('usa','us','united states','united states of america') THEN 'US'
  WHEN lower(country) IN ('uk','united kingdom','england','britain','great britain') THEN 'UK'
  WHEN lower(country) IN ('au','australia') THEN 'AU'
  ELSE 'US'
END
WHERE country IS NOT NULL;

-- Indexes for scale
CREATE INDEX IF NOT EXISTS idx_clinics_vertical ON public.clinics(vertical);
CREATE INDEX IF NOT EXISTS idx_clinics_country_code ON public.clinics(country_code);
CREATE INDEX IF NOT EXISTS idx_clinics_status ON public.clinics(status);
CREATE INDEX IF NOT EXISTS idx_clinics_template_key ON public.clinics(template_key);
CREATE INDEX IF NOT EXISTS idx_clinics_vertical_country ON public.clinics(vertical, country_code);

-- Verticals lookup table
CREATE TABLE IF NOT EXISTS public.verticals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  default_template text NOT NULL,
  icon text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.verticals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Verticals are publicly readable" ON public.verticals;
CREATE POLICY "Verticals are publicly readable"
  ON public.verticals FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage verticals" ON public.verticals;
CREATE POLICY "Authenticated users can manage verticals"
  ON public.verticals FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed verticals
INSERT INTO public.verticals (key, name, category, default_template, icon, description) VALUES
  ('dental', 'Dental Clinic', 'health', 'dental-modern-minimal', 'Tooth', 'General and family dentistry'),
  ('orthodontics', 'Orthodontist', 'health', 'dental-premium-ortho', 'Smile', 'Braces and aligners'),
  ('cosmetic-dentistry', 'Cosmetic Dentistry', 'health', 'dental-luxury-cosmetic', 'Sparkles', 'Veneers, whitening, smile makeovers'),
  ('pediatric-dentistry', 'Pediatric Dentist', 'health', 'dental-family-friendly', 'Baby', 'Children''s dental care'),
  ('dermatology', 'Dermatology', 'health', 'medical-clean-clinical', 'Stethoscope', 'Skin care and treatments'),
  ('medspa', 'Med Spa', 'health', 'medical-luxury-spa', 'Flower', 'Aesthetic and wellness treatments'),
  ('lawyer', 'Law Firm', 'professional', 'legal-classic-trust', 'Scale', 'General legal practice'),
  ('plumber', 'Plumber', 'home-services', 'home-bold-emergency', 'Wrench', '24/7 plumbing services'),
  ('electrician', 'Electrician', 'home-services', 'home-bold-emergency', 'Zap', 'Electrical installation and repair'),
  ('hvac', 'HVAC Contractor', 'home-services', 'home-bold-emergency', 'Wind', 'Heating, cooling, ventilation'),
  ('roofer', 'Roofing Contractor', 'home-services', 'home-rugged-trade', 'Home', 'Roof repair and replacement')
ON CONFLICT (key) DO NOTHING;
