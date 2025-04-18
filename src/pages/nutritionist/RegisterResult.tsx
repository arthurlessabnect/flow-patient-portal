
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { LineChart, CalendarDays } from "lucide-react";

export default function RegisterResult() {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    record_date: new Date().toISOString().split('T')[0],
    weight_kg: '',
    body_fat_percentage: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    },
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId || !formData.weight_kg) {
      toast({
        title: "Erro de validação",
        description: "Peso é obrigatório",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('patient_progress')
        .insert({
          patient_id: patientId,
          record_date: formData.record_date,
          weight_kg: parseFloat(formData.weight_kg),
          body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
          measurements: {
            chest: formData.measurements.chest ? parseFloat(formData.measurements.chest) : null,
            waist: formData.measurements.waist ? parseFloat(formData.measurements.waist) : null,
            hips: formData.measurements.hips ? parseFloat(formData.measurements.hips) : null,
            arms: formData.measurements.arms ? parseFloat(formData.measurements.arms) : null,
            thighs: formData.measurements.thighs ? parseFloat(formData.measurements.thighs) : null
          },
          notes: formData.notes
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Resultado registrado com sucesso",
      });
      
      navigate(`/nutritionist/patient/${patientId}`);
    } catch (error: any) {
      console.error("Erro ao registrar resultado:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao registrar o resultado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NutritionistLayout title="Registrar Resultado">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl text-green-900 flex items-center gap-2">
              <LineChart className="h-5 w-5 text-green-600" />
              Novo Registro de Resultado
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-800 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Data e Informações Principais
                </h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="record_date">Data do Registro*</Label>
                    <Input
                      id="record_date"
                      name="record_date"
                      type="date"
                      value={formData.record_date}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight_kg">Peso (kg)*</Label>
                    <Input
                      id="weight_kg"
                      name="weight_kg"
                      type="number"
                      step="0.1"
                      placeholder="70.5"
                      value={formData.weight_kg}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="body_fat_percentage">% de Gordura Corporal</Label>
                    <Input
                      id="body_fat_percentage"
                      name="body_fat_percentage"
                      type="number"
                      step="0.1"
                      placeholder="25.0"
                      value={formData.body_fat_percentage}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-800">Medidas (cm)</h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="chest">Peitoral</Label>
                    <Input
                      id="chest"
                      name="chest"
                      type="number"
                      step="0.1"
                      placeholder="95.0"
                      value={formData.measurements.chest}
                      onChange={handleMeasurementChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waist">Cintura</Label>
                    <Input
                      id="waist"
                      name="waist"
                      type="number"
                      step="0.1"
                      placeholder="80.0"
                      value={formData.measurements.waist}
                      onChange={handleMeasurementChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hips">Quadril</Label>
                    <Input
                      id="hips"
                      name="hips"
                      type="number"
                      step="0.1"
                      placeholder="100.0"
                      value={formData.measurements.hips}
                      onChange={handleMeasurementChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="arms">Braços</Label>
                    <Input
                      id="arms"
                      name="arms"
                      type="number"
                      step="0.1"
                      placeholder="35.0"
                      value={formData.measurements.arms}
                      onChange={handleMeasurementChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thighs">Coxas</Label>
                    <Input
                      id="thighs"
                      name="thighs"
                      type="number"
                      step="0.1"
                      placeholder="55.0"
                      value={formData.measurements.thighs}
                      onChange={handleMeasurementChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Observações e notas sobre o progresso do paciente..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                />
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
                {isLoading ? "Salvando..." : "Registrar Resultado"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </NutritionistLayout>
  );
}
