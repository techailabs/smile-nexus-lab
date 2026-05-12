export type ClinicService = { name: string; desc: string };
export type ClinicReview = { name: string; rating: number; text: string };
export type ClinicFaq = { q: string; a: string };

export type Clinic = {
  id: string;
  clinic_name: string;
  slug: string;
  city: string;
  country: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  tagline: string | null;
  about: string | null;
  services: ClinicService[];
  reviews: ClinicReview[];
  faqs: ClinicFaq[];
  hours: Record<string, string>;
  theme: string;
  primary_color: string;
  secondary_color: string;
  hero_image: string | null;
  rating: number;
  review_count: number;
  claimed: boolean;
  ai_score: number;
  seo_score: number;
};

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
