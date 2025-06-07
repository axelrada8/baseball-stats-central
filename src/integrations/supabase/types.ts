export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      offensive_stats: {
        Row: {
          ab: number | null
          bb: number | null
          created_at: string
          date: string
          doubles: number | null
          h: number | null
          hr: number | null
          id: string
          k: number | null
          r: number | null
          rbi: number | null
          sb: number | null
          triples: number | null
          user_id: string
        }
        Insert: {
          ab?: number | null
          bb?: number | null
          created_at?: string
          date: string
          doubles?: number | null
          h?: number | null
          hr?: number | null
          id?: string
          k?: number | null
          r?: number | null
          rbi?: number | null
          sb?: number | null
          triples?: number | null
          user_id: string
        }
        Update: {
          ab?: number | null
          bb?: number | null
          created_at?: string
          date?: string
          doubles?: number | null
          h?: number | null
          hr?: number | null
          id?: string
          k?: number | null
          r?: number | null
          rbi?: number | null
          sb?: number | null
          triples?: number | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_method: string
          paypal_payment_id: string
          status: string
          subscription_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_method: string
          paypal_payment_id: string
          status: string
          subscription_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string
          paypal_payment_id?: string
          status?: string
          subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      pitching_stats: {
        Row: {
          bb: number | null
          created_at: string
          date: string
          er: number | null
          h: number | null
          id: string
          ip: number | null
          k: number | null
          l: number | null
          r: number | null
          sv: number | null
          user_id: string
          w: number | null
        }
        Insert: {
          bb?: number | null
          created_at?: string
          date: string
          er?: number | null
          h?: number | null
          id?: string
          ip?: number | null
          k?: number | null
          l?: number | null
          r?: number | null
          sv?: number | null
          user_id: string
          w?: number | null
        }
        Update: {
          bb?: number | null
          created_at?: string
          date?: string
          er?: number | null
          h?: number | null
          id?: string
          ip?: number | null
          k?: number | null
          l?: number | null
          r?: number | null
          sv?: number | null
          user_id?: string
          w?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          photo_url: string | null
          position: string | null
          team: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          photo_url?: string | null
          position?: string | null
          team?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          position?: string | null
          team?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          end_date: string | null
          id: string
          paypal_subscription_id: string | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_end_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          end_date?: string | null
          id?: string
          paypal_subscription_id?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_end_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          end_date?: string | null
          id?: string
          paypal_subscription_id?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_end_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_premium_access: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      plan_type: "free" | "premium"
      subscription_status: "active" | "cancelled" | "expired" | "trial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      plan_type: ["free", "premium"],
      subscription_status: ["active", "cancelled", "expired", "trial"],
    },
  },
} as const
