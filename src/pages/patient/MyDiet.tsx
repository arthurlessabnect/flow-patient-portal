
import { useState, useEffect } from "react";
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  FileText, 
  Clock, 
  Flame, 
  Droplet, 
  Download, 
  Apple,
  Drumstick
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Diet, Meal, FoodItem } from "@/types";

export default function MyDiet() {
  const { user } = useAuth();
  const [activeDiet, setActiveDiet] = useState<Diet | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveDiet = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Em um caso real, você buscaria do Supabase
        // Simulando dados por enquanto
        const mockDiet: Diet = {
          id: "1",
          patient_id: "patient1",
          nutritionist_id: "nutritionist1",
          created_at: "2023-04-01",
          name: "Dieta de Emagrecimento Saudável",
          start_date: "2023-04-01",
          end_date: "2023-06-30",
          goals: {
            calories_per_day: 2000,
            water_per_day: 2.5,
            protein_per_day: 120,
            carbs_per_day: 200,
            fat_per_day: 65
          },
          diet_pdf_url: null,
          is_active: true
        };
        
        const mockMeals: Meal[] = [
          {
            id: "1",
            diet_id: "1",
            created_at: "2023-04-01",
            name: "Café da Manhã",
            time: "07:30",
            order: 1,
            food_items: [
              {
                id: "1",
                meal_id: "1",
                created_at: "2023-04-01",
                name: "Ovos mexidos",
                quantity: "2 unidades",
                calories: 180,
                protein: 12,
                carbs: 0,
                fat: 10
              },
              {
                id: "2",
                meal_id: "1",
                created_at: "2023-04-01",
                name: "Torrada integral",
                quantity: "2 fatias",
                calories: 120,
                protein: 4,
                carbs: 24,
                fat: 2
              },
              {
                id: "3",
                meal_id: "1",
                created_at: "2023-04-01",
                name: "Abacate",
                quantity: "1/2 unidade",
                calories: 120,
                protein: 1,
                carbs: 6,
                fat: 10
              }
            ]
          },
          {
            id: "2",
            diet_id: "1",
            created_at: "2023-04-01",
            name: "Lanche da Manhã",
            time: "10:00",
            order: 2,
            food_items: [
              {
                id: "4",
                meal_id: "2",
                created_at: "2023-04-01",
                name: "Iogurte natural",
                quantity: "200g",
                calories: 120,
                protein: 10,
                carbs: 12,
                fat: 5
              },
              {
                id: "5",
                meal_id: "2",
                created_at: "2023-04-01",
                name: "Frutas vermelhas",
                quantity: "1 xícara",
                calories: 80,
                protein: 1,
                carbs: 20,
                fat: 0
              }
            ]
          },
          {
            id: "3",
            diet_id: "1",
            created_at: "2023-04-01",
            name: "Almoço",
            time: "13:00",
            order: 3,
            food_items: [
              {
                id: "6",
                meal_id: "3",
                created_at: "2023-04-01",
                name: "Filé de frango grelhado",
                quantity: "150g",
                calories: 250,
                protein: 40,
                carbs: 0,
                fat: 8
              },
              {
                id: "7",
                meal_id: "3",
                created_at: "2023-04-01",
                name: "Arroz integral",
                quantity: "4 colheres de sopa",
                calories: 150,
                protein: 3,
                carbs: 32,
                fat: 1
              },
              {
                id: "8",
                meal_id: "3",
                created_at: "2023-04-01",
                name: "Feijão",
                quantity: "3 colheres de sopa",
                calories: 110,
                protein: 7,
                carbs: 20,
                fat: 0
              },
              {
                id: "9",
                meal_id: "3",
                created_at: "2023-04-01",
                name: "Salada verde",
                quantity: "à vontade",
                calories: 50,
                protein: 2,
                carbs: 10,
                fat: 0
              }
            ]
          },
          {
            id: "4",
            diet_id: "1",
            created_at: "2023-04-01",
            name: "Lanche da Tarde",
            time: "16:00",
            order: 4,
            food_items: [
              {
                id: "10",
                meal_id: "4",
                created_at: "2023-04-01",
                name: "Maçã",
                quantity: "1 unidade",
                calories: 80,
                protein: 0,
                carbs: 21,
                fat: 0
              },
              {
                id: "11",
                meal_id: "4",
                created_at: "2023-04-01",
                name: "Castanhas",
                quantity: "1 punhado",
                calories: 160,
                protein: 5,
                carbs: 6,
                fat: 14
              }
            ]
          },
          {
            id: "5",
            diet_id: "1",
            created_at: "2023-04-01",
            name: "Jantar",
            time: "20:00",
            order: 5,
            food_items: [
              {
                id: "12",
                meal_id: "5",
                created_at: "2023-04-01",
                name: "Peixe assado",
                quantity: "150g",
                calories: 200,
                protein: 35,
                carbs: 0,
                fat: 8
              },
              {
                id: "13",
                meal_id: "5",
                created_at: "2023-04-01",
                name: "Batata doce",
                quantity: "1 unidade média",
                calories: 120,
                protein: 2,
                carbs: 27,
                fat: 0
              },
              {
                id: "14",
                meal_id: "5",
                created_at: "2023-04-01",
                name: "Legumes no vapor",
                quantity: "1 xícara",
                calories: 60,
                protein: 2,
                carbs: 14,
                fat: 0
              }
            ]
          }
        ];
        
        setTimeout(() => {
          setActiveDiet(mockDiet);
          setMeals(mockMeals);
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error("Erro ao buscar dieta ativa:", error);
        setIsLoading(false);
      }
    };

    fetchActiveDiet();
  }, [user]);

  const calculateTotalNutrients = (meals: Meal[]) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    meals.forEach(meal => {
      meal.food_items?.forEach(item => {
        totalCalories += item.calories || 0;
        totalProtein += item.protein || 0;
        totalCarbs += item.carbs || 0;
        totalFat += item.fat || 0;
      });
    });
    
    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  if (isLoading) {
    return (
      <PatientLayout title="Minha Dieta">
        <div className="flex items-center justify-center h-64">
          <p>Carregando sua dieta...</p>
        </div>
      </PatientLayout>
    );
  }

  if (!activeDiet || !meals.length) {
    return (
      <PatientLayout title="Minha Dieta">
        <div className="text-center py-12">
          <Apple className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma dieta ativa</h2>
          <p className="text-muted-foreground">
            Você ainda não possui uma dieta ativa. 
            Seu nutricionista irá criar uma dieta para você em breve.
          </p>
        </div>
      </PatientLayout>
    );
  }

  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotalNutrients(meals);

  return (
    <PatientLayout title="Minha Dieta">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{activeDiet.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(activeDiet.start_date).toLocaleDateString('pt-BR')}
                    {activeDiet.end_date && ` até ${new Date(activeDiet.end_date).toLocaleDateString('pt-BR')}`}
                  </span>
                </CardDescription>
              </div>
              
              {activeDiet.diet_pdf_url && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF da Dieta
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Calorias/dia</p>
                <p className="text-lg font-medium">{activeDiet.goals?.calories_per_day || "-"} kcal</p>
              </div>
              
              <div className="text-center p-3 bg-water-50 rounded-lg">
                <Droplet className="h-5 w-5 text-water-500 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Água/dia</p>
                <p className="text-lg font-medium">{activeDiet.goals?.water_per_day || "-"} L</p>
              </div>

              <div className="text-center p-3 bg-red-50 rounded-lg">
                <Drumstick className="h-5 w-5 text-red-500 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Proteína/dia</p>
                <p className="text-lg font-medium">{activeDiet.goals?.protein_per_day || "-"} g</p>
              </div>
              
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <Apple className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Carboidratos/dia</p>
                <p className="text-lg font-medium">{activeDiet.goals?.carbs_per_day || "-"} g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">Todas Refeições</TabsTrigger>
              <TabsTrigger value="summary">Resumo</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-6">
            {meals.map((meal) => (
              <Card key={meal.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <CardTitle className="text-lg">{meal.name}</CardTitle>
                      <div className="ml-4 px-2 py-1 bg-muted rounded text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {meal.time}
                      </div>
                    </div>
                    
                    {meal.food_items && meal.food_items.length > 0 && (
                      <div className="text-sm flex items-center text-muted-foreground">
                        <Flame className="h-3.5 w-3.5 text-orange-500 mr-1" />
                        {meal.food_items.reduce((acc, item) => acc + (item.calories || 0), 0)} kcal
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {meal.food_items && meal.food_items.length > 0 ? (
                    <div className="space-y-3">
                      {meal.food_items.map((item) => (
                        <div key={item.id} className="grid grid-cols-2 md:grid-cols-4 text-sm border-b pb-2 last:border-0 last:pb-0">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">{item.quantity}</div>
                          <div className="text-muted-foreground md:text-right">
                            <span className="md:hidden">P: </span>
                            {item.protein || 0}g P / 
                            <span className="md:hidden">C: </span>
                            {item.carbs || 0}g C / 
                            <span className="md:hidden">G: </span>
                            {item.fat || 0}g G
                          </div>
                          <div className="text-right">
                            <Flame className="h-3.5 w-3.5 text-orange-500 inline mr-1" />
                            {item.calories || 0} kcal
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Nenhum item alimentar cadastrado para esta refeição.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Nutricional</CardTitle>
                <CardDescription>
                  Visão geral nutricional da sua dieta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Total Calorias</p>
                    <p className="text-lg font-medium">{totalCalories} kcal</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="h-5 w-5 text-red-500 mx-auto mb-1 font-bold">P</div>
                    <p className="text-sm text-muted-foreground">Total Proteínas</p>
                    <p className="text-lg font-medium">{totalProtein} g</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="h-5 w-5 text-yellow-500 mx-auto mb-1 font-bold">C</div>
                    <p className="text-sm text-muted-foreground">Total Carboidratos</p>
                    <p className="text-lg font-medium">{totalCarbs} g</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="h-5 w-5 text-blue-500 mx-auto mb-1 font-bold">G</div>
                    <p className="text-sm text-muted-foreground">Total Gorduras</p>
                    <p className="text-lg font-medium">{totalFat} g</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-3">Distribuição de Macronutrientes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 bg-red-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${(totalProtein * 4 / totalCalories) * 100}%` }}
                      />
                    </div>
                    <div className="h-8 bg-yellow-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(totalCarbs * 4 / totalCalories) * 100}%` }}
                      />
                    </div>
                    <div className="h-8 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(totalFat * 9 / totalCalories) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-xs text-center mt-2">
                    <div>
                      <span className="font-medium">Proteínas</span>
                      <p>{Math.round((totalProtein * 4 / totalCalories) * 100)}%</p>
                    </div>
                    <div>
                      <span className="font-medium">Carboidratos</span>
                      <p>{Math.round((totalCarbs * 4 / totalCalories) * 100)}%</p>
                    </div>
                    <div>
                      <span className="font-medium">Gorduras</span>
                      <p>{Math.round((totalFat * 9 / totalCalories) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PatientLayout>
  );
}
