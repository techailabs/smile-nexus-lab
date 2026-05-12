
-- Clinics table
CREATE TABLE public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  tagline TEXT,
  about TEXT,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviews JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme TEXT NOT NULL DEFAULT 'modern-minimal',
  primary_color TEXT NOT NULL DEFAULT '#0b6cf2',
  secondary_color TEXT NOT NULL DEFAULT '#0e1a33',
  hero_image TEXT,
  rating NUMERIC(2,1) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  claimed BOOLEAN NOT NULL DEFAULT false,
  ai_score INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clinics_slug ON public.clinics(slug);
CREATE INDEX idx_clinics_city ON public.clinics(city);
CREATE INDEX idx_clinics_claimed ON public.clinics(claimed);

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinics are publicly readable" ON public.clinics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert clinics" ON public.clinics
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update clinics" ON public.clinics
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete clinics" ON public.clinics
  FOR DELETE TO authenticated USING (true);

-- Themes table
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT,
  font_family TEXT DEFAULT 'Inter',
  vibe TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Themes are publicly readable" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage themes" ON public.themes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Claims table
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  clinic_slug TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  interest_level TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a claim" ON public.claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read claims" ON public.claims FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update claims" ON public.claims FOR UPDATE TO authenticated USING (true);

-- Outreach CRM
CREATE TABLE public.outreach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'email',
  status TEXT NOT NULL DEFAULT 'queued',
  contacted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.outreach ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage outreach" ON public.outreach FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER clinics_updated_at BEFORE UPDATE ON public.clinics
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
