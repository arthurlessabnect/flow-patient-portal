import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Utensils, CalendarRange, FileUp, FileText } from "lucide-react";

export default function CreateDiet() {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "pdf" | "meals">("details");
  const [dietPdf, setDietPdf] = useState<File | null>(null);
  const [dietData, setDietData] = useState({
    name: 'Novo Plano Alimentar',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDietPdf(e.target.files[0]);
    }
  };

  const uploadPdf = async () => {
    if (!dietPdf || !patientId || !user) return null;
    
    try {
      const fileExt = dietPdf.name.split('.').pop();
      const fileName = `${patientId}-${Date.now()}.${fileExt}`;
      const filePath = `dietplans/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('diet-files')
        .upload(filePath, dietPdf);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('diet-files')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      return null;
    }
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
    
    if (!dietData.start_date) {
      toast({
        title: "Erro de validação",
        description: "A data de início é obrigatória",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      let dietPdfUrl = null;
      if (dietPdf && activeTab === "pdf") {
        dietPdfUrl = await uploadPdf();
      }
      
      const { data, error } = await supabase
        .from('diets')
        .insert({
          patient_id: patientId,
          nutritionist_id: user.id,
          name: dietData.name,
          start_date: dietData.start_date,
          end_date: dietData.end_date || null,
          target_calories: dietData.target_calories ? parseFloat(dietData.target_calories) : null,
          target_protein_g: dietData.target_protein_g ? parseFloat(dietData.target_protein_g) : null,
          target_carbohydrate_g: dietData.target_carbohydrates_g ? parseFloat(dietData.target_carbohydrates_g) : null,
          target_fat_g: dietData.target_fat_g ? parseFloat(dietData.target_fat_g) : null,
          target_fiber_g: dietData.target_fiber_g ? parseFloat(dietData.target_fiber_g) : null,
          target_water_ml: dietData.target_water_ml ? parseFloat(dietData.target_water_ml) : null,
          diet_pdf_url: dietPdfUrl
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
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 p-1 w-full">
              <TabsTrigger value="details" className="text-sm">
                Dados Básicos
              </TabsTrigger>
              <TabsTrigger value="pdf" className="text-sm">
                Upload de PDF
              </TabsTrigger>
              <TabsTrigger value="meals" className="text-sm">
                Configurar Refeições
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="details" className="space-y-4 p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Plano Alimentar</Label>
                    <Input
                      id="name"
                      name="name"
                      value={dietData.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
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
                      <Label htmlFor="end_date">Data de Término</Label>
                      <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={dietData.end_date}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-green-800 flex items-center gap-2 pt-4">
                    <PlusCircle className="h-5 w-5" />
                    Metas Nutricionais Diárias
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="target_calories">Calorias (kcal)</Label>
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
              </TabsContent>
              
              <TabsContent value="pdf" className="p-4">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium text-green-800">Upload de Plano Alimentar em PDF</h3>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                    <FileUp className="h-12 w-12 text-gray-400 mb-4" />
                    
                    <p className="text-lg font-medium mb-2">Arraste e solte o arquivo PDF ou clique para selecionar</p>
                    <p className="text-sm text-gray-500 mb-4">PDF (máx. 5MB)</p>
                    
                    <Input
                      id="diet-pdf"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('diet-pdf')?.click()}
                      className="mb-2"
                    >
                      Selecionar arquivo
                    </Button>
                    
                    {dietPdf && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{dietPdf.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Faça upload de um arquivo PDF com o plano alimentar completo.
                    Este arquivo será disponibilizado para visualização do paciente.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="meals" className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-medium text-green-800">Configurar Refeições</h3>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {}}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      disabled
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Refeição
                    </Button>
                  </div>
                  
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma refeição adicionada</h3>
                    <p className="text-gray-500 mb-4">
                      Adicione refeições para configurar o plano alimentar completo.
                    </p>
                    <p className="text-sm text-gray-500">
                      Esta funcionalidade será implementada em breve.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
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
                  disabled={isLoading || (activeTab === "pdf" && !dietPdf)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Salvando..." : "Salvar Dieta"}
                </Button>
              </CardFooter>
            </form>
          </Tabs>
        </Card>
      </div>
    </NutritionistLayout>
  );
}
