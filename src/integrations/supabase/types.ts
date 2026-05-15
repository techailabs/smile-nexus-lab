export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      claims: {
        Row: {
          clinic_id: string | null
          clinic_slug: string
          created_at: string
          email: string
          id: string
          interest_level: string | null
          notes: string | null
          owner_name: string
          phone: string | null
          status: string
          website: string | null
        }
        Insert: {
          clinic_id?: string | null
          clinic_slug: string
          created_at?: string
          email: string
          id?: string
          interest_level?: string | null
          notes?: string | null
          owner_name: string
          phone?: string | null
          status?: string
          website?: string | null
        }
        Update: {
          clinic_id?: string | null
          clinic_slug?: string
          created_at?: string
          email?: string
          id?: string
          interest_level?: string | null
          notes?: string | null
          owner_name?: string
          phone?: string | null
          status?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          about: string | null
          about_us: string | null
          address: string | null
          ai_score: number | null
          booking_link: string | null
          business_hours: Json
          canonical_url: string | null
          city: string
          claimed: boolean
          clinic_name: string
          consultation_cta: string | null
          country: string
          country_code: string
          created_at: string
          email: string | null
          emergency_contact: string | null
          faqs: Json
          font_theme: string | null
          gallery_images: string[]
          geo_target_city: string | null
          geo_target_region: string | null
          google_business_profile: string | null
          google_maps_embed: string | null
          hero_image: string | null
          hours: Json
          id: string
          lat: number | null
          layout_theme: string | null
          lng: number | null
          logo_url: string | null
          long_description: string | null
          meta_description: string | null
          meta_keywords: string[]
          meta_title: string | null
          og_image: string | null
          phone: string | null
          preview_token: string
          primary_color: string
          rating: number | null
          review_count: number | null
          reviews: Json
          schema_markup: Json | null
          secondary_color: string
          seo_score: number | null
          services: Json
          short_description: string | null
          slug: string
          specialization: string | null
          state: string | null
          status: string
          tagline: string | null
          team: Json
          template_key: string
          theme: string
          updated_at: string
          vertical: string
          website: string | null
          whatsapp_number: string | null
          years_experience: number | null
          zip_code: string | null
        }
        Insert: {
          about?: string | null
          about_us?: string | null
          address?: string | null
          ai_score?: number | null
          booking_link?: string | null
          business_hours?: Json
          canonical_url?: string | null
          city: string
          claimed?: boolean
          clinic_name: string
          consultation_cta?: string | null
          country: string
          country_code?: string
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          faqs?: Json
          font_theme?: string | null
          gallery_images?: string[]
          geo_target_city?: string | null
          geo_target_region?: string | null
          google_business_profile?: string | null
          google_maps_embed?: string | null
          hero_image?: string | null
          hours?: Json
          id?: string
          lat?: number | null
          layout_theme?: string | null
          lng?: number | null
          logo_url?: string | null
          long_description?: string | null
          meta_description?: string | null
          meta_keywords?: string[]
          meta_title?: string | null
          og_image?: string | null
          phone?: string | null
          preview_token?: string
          primary_color?: string
          rating?: number | null
          review_count?: number | null
          reviews?: Json
          schema_markup?: Json | null
          secondary_color?: string
          seo_score?: number | null
          services?: Json
          short_description?: string | null
          slug: string
          specialization?: string | null
          state?: string | null
          status?: string
          tagline?: string | null
          team?: Json
          template_key?: string
          theme?: string
          updated_at?: string
          vertical?: string
          website?: string | null
          whatsapp_number?: string | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Update: {
          about?: string | null
          about_us?: string | null
          address?: string | null
          ai_score?: number | null
          booking_link?: string | null
          business_hours?: Json
          canonical_url?: string | null
          city?: string
          claimed?: boolean
          clinic_name?: string
          consultation_cta?: string | null
          country?: string
          country_code?: string
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          faqs?: Json
          font_theme?: string | null
          gallery_images?: string[]
          geo_target_city?: string | null
          geo_target_region?: string | null
          google_business_profile?: string | null
          google_maps_embed?: string | null
          hero_image?: string | null
          hours?: Json
          id?: string
          lat?: number | null
          layout_theme?: string | null
          lng?: number | null
          logo_url?: string | null
          long_description?: string | null
          meta_description?: string | null
          meta_keywords?: string[]
          meta_title?: string | null
          og_image?: string | null
          phone?: string | null
          preview_token?: string
          primary_color?: string
          rating?: number | null
          review_count?: number | null
          reviews?: Json
          schema_markup?: Json | null
          secondary_color?: string
          seo_score?: number | null
          services?: Json
          short_description?: string | null
          slug?: string
          specialization?: string | null
          state?: string | null
          status?: string
          tagline?: string | null
          team?: Json
          template_key?: string
          theme?: string
          updated_at?: string
          vertical?: string
          website?: string | null
          whatsapp_number?: string | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      outreach: {
        Row: {
          channel: string
          clinic_id: string | null
          contacted_at: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          channel?: string
          clinic_id?: string | null
          contacted_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          channel?: string
          clinic_id?: string | null
          contacted_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      smile_assessments: {
        Row: {
          age_range: string | null
          ai_summary: string | null
          clinic_id: string | null
          clinic_slug: string
          concerns: string[]
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          recommended_services: Json
          smile_goal: string | null
          status: string
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          ai_summary?: string | null
          clinic_id?: string | null
          clinic_slug: string
          concerns?: string[]
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          recommended_services?: Json
          smile_goal?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          ai_summary?: string | null
          clinic_id?: string | null
          clinic_slug?: string
          concerns?: string[]
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          recommended_services?: Json
          smile_goal?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          accent_color: string | null
          created_at: string
          description: string | null
          font_family: string | null
          id: string
          key: string
          name: string
          primary_color: string
          secondary_color: string
          vibe: string | null
        }
        Insert: {
          accent_color?: string | null
          created_at?: string
          description?: string | null
          font_family?: string | null
          id?: string
          key: string
          name: string
          primary_color: string
          secondary_color: string
          vibe?: string | null
        }
        Update: {
          accent_color?: string | null
          created_at?: string
          description?: string | null
          font_family?: string | null
          id?: string
          key?: string
          name?: string
          primary_color?: string
          secondary_color?: string
          vibe?: string | null
        }
        Relationships: []
      }
      verticals: {
        Row: {
          category: string
          created_at: string
          default_template: string
          description: string | null
          icon: string | null
          id: string
          key: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          default_template: string
          description?: string | null
          icon?: string | null
          id?: string
          key: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          default_template?: string
          description?: string | null
          icon?: string | null
          id?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
