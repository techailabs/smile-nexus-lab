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
          address: string | null
          ai_score: number | null
          city: string
          claimed: boolean
          clinic_name: string
          country: string
          created_at: string
          email: string | null
          faqs: Json
          hero_image: string | null
          hours: Json
          id: string
          lat: number | null
          lng: number | null
          phone: string | null
          primary_color: string
          rating: number | null
          review_count: number | null
          reviews: Json
          secondary_color: string
          seo_score: number | null
          services: Json
          slug: string
          tagline: string | null
          theme: string
          updated_at: string
          website: string | null
        }
        Insert: {
          about?: string | null
          address?: string | null
          ai_score?: number | null
          city: string
          claimed?: boolean
          clinic_name: string
          country: string
          created_at?: string
          email?: string | null
          faqs?: Json
          hero_image?: string | null
          hours?: Json
          id?: string
          lat?: number | null
          lng?: number | null
          phone?: string | null
          primary_color?: string
          rating?: number | null
          review_count?: number | null
          reviews?: Json
          secondary_color?: string
          seo_score?: number | null
          services?: Json
          slug: string
          tagline?: string | null
          theme?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          address?: string | null
          ai_score?: number | null
          city?: string
          claimed?: boolean
          clinic_name?: string
          country?: string
          created_at?: string
          email?: string | null
          faqs?: Json
          hero_image?: string | null
          hours?: Json
          id?: string
          lat?: number | null
          lng?: number | null
          phone?: string | null
          primary_color?: string
          rating?: number | null
          review_count?: number | null
          reviews?: Json
          secondary_color?: string
          seo_score?: number | null
          services?: Json
          slug?: string
          tagline?: string | null
          theme?: string
          updated_at?: string
          website?: string | null
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
