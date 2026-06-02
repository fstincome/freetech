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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      hackathon_registrations: {
        Row: {
          bitcoin_level: string
          created_at: string
          email: string
          full_name: string
          id: string
          languages: string[]
          motivation: string | null
          phone: string | null
          profession: string | null
          specialty: string
          status: string
          target_hackathon: string
        }
        Insert: {
          bitcoin_level?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          languages?: string[]
          motivation?: string | null
          phone?: string | null
          profession?: string | null
          specialty?: string
          status?: string
          target_hackathon?: string
        }
        Update: {
          bitcoin_level?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          languages?: string[]
          motivation?: string | null
          phone?: string | null
          profession?: string | null
          specialty?: string
          status?: string
          target_hackathon?: string
        }
        Relationships: []
      }
      hackathon_trainers: {
        Row: {
          bio: string
          created_at: string
          id: string
          image_url: string
          linkedin_url: string
          name: string
          role: string
          sort_order: number
          twitter_url: string
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          id?: string
          image_url?: string
          linkedin_url?: string
          name: string
          role?: string
          sort_order?: number
          twitter_url?: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          image_url?: string
          linkedin_url?: string
          name?: string
          role?: string
          sort_order?: number
          twitter_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_events: {
        Row: {
          created_at: string
          description: string
          event_date: string
          id: string
          image_url: string
          link: string
          location: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image_url: string
          link?: string
          location?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image_url?: string
          link?: string
          location?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_hero_slides: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          label: string
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url: string
          label?: string
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          label?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_impact_stats: {
        Row: {
          created_at: string
          id: string
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      site_partners: {
        Row: {
          created_at: string
          id: string
          logo_url: string
          name: string
          partner_type: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url: string
          name?: string
          partner_type?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string
          name?: string
          partner_type?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_programs: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_reports: {
        Row: {
          cover_image_url: string
          created_at: string
          description: string
          drive_link: string
          id: string
          sort_order: number
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          cover_image_url?: string
          created_at?: string
          description?: string
          drive_link?: string
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
          year?: number
        }
        Update: {
          cover_image_url?: string
          created_at?: string
          description?: string
          drive_link?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      site_team_members: {
        Row: {
          bio: string
          created_at: string
          id: string
          image_url: string
          is_board: boolean
          linkedin_url: string
          name: string
          role: string
          slug: string | null
          sort_order: number
          twitter_url: string
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          id?: string
          image_url: string
          is_board?: boolean
          linkedin_url?: string
          name: string
          role?: string
          slug?: string | null
          sort_order?: number
          twitter_url?: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          image_url?: string
          is_board?: boolean
          linkedin_url?: string
          name?: string
          role?: string
          slug?: string | null
          sort_order?: number
          twitter_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_testimonials: {
        Row: {
          author_image_url: string
          author_name: string
          author_role: string
          created_at: string
          id: string
          sort_order: number
          text: string
          updated_at: string
        }
        Insert: {
          author_image_url?: string
          author_name: string
          author_role?: string
          created_at?: string
          id?: string
          sort_order?: number
          text: string
          updated_at?: string
        }
        Update: {
          author_image_url?: string
          author_name?: string
          author_role?: string
          created_at?: string
          id?: string
          sort_order?: number
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_workshops: {
        Row: {
          created_at: string
          gallery: string[]
          id: string
          image_url: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          gallery?: string[]
          id?: string
          image_url: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          gallery?: string[]
          id?: string
          image_url?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_logs: {
        Row: {
          city: string | null
          country: string | null
          id: string
          page_path: string
          referrer: string | null
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      slugify: { Args: { value: string }; Returns: string }
    }
    Enums: {
      app_role: "admin"
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
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
