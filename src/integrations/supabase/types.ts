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
      daily_intake: {
        Row: {
          calories: number | null
          carbohydrates_g: number | null
          created_at: string | null
          date: string
          fat_g: number | null
          fiber_g: number | null
          food_description: string | null
          id: string
          meal_time: string | null
          notes: string | null
          patient_id: string | null
          protein_g: number | null
          quantity_description: string | null
          water_ml: number | null
        }
        Insert: {
          calories?: number | null
          carbohydrates_g?: number | null
          created_at?: string | null
          date: string
          fat_g?: number | null
          fiber_g?: number | null
          food_description?: string | null
          id?: string
          meal_time?: string | null
          notes?: string | null
          patient_id?: string | null
          protein_g?: number | null
          quantity_description?: string | null
          water_ml?: number | null
        }
        Update: {
          calories?: number | null
          carbohydrates_g?: number | null
          created_at?: string | null
          date?: string
          fat_g?: number | null
          fiber_g?: number | null
          food_description?: string | null
          id?: string
          meal_time?: string | null
          notes?: string | null
          patient_id?: string | null
          protein_g?: number | null
          quantity_description?: string | null
          water_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_intake_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      diets: {
        Row: {
          created_at: string | null
          diet_pdf_url: string | null
          end_date: string
          id: string
          nutritionist_id: string
          patient_id: string
          start_date: string
          target_calories: number | null
          target_carbohydrates_g: number | null
          target_fat_g: number | null
          target_fiber_g: number | null
          target_protein_g: number | null
          target_water_ml: number | null
        }
        Insert: {
          created_at?: string | null
          diet_pdf_url?: string | null
          end_date: string
          id?: string
          nutritionist_id: string
          patient_id: string
          start_date: string
          target_calories?: number | null
          target_carbohydrates_g?: number | null
          target_fat_g?: number | null
          target_fiber_g?: number | null
          target_protein_g?: number | null
          target_water_ml?: number | null
        }
        Update: {
          created_at?: string | null
          diet_pdf_url?: string | null
          end_date?: string
          id?: string
          nutritionist_id?: string
          patient_id?: string
          start_date?: string
          target_calories?: number | null
          target_carbohydrates_g?: number | null
          target_fat_g?: number | null
          target_fiber_g?: number | null
          target_protein_g?: number | null
          target_water_ml?: number | null
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
          id: string
          meal_id: string
          name: string
          notes: string | null
          quantity: string | null
        }
        Insert: {
          id?: string
          meal_id: string
          name: string
          notes?: string | null
          quantity?: string | null
        }
        Update: {
          id?: string
          meal_id?: string
          name?: string
          notes?: string | null
          quantity?: string | null
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
          description: string | null
          diet_id: string
          id: string
          name: string
          order_index: number
          time: string
        }
        Insert: {
          description?: string | null
          diet_id: string
          id?: string
          name: string
          order_index: number
          time: string
        }
        Update: {
          description?: string | null
          diet_id?: string
          id?: string
          name?: string
          order_index?: number
          time?: string
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
      medidas_paciente: {
        Row: {
          abdomen: number | null
          braço: number | null
          costas: number | null
          created_at: string
          id: number
          id_paciente: string | null
          patient_name: string | null
          peitoral: number | null
          perna: number | null
        }
        Insert: {
          abdomen?: number | null
          braço?: number | null
          costas?: number | null
          created_at?: string
          id?: number
          id_paciente?: string | null
          patient_name?: string | null
          peitoral?: number | null
          perna?: number | null
        }
        Update: {
          abdomen?: number | null
          braço?: number | null
          costas?: number | null
          created_at?: string
          id?: number
          id_paciente?: string | null
          patient_name?: string | null
          peitoral?: number | null
          perna?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medidas_paciente_id_paciente_fkey"
            columns: ["id_paciente"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      nutritionists: {
        Row: {
          email: string
          id: string
          name: string
          type: string | null
        }
        Insert: {
          email: string
          id: string
          name: string
          type?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      patient_progress: {
        Row: {
          body_fat_percentage: number | null
          created_at: string
          id: string
          measurements: Json | null
          notes: string | null
          patient_id: string
          record_date: string
          weight_kg: number
        }
        Insert: {
          body_fat_percentage?: number | null
          created_at?: string
          id?: string
          measurements?: Json | null
          notes?: string | null
          patient_id: string
          record_date?: string
          weight_kg: number
        }
        Update: {
          body_fat_percentage?: number | null
          created_at?: string
          id?: string
          measurements?: Json | null
          notes?: string | null
          patient_id?: string
          record_date?: string
          weight_kg?: number
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
          auth_user_id: string | null
          basal_metabolic_rate: number | null
          birth_date: string | null
          body_fat_percentage: number | null
          created_at: string | null
          email: string
          gender: string | null
          goal: string | null
          height_cm: number | null
          id: string
          initial_weight_kg: number | null
          meta_agua: number | null
          name: string
          nutritionist_id: string | null
          phone: string | null
        }
        Insert: {
          auth_user_id?: string | null
          basal_metabolic_rate?: number | null
          birth_date?: string | null
          body_fat_percentage?: number | null
          created_at?: string | null
          email: string
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id: string
          initial_weight_kg?: number | null
          meta_agua?: number | null
          name: string
          nutritionist_id?: string | null
          phone?: string | null
        }
        Update: {
          auth_user_id?: string | null
          basal_metabolic_rate?: number | null
          birth_date?: string | null
          body_fat_percentage?: number | null
          created_at?: string | null
          email?: string
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          initial_weight_kg?: number | null
          meta_agua?: number | null
          name?: string
          nutritionist_id?: string | null
          phone?: string | null
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
