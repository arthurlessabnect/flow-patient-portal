
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Utensils, CalendarRange } from "lucide-react";

export default function CreateDiet() {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dietData, setDietData] = useState({
    start_date: '',
    end_date: '',
    target_calories: '',
    target_protein_g: '',
    target_carbohydrates_g: '',
    target_fat_g: '',
    target_fiber_g: '',
    target_water_ml: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDietData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !patientId) {
      toast({
        title: "Erro",
        description: "Dados necessários não estão disponíveis",
        variant: "destructive",
      });
      return;
    }
    
    if (!dietData.start_date || !dietData.end_date) {
      toast({
        title: "Erro de validação",
        description: "As datas de início e fim são obrigatórias",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('diets')
        .insert({
          patient_id: patientId,
          nutritionist_id: user.id,
          start_date: dietData.start_date,
          end_date: dietData.end_date,
          target_calories: dietData.target_calories ? parseFloat(dietData.target_calories) : null,
          target_protein_g: dietData.target_protein_g ? parseFloat(dietData.target_protein_g) : null,
          target_carbohydrates_g: dietData.target_carbohydrates_g ? parseFloat(dietData.target_carbohydrates_g) : null,
          target_fat_g: dietData.target_fat_g ? parseFloat(dietData.target_fat_g) : null,
          target_fiber_g: dietData.target_fiber_g ? parseFloat(dietData.target_fiber_g) : null,
          target_water_ml: dietData.target_water_ml ? parseFloat(dietData.target_water_ml) : null
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Dieta criada com sucesso",
      });
      
      navigate(`/nutritionist/patient/${patientId}`);
    } catch (error: any) {
      console.error("Erro ao criar dieta:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao criar a dieta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NutritionistLayout title="Criar Nova Dieta">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl text-green-900 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-green-600" />
              Nova Dieta
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-800 flex items-center gap-2">
                  <CalendarRange className="h-5 w-5" />
                  Período da Dieta
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Data de Início*</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={dietData.start_date}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Data de Término*</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={dietData.end_date}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-800 flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Metas Nutricionais
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="target_calories">Calorias Diárias (kcal)</Label>
                    <Input
                      id="target_calories"
                      name="target_calories"
                      type="number"
                      placeholder="2000"
                      value={dietData.target_calories}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target_protein_g">Proteínas (g)</Label>
                    <Input
                      id="target_protein_g"
                      name="target_protein_g"
                      type="number"
                      placeholder="120"
                      value={dietData.target_protein_g}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target_carbohydrates_g">Carboidratos (g)</Label>
                    <Input
                      id="target_carbohydrates_g"
                      name="target_carbohydrates_g"
                      type="number"
                      placeholder="250"
                      value={dietData.target_carbohydrates_g}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target_fat_g">Gorduras (g)</Label>
                    <Input
                      id="target_fat_g"
                      name="target_fat_g"
                      type="number"
                      placeholder="70"
                      value={dietData.target_fat_g}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target_fiber_g">Fibras (g)</Label>
                    <Input
                      id="target_fiber_g"
                      name="target_fiber_g"
                      type="number"
                      placeholder="30"
                      value={dietData.target_fiber_g}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target_water_ml">Água (ml)</Label>
                    <Input
                      id="target_water_ml"
                      name="target_water_ml"
                      type="number"
                      placeholder="2500"
                      value={dietData.target_water_ml}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/nutritionist/patient/${patientId}`)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Salvando..." : "Criar Dieta"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </NutritionistLayout>
  );
}
