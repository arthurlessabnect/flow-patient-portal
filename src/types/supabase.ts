
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          auth_user_id: string
          nutritionist_id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          gender: string | null
          birth_date: string | null
          height: number | null
          initial_weight: number | null
          goal: string | null
          body_fat_percentage: number | null
          bmr: number | null
        }
        Insert: {
          id?: string
          auth_user_id: string
          nutritionist_id: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          gender?: string | null
          birth_date?: string | null
          height?: number | null
          initial_weight?: number | null
          goal?: string | null
          body_fat_percentage?: number | null
          bmr?: number | null
        }
        Update: {
          id?: string
          auth_user_id?: string
          nutritionist_id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          gender?: string | null
          birth_date?: string | null
          height?: number | null
          initial_weight?: number | null
          goal?: string | null
          body_fat_percentage?: number | null
          bmr?: number | null
        }
      }
      diets: {
        Row: {
          id: string
          patient_id: string
          nutritionist_id: string
          created_at: string
          name: string
          start_date: string
          end_date: string | null
          goals: Json | null
          diet_pdf_url: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          patient_id: string
          nutritionist_id: string
          created_at?: string
          name: string
          start_date: string
          end_date?: string | null
          goals?: Json | null
          diet_pdf_url?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          patient_id?: string
          nutritionist_id?: string
          created_at?: string
          name?: string
          start_date?: string
          end_date?: string | null
          goals?: Json | null
          diet_pdf_url?: string | null
          is_active?: boolean
        }
      }
      meals: {
        Row: {
          id: string
          diet_id: string
          created_at: string
          name: string
          time: string
          order: number
        }
        Insert: {
          id?: string
          diet_id: string
          created_at?: string
          name: string
          time: string
          order: number
        }
        Update: {
          id?: string
          diet_id?: string
          created_at?: string
          name?: string
          time?: string
          order?: number
        }
      }
      food_items: {
        Row: {
          id: string
          meal_id: string
          created_at: string
          name: string
          quantity: string
          calories: number | null
          protein: number | null
          carbs: number | null
          fat: number | null
        }
        Insert: {
          id?: string
          meal_id: string
          created_at?: string
          name: string
          quantity: string
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
        }
        Update: {
          id?: string
          meal_id?: string
          created_at?: string
          name?: string
          quantity?: string
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
        }
      }
      patient_progress: {
        Row: {
          id: string
          patient_id: string
          date: string
          weight: number | null
          calories_consumed: number | null
          water_consumed: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          date: string
          weight?: number | null
          calories_consumed?: number | null
          water_consumed?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          date?: string
          weight?: number | null
          calories_consumed?: number | null
          water_consumed?: number | null
          notes?: string | null
        }
      }
      meal_chat_history: {
        Row: {
          id: string
          patient_id: string
          created_at: string
          message: string
          is_from_ai: boolean
          meal_data: Json | null
        }
        Insert: {
          id?: string
          patient_id: string
          created_at?: string
          message: string
          is_from_ai: boolean
          meal_data?: Json | null
        }
        Update: {
          id?: string
          patient_id?: string
          created_at?: string
          message?: string
          is_from_ai?: boolean
          meal_data?: Json | null
        }
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
  }
}
