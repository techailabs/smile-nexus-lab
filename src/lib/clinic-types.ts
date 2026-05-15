export type ClinicService = {
  title: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  icon?: string;
  featured_image?: string;
  // legacy
  name?: string;
  desc?: string;
};

export type ClinicReview = {
  reviewer_name?: string;
  review_text?: string;
  rating: number;
  source?: string;
  review_date?: string;
  // legacy
  name?: string;
  text?: string;
};

export type ClinicFaq = {
  question?: string;
  answer?: string;
  // legacy
  q?: string;
  a?: string;
};

export type ClinicTeamMember = {
  doctor_name: string;
  role?: string;
  bio?: string;
  image?: string;
  specialization?: string;
};

export type Clinic = {
  id: string;
  clinic_name: string;
  slug: string;
  city: string;
  country: string;
  state?: string | null;
  zip_code?: string | null;
  country_code?: "US" | "UK" | "AU";
  vertical?: string;
  template_key?: string;
  status?: "draft" | "preview" | "claimed" | "live" | "archived";
  preview_token?: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  tagline: string | null;
  about: string | null;
  about_us?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  specialization?: string | null;
  years_experience?: number | null;
  services: ClinicService[];
  reviews: ClinicReview[];
  faqs: ClinicFaq[];
  team?: ClinicTeamMember[];
  hours: Record<string, string>;
  business_hours?: Record<string, string>;
  theme: string;
  primary_color: string;
  secondary_color: string;
  hero_image: string | null;
  og_image?: string | null;
  logo_url?: string | null;
  gallery_images?: string[];
  rating: number;
  review_count: number;
  claimed: boolean;
  ai_score: number;
  seo_score: number;
  lat?: number | null;
  lng?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[];
  geo_target_city?: string | null;
  geo_target_region?: string | null;
  canonical_url?: string | null;
  google_maps_embed?: string | null;
  google_business_profile?: string | null;
  booking_link?: string | null;
  whatsapp_number?: string | null;
  emergency_contact?: string | null;
  consultation_cta?: string | null;
};

// ---------- Verticals & templates ----------

export type VerticalKey =
  | "dental" | "orthodontics" | "cosmetic-dentistry" | "pediatric-dentistry"
  | "dermatology" | "medspa"
  | "lawyer"
  | "plumber" | "electrician" | "hvac" | "roofer";

export const VERTICAL_META: Record<string, {
  label: string;
  category: "health" | "professional" | "home-services";
  bookingCta: string;
  navTagline: string;
  unit: string; // "patient" | "client" | "customer"
}> = {
  dental:               { label: "Dental care",          category: "health",        bookingCta: "Book a consultation", navTagline: "Dental care",        unit: "patient" },
  orthodontics:         { label: "Orthodontics",         category: "health",        bookingCta: "Book a consultation", navTagline: "Orthodontics",       unit: "patient" },
  "cosmetic-dentistry": { label: "Cosmetic dentistry",   category: "health",        bookingCta: "Book a consultation", navTagline: "Cosmetic dentistry", unit: "patient" },
  "pediatric-dentistry":{ label: "Pediatric dentistry",  category: "health",        bookingCta: "Book a visit",        navTagline: "Family dentistry",   unit: "patient" },
  dermatology:          { label: "Dermatology",          category: "health",        bookingCta: "Book an appointment", navTagline: "Skin & dermatology", unit: "patient" },
  medspa:               { label: "Med spa",              category: "health",        bookingCta: "Book a treatment",    navTagline: "Aesthetics & wellness", unit: "client" },
  lawyer:               { label: "Law firm",             category: "professional",  bookingCta: "Request a consultation", navTagline: "Legal counsel",  unit: "client" },
  plumber:              { label: "Plumbing services",    category: "home-services", bookingCta: "Get a free quote",    navTagline: "24/7 plumbing",      unit: "customer" },
  electrician:          { label: "Electrical services",  category: "home-services", bookingCta: "Get a free quote",    navTagline: "Licensed electricians", unit: "customer" },
  hvac:                 { label: "Heating & cooling",    category: "home-services", bookingCta: "Get a free quote",    navTagline: "HVAC specialists",   unit: "customer" },
  roofer:               { label: "Roofing services",     category: "home-services", bookingCta: "Get a free quote",    navTagline: "Roofing experts",    unit: "customer" },
};

export function verticalMeta(v?: string) {
  return VERTICAL_META[v ?? "dental"] ?? VERTICAL_META.dental;
}

export type TemplatePreset = {
  key: string;
  name: string;
  vertical: string;
  primary: string;
  secondary: string;
  font: "display-modern" | "display-serif" | "display-bold";
  mood: "minimal" | "luxury" | "warm" | "bold" | "trust";
};

export const TEMPLATE_REGISTRY: TemplatePreset[] = [
  // Dental — 5 variants
  { key: "dental-modern-minimal",  name: "Modern Minimal",      vertical: "dental",               primary: "#0b6cf2", secondary: "#0e1a33", font: "display-modern", mood: "minimal" },
  { key: "dental-luxury-cosmetic", name: "Luxury Cosmetic",     vertical: "cosmetic-dentistry",   primary: "#c9a25a", secondary: "#0a0a0a", font: "display-serif",  mood: "luxury"  },
  { key: "dental-family-friendly", name: "Family Friendly",     vertical: "pediatric-dentistry",  primary: "#15b78a", secondary: "#0f3b2e", font: "display-modern", mood: "warm"    },
  { key: "dental-premium-ortho",   name: "Premium Orthodontics",vertical: "orthodontics",         primary: "#6d28d9", secondary: "#1a1033", font: "display-modern", mood: "minimal" },
  { key: "dental-calm-wellness",   name: "Calm Wellness",       vertical: "dental",               primary: "#7aa9a0", secondary: "#243b3a", font: "display-serif",  mood: "warm"    },
  // Medical
  { key: "medical-clean-clinical", name: "Clean Clinical",      vertical: "dermatology",          primary: "#1e6fd9", secondary: "#0c1f3a", font: "display-modern", mood: "trust"   },
  { key: "medical-luxury-spa",     name: "Luxury Spa",          vertical: "medspa",               primary: "#b08968", secondary: "#1a1410", font: "display-serif",  mood: "luxury"  },
  // Legal
  { key: "legal-classic-trust",    name: "Classic Trust",       vertical: "lawyer",               primary: "#0d2a4a", secondary: "#7a5d2a", font: "display-serif",  mood: "trust"   },
  { key: "legal-modern-firm",      name: "Modern Firm",         vertical: "lawyer",               primary: "#1a2332", secondary: "#c89b3c", font: "display-modern", mood: "trust"   },
  // Home services
  { key: "home-bold-emergency",    name: "Bold 24/7",           vertical: "plumber",              primary: "#dc2626", secondary: "#0a0a0a", font: "display-bold",   mood: "bold"    },
  { key: "home-rugged-trade",      name: "Rugged Trade",        vertical: "roofer",               primary: "#ea580c", secondary: "#1c1917", font: "display-bold",   mood: "bold"    },
];

export function templatePreset(key?: string): TemplatePreset {
  return TEMPLATE_REGISTRY.find((t) => t.key === key) ?? TEMPLATE_REGISTRY[0];
}

// Normalizers — handle both old and new shapes
export const svcTitle = (s: ClinicService) => s.title || s.name || "";
export const svcDesc = (s: ClinicService) => s.short_description || s.desc || "";
export const svcSlug = (s: ClinicService) => s.slug || slugify(svcTitle(s));
export const faqQ = (f: ClinicFaq) => f.question || f.q || "";
export const faqA = (f: ClinicFaq) => f.answer || f.a || "";
export const revName = (r: ClinicReview) => r.reviewer_name || r.name || "";
export const revText = (r: ClinicReview) => r.review_text || r.text || "";

export const THEME_PRESETS = [
  { key: "modern-minimal", name: "Modern Minimal", primary: "#0b6cf2", secondary: "#0e1a33" },
  { key: "luxury-cosmetic", name: "Luxury Cosmetic", primary: "#c9a25a", secondary: "#0a0a0a" },
  { key: "family-friendly", name: "Family Friendly", primary: "#15b78a", secondary: "#0f3b2e" },
  { key: "premium-ortho", name: "Premium Orthodontics", primary: "#6d28d9", secondary: "#1a1033" },
  { key: "calm-wellness", name: "Calm Wellness", primary: "#7aa9a0", secondary: "#243b3a" },
] as const;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
