
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AddPatientFormData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddPatient() {
  const [formData, setFormData] = useState<AddPatientFormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    birth_date: "",
    height: 0,
    initial_weight: 0,
    goal: "",
    body_fat_percentage: 0,
    bmr: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric inputs
    if (
      ["height", "initial_weight", "body_fat_percentage", "bmr"].includes(name)
    ) {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }
    
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "name", 
      "email", 
      "height", 
      "initial_weight", 
      "goal",
      "gender"
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof AddPatientFormData]) {
        toast({
          title: "Erro de validação",
          description: `Por favor, preencha o campo ${field}`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar um paciente",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create patient directly in the database
      const { data, error } = await supabase
        .from('patients')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          gender: formData.gender,
          birth_date: formData.birth_date || null,
          height_cm: formData.height || null,
          initial_weight_kg: formData.initial_weight || null,
          body_fat_percentage: formData.body_fat_percentage || null,
          basal_metabolic_rate: formData.bmr || null,
          goal: formData.goal,
          nutritionist_id: user.id
        })
        .select();
      
      if (error) {
        throw new Error(`Erro ao criar paciente: ${error.message}`);
      }
      
      toast({
        title: "Sucesso!",
        description: "Paciente adicionado com sucesso",
      });
      
      navigate("/nutritionist/patients");
    } catch (error: any) {
      console.error("Erro ao adicionar paciente:", error);
      
      toast({
        title: "Erro ao adicionar paciente",
        description: error.message || "Ocorreu um erro ao adicionar o paciente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NutritionistLayout title="Adicionar Paciente">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl text-green-900">Adicionar Novo Paciente</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-800">Informações Pessoais</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo*</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nome do paciente"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero*</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange(value, "gender")}
                      defaultValue={formData.gender}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Data de Nascimento (DD/MM/AAAA)</Label>
                    <Input
                      id="birth_date"
                      name="birth_date"
                      placeholder="15/05/1985"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-800">Informações Nutricionais</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)*</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      placeholder="170"
                      value={formData.height || ""}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="initial_weight">Peso Inicial (kg)*</Label>
                    <Input
                      id="initial_weight"
                      name="initial_weight"
                      type="number"
                      step="0.1"
                      placeholder="70.5"
                      value={formData.initial_weight || ""}
                      onChange={handleInputChange}
                      disabled={isLoading}
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
                      value={formData.body_fat_percentage || ""}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bmr">TMB (kcal)</Label>
                    <Input
                      id="bmr"
                      name="bmr"
                      type="number"
                      placeholder="1500"
                      value={formData.bmr || ""}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="goal">Objetivo*</Label>
                    <Input
                      id="goal"
                      name="goal"
                      placeholder="Ex: Perda de peso, Ganho de massa, Manutenção..."
                      value={formData.goal}
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
                onClick={() => navigate("/nutritionist/patients")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Salvando..." : "Adicionar Paciente"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </NutritionistLayout>
  );
}
