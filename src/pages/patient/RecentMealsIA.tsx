
import { useState, useEffect } from "react";
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UtensilsCrossed, 
  Calendar,
  Clock,
  Plus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DailyIntake {
  id: string;
  date: string;
  meal_time: string;
  food_description: string;
  calories: number | null;
  quantity_description: string | null;
  notes: string | null;
  water_ml: number | null;
  protein_g: number | null;
  fat_g: number | null;
  carbohydrates_g: number | null;
  fiber_g: number | null;
  created_at: string;
}

export default function RecentMealsIA() {
  const { user } = useAuth();
  const [mealHistory, setMealHistory] = useState<DailyIntake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMealHistory = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get the date 15 days ago
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        const dateString = fifteenDaysAgo.toISOString().split('T')[0];
        
        // Fetch real data from daily_intake table
        const { data, error } = await supabase
          .from('daily_intake')
          .select('*')
          .eq('patient_id', user.id)
          .gte('date', dateString)
          .order('date', { ascending: false })
          .order('meal_time', { ascending: true });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setMealHistory(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar histórico de refeições:", error);
        setIsLoading(false);
      }
    };

    fetchMealHistory();
  }, [user]);

  // Group meals by date
  const groupMealsByDate = () => {
    const grouped: { [key: string]: DailyIntake[] } = {};
    
    mealHistory.forEach(meal => {
      const date = meal.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(meal);
    });
    
    // Sort dates (most recent first)
    return Object.entries(grouped)
      .sort((a, b) => {
        return new Date(b[0]).getTime() - new Date(a[0]).getTime();
      });
  };

  const groupedMeals = groupMealsByDate();

  const formatTime = (time: string) => {
    // If time is in HH:MM:SS format, return HH:MM
    if (time && time.includes(':')) {
      return time.substring(0, 5);
    }
    return time;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <PatientLayout title="Histórico de Refeições">
        <div className="flex items-center justify-center h-64">
          <p>Carregando histórico de refeições...</p>
        </div>
      </PatientLayout>
    );
  }

  if (mealHistory.length === 0) {
    return (
      <PatientLayout title="Histórico de Refeições">
        <div className="text-center py-12">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma refeição encontrada</h2>
          <p className="text-muted-foreground">
            Você ainda não registrou nenhuma refeição nos últimos 15 dias.
          </p>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Histórico de Refeições">
      <div className="space-y-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              Histórico de Refeições
            </CardTitle>
            <CardDescription>
              Registro das suas refeições nos últimos 15 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Aqui você pode visualizar todas as refeições que você registrou nos últimos 15 dias.
              Estas informações são utilizadas para calcular seu consumo médio diário.
            </p>
          </CardContent>
        </Card>

        {groupedMeals.map(([date, meals]) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{formatDate(date)}</h3>
            </div>
            
            {meals.map((meal) => (
              <Card key={meal.id} className="overflow-hidden">
                <div className="bg-nutriflow-50 p-3 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-nutriflow-600" />
                    <span className="font-medium">{formatTime(meal.meal_time)}</span>
                  </div>
                  <div className="text-sm text-nutriflow-700">
                    {meal.calories ? `${meal.calories} kcal` : ""}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-medium">{meal.food_description}</div>
                    {meal.quantity_description && (
                      <div className="text-sm text-muted-foreground">
                        Porção: {meal.quantity_description}
                      </div>
                    )}
                    
                    {(meal.protein_g || meal.carbohydrates_g || meal.fat_g) && (
                      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                        {meal.protein_g && (
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="font-medium">Proteínas</div>
                            <div>{meal.protein_g}g</div>
                          </div>
                        )}
                        {meal.carbohydrates_g && (
                          <div className="bg-amber-50 p-2 rounded">
                            <div className="font-medium">Carboidratos</div>
                            <div>{meal.carbohydrates_g}g</div>
                          </div>
                        )}
                        {meal.fat_g && (
                          <div className="bg-rose-50 p-2 rounded">
                            <div className="font-medium">Gorduras</div>
                            <div>{meal.fat_g}g</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {meal.notes && (
                      <div className="text-sm mt-2 p-2 bg-gray-50 rounded-md">
                        {meal.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </PatientLayout>
  );
}
