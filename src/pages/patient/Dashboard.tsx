
import { useState, useEffect } from "react";
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Droplet, 
  Flame, 
  Apple, 
  LineChart,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

const recentMeals = [
  { 
    id: 1, 
    time: "08:30", 
    name: "Café da Manhã", 
    description: "Ovos mexidos, torrada integral e abacate", 
    calories: 450 
  },
  { 
    id: 2, 
    time: "12:30", 
    name: "Almoço", 
    description: "Arroz integral, frango grelhado e legumes", 
    calories: 650 
  },
  { 
    id: 3, 
    time: "16:00", 
    name: "Lanche", 
    description: "Iogurte com granola e mel", 
    calories: 280 
  },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [todayProgress, setTodayProgress] = useState({
    caloriesConsumed: 1380,
    caloriesGoal: 2000,
    waterConsumed: 1.5,
    waterGoal: 2.5,
  });

  useEffect(() => {
    const fetchTodayProgress = async () => {
      if (!user) return;

      try {
        // Em um caso real, você buscaria dados do Supabase
        // Simulando dados por enquanto
      } catch (error) {
        console.error("Erro ao buscar progresso:", error);
      }
    };

    fetchTodayProgress();
  }, [user]);

  const calculateProgressPercentage = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  return (
    <PatientLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Progress Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Calorias de Hoje
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {todayProgress.caloriesConsumed} / {todayProgress.caloriesGoal} kcal
              </div>
              <Progress 
                value={calculateProgressPercentage(
                  todayProgress.caloriesConsumed, 
                  todayProgress.caloriesGoal
                )} 
                className="h-2 bg-orange-100"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(calculateProgressPercentage(
                  todayProgress.caloriesConsumed, 
                  todayProgress.caloriesGoal
                ))}% da meta diária
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Água de Hoje
              </CardTitle>
              <Droplet className="h-4 w-4 text-water-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {todayProgress.waterConsumed} / {todayProgress.waterGoal} L
              </div>
              <Progress 
                value={calculateProgressPercentage(
                  todayProgress.waterConsumed, 
                  todayProgress.waterGoal
                )} 
                className="h-2 bg-water-100" 
              />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(calculateProgressPercentage(
                  todayProgress.waterConsumed, 
                  todayProgress.waterGoal
                ))}% da meta diária
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Meals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Alimentação Recente</CardTitle>
              <p className="text-sm text-muted-foreground">Últimas refeições registradas</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/patient/recent-meals-ia">
                Ver histórico completo
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMeals.map((meal) => (
                <div key={meal.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="h-10 w-10 rounded-full bg-water-100 flex-shrink-0 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-water-500" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">{meal.name}</h4>
                      <span className="text-sm text-muted-foreground">{meal.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center text-sm font-medium">
                    <Flame className="h-3.5 w-3.5 text-orange-500 mr-1" />
                    {meal.calories} kcal
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/patient/my-diet">
                  <Apple className="mr-2 h-4 w-4" />
                  Ver Minha Dieta
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/patient/my-results">
                  <LineChart className="mr-2 h-4 w-4" />
                  Meus Resultados
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
