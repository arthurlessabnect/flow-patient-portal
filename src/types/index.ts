
export type Role = 'admin' | 'nutritionist' | 'patient';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

export interface Patient {
  id: string;
  auth_user_id: string;
  nutritionist_id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  height: number | null;
  initial_weight: number | null;
  goal: string | null;
  body_fat_percentage: number | null;
  bmr: number | null;
}

export interface Diet {
  id: string;
  patient_id: string;
  nutritionist_id: string;
  created_at: string;
  name: string;
  start_date: string;
  end_date: string | null;
  goals: any | null;
  diet_pdf_url: string | null;
  is_active: boolean;
}

export interface Meal {
  id: string;
  diet_id: string;
  created_at: string;
  name: string;
  time: string;
  order: number;
  food_items?: FoodItem[];
}

export interface FoodItem {
  id: string;
  meal_id: string;
  created_at: string;
  name: string;
  quantity: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

export interface PatientProgress {
  id: string;
  patient_id: string;
  date: string;
  weight: number | null;
  calories_consumed: number | null;
  water_consumed: number | null;
  notes: string | null;
}

export interface MealChatHistory {
  id: string;
  patient_id: string;
  created_at: string;
  message: string;
  is_from_ai: boolean;
  meal_data: any | null;
}

export interface AddPatientFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birth_date: string;
  height: number;
  initial_weight: number;
  goal: string;
  body_fat_percentage: number;
  bmr: number;
}

export interface PatientProgressFormData {
  date: string;
  weight: number;
  calories_consumed: number;
  water_consumed: number;
  notes?: string;
}
