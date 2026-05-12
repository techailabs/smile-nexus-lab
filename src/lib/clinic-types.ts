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
