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
      diets: {
        Row: {
          created_at: string
          description: string | null
          diet_pdf_url: string | null
          end_date: string | null
          food_description: string | null
          id: string
          name: string
          nutritionist_id: string
          patient_id: string
          quantity_description: string | null
          start_date: string
          target_calories: number | null
          target_carbohydrate_g: number | null
          target_fat_g: number | null
          target_fiber_g: number | null
          target_protein_g: number | null
          target_water_ml: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          diet_pdf_url?: string | null
          end_date?: string | null
          food_description?: string | null
          id?: string
          name?: string
          nutritionist_id: string
          patient_id: string
          quantity_description?: string | null
          start_date: string
          target_calories?: number | null
          target_carbohydrate_g?: number | null
          target_fat_g?: number | null
          target_fiber_g?: number | null
          target_protein_g?: number | null
          target_water_ml?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          diet_pdf_url?: string | null
          end_date?: string | null
          food_description?: string | null
          id?: string
          name?: string
          nutritionist_id?: string
          patient_id?: string
          quantity_description?: string | null
          start_date?: string
          target_calories?: number | null
          target_carbohydrate_g?: number | null
          target_fat_g?: number | null
          target_fiber_g?: number | null
          target_protein_g?: number | null
          target_water_ml?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diets_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "nutritionists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diets_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          calories: number | null
          carbohydrates_g: number | null
          created_at: string
          fat_g: number | null
          id: string
          meal_id: string
          name: string
          notes: string | null
          protein_g: number | null
          quantity: string | null
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbohydrates_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: string
          meal_id: string
          name: string
          notes?: string | null
          protein_g?: number | null
          quantity?: string | null
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbohydrates_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: string
          meal_id?: string
          name?: string
          notes?: string | null
          protein_g?: number | null
          quantity?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string
          description: string | null
          diet_id: string
          id: string
          name: string
          order_index: number | null
          time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          diet_id: string
          id?: string
          name: string
          order_index?: number | null
          time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          diet_id?: string
          id?: string
          name?: string
          order_index?: number | null
          time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          created_at: string
          ia_response: Json | null
          id: number
          message_content: string | null
          message_timestamp: string
          message_type: string | null
          patient_id: string
          processed_successfully: boolean | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          ia_response?: Json | null
          id?: number
          message_content?: string | null
          message_timestamp?: string
          message_type?: string | null
          patient_id: string
          processed_successfully?: boolean | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          ia_response?: Json | null
          id?: number
          message_content?: string | null
          message_timestamp?: string
          message_type?: string | null
          patient_id?: string
          processed_successfully?: boolean | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "n8n_chat_histories_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      nutritionists: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string
          id: string
          name: string
          type: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email: string
          id?: string
          name: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      patient_progress: {
        Row: {
          body_fat_percentage: number | null
          calories_consumed: number | null
          created_at: string
          id: string
          measurements: Json | null
          notes: string | null
          patient_id: string
          record_date: string
          updated_at: string
          water_ml_consumed: number | null
          weight_kg: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          calories_consumed?: number | null
          created_at?: string
          id?: string
          measurements?: Json | null
          notes?: string | null
          patient_id: string
          record_date?: string
          updated_at?: string
          water_ml_consumed?: number | null
          weight_kg?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          calories_consumed?: number | null
          created_at?: string
          id?: string
          measurements?: Json | null
          notes?: string | null
          patient_id?: string
          record_date?: string
          updated_at?: string
          water_ml_consumed?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_progress_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          basal_metabolic_rate: number | null
          birth_date: string | null
          body_fat_percentage: number | null
          created_at: string
          email: string
          gender: string | null
          goal: string | null
          height_cm: number | null
          id: string
          initial_weight_kg: number | null
          measurements: Json | null
          name: string
          nutritionist_id: string
          phone: string | null
          updated_at: string
          water_goal_ml: number | null
        }
        Insert: {
          basal_metabolic_rate?: number | null
          birth_date?: string | null
          body_fat_percentage?: number | null
          created_at?: string
          email: string
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id: string
          initial_weight_kg?: number | null
          measurements?: Json | null
          name: string
          nutritionist_id: string
          phone?: string | null
          updated_at?: string
          water_goal_ml?: number | null
        }
        Update: {
          basal_metabolic_rate?: number | null
          birth_date?: string | null
          body_fat_percentage?: number | null
          created_at?: string
          email?: string
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          initial_weight_kg?: number | null
          measurements?: Json | null
          name?: string
          nutritionist_id?: string
          phone?: string | null
          updated_at?: string
          water_goal_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_nutritionist_id_fkey"
            columns: ["nutritionist_id"]
            isOneToOne: false
            referencedRelation: "nutritionists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_patient: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
