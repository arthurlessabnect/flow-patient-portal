
import { useState, useEffect } from "react";
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { UtensilsCrossed, Clock } from "lucide-react";

interface MealEntry {
  id: string;
  date: string;
  meal_time: string;
  food_description: string;
  calories: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
}

export default function RecentMealsHistory() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMealHistory = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get today's date
        const today = new Date();
        
        // Get date 15 days ago
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        
        // Format dates for Supabase query
        const fromDate = fifteenDaysAgo.toISOString().split('T')[0];
        const toDate = today.toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('daily_intake')
          .select('*')
          .eq('patient_id', user.id)
          .gte('date', fromDate)
          .lte('date', toDate)
          .order('date', { ascending: false })
          .order('meal_time', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setMeals(data || []);
      } catch (error) {
        console.error("Erro ao buscar histórico de refeições:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealHistory();
  }, [user]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5); // Get HH:MM
  };

  const groupMealsByDate = () => {
    const grouped: Record<string, MealEntry[]> = {};
    
    meals.forEach(meal => {
      const date = meal.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(meal);
    });
    
    return grouped;
  };

  const groupedMeals = groupMealsByDate();

  return (
    <PatientLayout title="Histórico de Refeições">
      <div className="space-y-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-green-900 flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-green-600" />
              Refeições dos Últimos 15 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p>Carregando histórico de refeições...</p>
              </div>
            ) : meals.length === 0 ? (
              <div className="text-center py-12">
                <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma refeição registrada</h3>
                <p className="text-gray-500">
                  Não há refeições registradas nos últimos 15 dias.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedMeals).map(([date, mealList]) => (
                  <div key={date} className="space-y-4">
                    <h3 className="font-semibold text-lg text-green-800">
                      {formatDate(date)}
                    </h3>
                    <div className="space-y-4">
                      {mealList.map((meal) => (
                        <div key={meal.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between mb-1">
                              <h4 className="font-medium text-green-900">
                                {meal.meal_time ? formatTime(meal.meal_time) : "Sem horário"}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600">{meal.food_description || "Sem descrição"}</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                {meal.calories || 0} kcal
                              </span>
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                P: {meal.protein_g || 0}g
                              </span>
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                C: {meal.carbohydrates_g || 0}g
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                G: {meal.fat_g || 0}g
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
